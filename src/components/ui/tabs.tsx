"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (val: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

export function Tabs({
  value,
  onValueChange,
  defaultValue = "",
  children,
  className,
}: {
  value?: string;
  onValueChange?: (val: string) => void;
  defaultValue?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [tab, setTab] = React.useState(defaultValue || value || "");
  const currentTab = value !== undefined ? value : tab;

  const handleTabChange = (newVal: string) => {
    setTab(newVal);
    onValueChange?.(newVal);
  };

  return (
    <TabsContext.Provider value={{ activeTab: currentTab, setActiveTab: handleTabChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-2xl bg-white/5 p-1 text-purple-200/70 border border-purple-400/20 backdrop-blur-md",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be within Tabs");

  const isActive = context.activeTab === value;

  return (
    <button
      onClick={() => context.setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-1.5 text-xs font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-gradient-to-r from-[#c96ccc]/30 to-[#7c3aed]/40 text-white shadow-sm border border-purple-400/40"
          : "hover:text-white hover:bg-white/5",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be within Tabs");

  if (context.activeTab !== value) return null;

  return (
    <div className={cn("mt-4 focus-visible:outline-none animate-in fade-in-50 duration-200", className)}>
      {children}
    </div>
  );
}

export default Tabs;
