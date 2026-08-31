/**
 * RevenueCat In-App Purchases Configuration (Temporarily Disabled)
 *
 * import { Capacitor } from "@capacitor/core";
 * import { Purchases, LOG_LEVEL, PurchasesPackage, CustomerInfo } from "@revenuecat/purchases-capacitor";
 *
 * export const REVENUECAT_ENTITLEMENT_ID = "celestial_premium";
 *
 * export interface RevenueCatPlan {
 *   id: string;
 *   identifier: string;
 *   name: string;
 *   priceString: string;
 *   period: string;
 *   description: string;
 *   rawPackage?: PurchasesPackage;
 * }
 *
 * let isInitialized = false;
 *
 * export function getRevenueCatApiKey(): string {
 *   const platform = Capacitor.getPlatform();
 *   if (platform === "ios") {
 *     return process.env.NEXT_PUBLIC_REVENUECAT_APPLE_API_KEY || "appl_placeholder_revenuecat_api_key";
 *   }
 *   return process.env.NEXT_PUBLIC_REVENUECAT_GOOGLE_API_KEY || "goog_placeholder_revenuecat_api_key";
 * }
 *
 * export async function initRevenueCat(userId?: string): Promise<boolean> {
 *   if (typeof window === "undefined") return false;
 *   if (!Capacitor.isNativePlatform()) {
 *     console.info("RevenueCat: Running on Web/Browser. Native In-App purchases will be simulated.");
 *     return false;
 *   }
 *
 *   const apiKey = getRevenueCatApiKey();
 *   try {
 *     if (!isInitialized) {
 *       await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
 *       await Purchases.configure({
 *         apiKey,
 *         appUserID: userId || undefined,
 *       });
 *       isInitialized = true;
 *     } else if (userId) {
 *       await Purchases.logIn({ appUserID: userId });
 *     }
 *     return true;
 *   } catch (error) {
 *     console.error("RevenueCat initialization error:", error);
 *     return false;
 *   }
 * }
 *
 * export async function identifyRevenueCatUser(userId: string): Promise<void> {
 *   if (!Capacitor.isNativePlatform() || !isInitialized) return;
 *   try {
 *     await Purchases.logIn({ appUserID: userId });
 *   } catch (error) {
 *     console.error("RevenueCat logIn error:", error);
 *   }
 * }
 *
 * export async function resetRevenueCatUser(): Promise<void> {
 *   if (!Capacitor.isNativePlatform() || !isInitialized) return;
 *   try {
 *     await Purchases.logOut();
 *   } catch (error) {
 *     console.error("RevenueCat logOut error:", error);
 *   }
 * }
 *
 * export async function getRevenueCatOfferings(): Promise<RevenueCatPlan[]> {
 *   if (!Capacitor.isNativePlatform() || !isInitialized) {
 *     return [
 *       {
 *         id: "monthly",
 *         identifier: "$rc_monthly",
 *         name: "Celestial Monthly",
 *         priceString: "$9.99 / mo",
 *         period: "Monthly",
 *         description: "Full access to all sanctuary soundscapes, AI guidance & rituals.",
 *       },
 *       {
 *         id: "annual",
 *         identifier: "$rc_annual",
 *         name: "Celestial Annual (Best Value)",
 *         priceString: "$59.99 / yr",
 *         period: "Yearly ($4.99/mo)",
 *         description: "Save 50% + 7-Day Free Trial. Unlimited guidance and cosmic features.",
 *       },
 *     ];
 *   }
 *
 *   try {
 *     const offerings = await Purchases.getOfferings();
 *     if (offerings.current && offerings.current.availablePackages.length > 0) {
 *       return offerings.current.availablePackages.map((pkg) => ({
 *         id: pkg.identifier,
 *         identifier: pkg.identifier,
 *         name: pkg.product.title || pkg.identifier,
 *         priceString: pkg.product.priceString,
 *         period: pkg.packageType,
 *         description: pkg.product.description,
 *         rawPackage: pkg,
 *       }));
 *     }
 *   } catch (error) {
 *     console.error("RevenueCat getOfferings error:", error);
 *   }
 *
 *   return [];
 * }
 *
 * export async function purchaseRevenueCatPackage(pkg: PurchasesPackage): Promise<{
 *   success: boolean;
 *   customerInfo?: CustomerInfo;
 *   isPremium: boolean;
 *   error?: string;
 * }> {
 *   if (!Capacitor.isNativePlatform() || !isInitialized) {
 *     return { success: true, isPremium: true };
 *   }
 *
 *   try {
 *     const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
 *     const isPremium = Boolean(customerInfo.entitlements.active[REVENUECAT_ENTITLEMENT_ID]);
 *     if (isPremium) {
 *       await syncRevenueCatWithBackend(customerInfo);
 *     }
 *     return { success: true, customerInfo, isPremium };
 *   } catch (error: any) {
 *     if (error.userCancelled) {
 *       return { success: false, isPremium: false, error: "Purchase was cancelled." };
 *     }
 *     return { success: false, isPremium: false, error: error.message || "Purchase failed." };
 *   }
 * }
 *
 * export async function restoreRevenueCatPurchases(): Promise<{
 *   success: boolean;
 *   isPremium: boolean;
 *   customerInfo?: CustomerInfo;
 * }> {
 *   if (!Capacitor.isNativePlatform() || !isInitialized) {
 *     return { success: true, isPremium: true };
 *   }
 *
 *   try {
 *     const { customerInfo } = await Purchases.restorePurchases();
 *     const isPremium = Boolean(customerInfo.entitlements.active[REVENUECAT_ENTITLEMENT_ID]);
 *     if (isPremium) {
 *       await syncRevenueCatWithBackend(customerInfo);
 *     }
 *     return { success: true, isPremium, customerInfo };
 *   } catch (error) {
 *     return { success: false, isPremium: false };
 *   }
 * }
 *
 * async function syncRevenueCatWithBackend(customerInfo: CustomerInfo): Promise<void> {
 *   try {
 *     await fetch("/api/subscriptions/revenuecat", {
 *       method: "POST",
 *       headers: { "Content-Type": "application/json" },
 *       body: JSON.stringify({
 *         rcAppUserId: customerInfo.originalAppUserId,
 *         activeEntitlements: Object.keys(customerInfo.entitlements.active),
 *         allPurchasedProductIdentifiers: customerInfo.allPurchasedProductIdentifiers,
 *       }),
 *     });
 *   } catch { }
 * }
 */

export const REVENUECAT_DISABLED = true;

