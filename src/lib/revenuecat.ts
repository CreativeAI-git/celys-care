import { Capacitor } from "@capacitor/core";
import { Purchases, LOG_LEVEL, PurchasesPackage, CustomerInfo } from "@revenuecat/purchases-capacitor";

export const REVENUECAT_ENTITLEMENT_ID = "celys_care_pro";
export const REVENUECAT_ENTITLEMENT_IDS = ["celys_care_pro", "celestial_premium"];

export function hasActivePremiumEntitlement(customerInfo?: CustomerInfo): boolean {
  if (!customerInfo?.entitlements?.active) return false;
  return (
    REVENUECAT_ENTITLEMENT_IDS.some((id) => Boolean(customerInfo.entitlements.active[id])) ||
    Object.keys(customerInfo.entitlements.active).length > 0
  );
}

export interface RevenueCatPlan {
  id: string;
  identifier: string;
  name: string;
  priceString: string;
  period: string;
  description: string;
  rawPackage?: PurchasesPackage;
}

let isInitialized = false;

export function getRevenueCatApiKey(): string {
  const platform = Capacitor.getPlatform();
  if (platform === "ios") {
    return process.env.NEXT_PUBLIC_REVENUECAT_APPLE_API_KEY || "appl_placeholder_revenuecat_api_key";
  }
  return process.env.NEXT_PUBLIC_REVENUECAT_GOOGLE_API_KEY || "goog_placeholder_revenuecat_api_key";
}

export async function initRevenueCat(userId?: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!Capacitor.isNativePlatform()) {
    console.info("RevenueCat: Running on Web/Browser. Native In-App purchases will be simulated.");
    return false;
  }

  const apiKey = getRevenueCatApiKey();
  try {
    if (!isInitialized) {
      await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
      await Purchases.configure({
        apiKey,
        appUserID: userId || undefined,
      });
      isInitialized = true;
    } else if (userId) {
      await Purchases.logIn({ appUserID: userId });
    }
    return true;
  } catch (error) {
    console.error("RevenueCat initialization error:", error);
    return false;
  }
}

export async function identifyRevenueCatUser(userId: string): Promise<void> {
  if (!Capacitor.isNativePlatform() || !isInitialized) return;
  try {
    await Purchases.logIn({ appUserID: userId });
  } catch (error) {
    console.error("RevenueCat logIn error:", error);
  }
}

export async function resetRevenueCatUser(): Promise<void> {
  if (!Capacitor.isNativePlatform() || !isInitialized) return;
  try {
    await Purchases.logOut();
  } catch (error) {
    console.error("RevenueCat logOut error:", error);
  }
}

export async function getRevenueCatOfferings(): Promise<RevenueCatPlan[]> {
  if (!Capacitor.isNativePlatform() || !isInitialized) {
    return [
      {
        id: "monthly",
        identifier: "$rc_monthly",
        name: "Celestial Monthly",
        priceString: "$9.99 / mo",
        period: "Monthly",
        description: "Full access to all sanctuary soundscapes, AI guidance & rituals.",
      },
      {
        id: "annual",
        identifier: "$rc_annual",
        name: "Celestial Annual (Best Value)",
        priceString: "$59.99 / yr",
        period: "Yearly ($4.99/mo)",
        description: "Save 50% + 7-Day Free Trial. Unlimited guidance and cosmic features.",
      },
    ];
  }

  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current && offerings.current.availablePackages.length > 0) {
      return offerings.current.availablePackages.map((pkg) => ({
        id: pkg.identifier,
        identifier: pkg.identifier,
        name: pkg.product.title || pkg.identifier,
        priceString: pkg.product.priceString,
        period: pkg.packageType,
        description: pkg.product.description,
        rawPackage: pkg,
      }));
    }
  } catch (error) {
    console.error("RevenueCat getOfferings error:", error);
  }

  return [];
}

export async function purchaseRevenueCatPackage(pkg: PurchasesPackage): Promise<{
  success: boolean;
  customerInfo?: CustomerInfo;
  isPremium: boolean;
  error?: string;
}> {
  if (!Capacitor.isNativePlatform() || !isInitialized) {
    return { success: true, isPremium: true };
  }

  try {
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
    const isPremium = hasActivePremiumEntitlement(customerInfo);
    if (isPremium) {
      await syncRevenueCatWithBackend(customerInfo);
    }
    return { success: true, customerInfo, isPremium };
  } catch (error: any) {
    if (error.userCancelled) {
      return { success: false, isPremium: false, error: "Purchase was cancelled." };
    }
    return { success: false, isPremium: false, error: error.message || "Purchase failed." };
  }
}

/**
 * End-to-end subscription purchase handler
 * Automatically handles SDK initialization, fetching offerings, finding the target package,
 * triggering the native Google Play / Apple sheet, and syncing with backend.
 */
export async function purchaseRevenueCatPlan(
  billing: "monthly" | "annual",
  userId?: string
): Promise<{
  success: boolean;
  isPremium: boolean;
  isBrowser?: boolean;
  error?: string;
}> {
  // 1. Check if running in browser / non-native
  if (typeof window !== "undefined" && !Capacitor.isNativePlatform()) {
    return {
      success: false,
      isPremium: false,
      isBrowser: true,
      error: "Browser Mode: Google Play Billing dialog only opens inside the native Android App (.apk) on a mobile device.",
    };
  }

  // 2. Ensure SDK is initialized
  try {
    if (!isInitialized) {
      const initialized = await initRevenueCat(userId);
      if (!initialized) {
        return {
          success: false,
          isPremium: false,
          error: "Failed to connect to Google Play Billing. Please check your internet connection.",
        };
      }
    }

    if (userId) {
      await Purchases.logIn({ appUserID: userId });
    }

    // 3. Fetch offerings from Google Play
    const offerings = await Purchases.getOfferings();
    if (!offerings.current || !offerings.current.availablePackages || offerings.current.availablePackages.length === 0) {
      return {
        success: false,
        isPremium: false,
        error: "Google Play returned no active products. Please verify your app is uploaded to Internal Testing on Google Play Console and license tester email is active.",
      };
    }

    // 4. Find the matching package
    const packages = offerings.current.availablePackages;
    const targetPkg = packages.find((pkg) => {
      const id = (pkg.identifier || "").toLowerCase();
      const type = (pkg.packageType || "").toLowerCase();
      if (billing === "annual") {
        return id.includes("annual") || id.includes("year") || type === "annual";
      }
      return id.includes("monthly") || id.includes("month") || type === "monthly";
    }) || packages[0];

    if (!targetPkg) {
      return {
        success: false,
        isPremium: false,
        error: `Could not find a ${billing} plan in Google Play Store packages.`,
      };
    }

    // 5. Trigger Native Google Play Billing Dialog!
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: targetPkg });
    const isPremium = hasActivePremiumEntitlement(customerInfo);

    if (isPremium) {
      await syncRevenueCatWithBackend(customerInfo);
      return { success: true, isPremium: true };
    }

    return {
      success: false,
      isPremium: false,
      error: "Payment processed, but entitlement was not active. Please tap 'Restore purchase'.",
    };
  } catch (error: any) {
    if (error.userCancelled) {
      return { success: false, isPremium: false, error: "Payment was cancelled." };
    }
    return {
      success: false,
      isPremium: false,
      error: error.message || "Google Play Store payment failed.",
    };
  }
}

export async function restoreRevenueCatPurchases(): Promise<{
  success: boolean;
  isPremium: boolean;
  customerInfo?: CustomerInfo;
}> {
  if (!Capacitor.isNativePlatform() || !isInitialized) {
    return { success: true, isPremium: true };
  }

  try {
    const { customerInfo } = await Purchases.restorePurchases();
    const isPremium = hasActivePremiumEntitlement(customerInfo);
    if (isPremium) {
      await syncRevenueCatWithBackend(customerInfo);
    }
    return { success: true, isPremium, customerInfo };
  } catch (error) {
    return { success: false, isPremium: false };
  }
}

export async function checkRevenueCatSubscription(): Promise<boolean> {
  if (!Capacitor.isNativePlatform() || !isInitialized) return false;
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    const isPremium = hasActivePremiumEntitlement(customerInfo);
    await syncRevenueCatWithBackend(customerInfo);
    return isPremium;
  } catch (error) {
    console.error("RevenueCat check subscription error:", error);
    return false;
  }
}

async function syncRevenueCatWithBackend(customerInfo: CustomerInfo): Promise<void> {
  try {
    await fetch("/api/subscriptions/revenuecat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rcAppUserId: customerInfo.originalAppUserId,
        activeEntitlements: Object.keys(customerInfo.entitlements.active),
        allPurchasedProductIdentifiers: customerInfo.allPurchasedProductIdentifiers,
      }),
    });
  } catch { }
}

