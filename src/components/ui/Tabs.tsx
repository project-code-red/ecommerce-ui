"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: { id: string; label: string; content: React.ReactNode }[];
  defaultTab?: string;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab, className }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className={cn("w-full", className)}>
      <div className="border-b border-gray-200 overflow-x-auto scrollbar-hide">
        <nav 
          className="flex space-x-4 sm:space-x-8 min-w-max sm:min-w-0" 
          aria-label="Tabs"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "whitespace-nowrap py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium transition-colors",
                "text-sm sm:text-base",
                "min-h-[44px] flex items-center", // Mobile touch target
                activeTab === tab.id
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4 sm:mt-6">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

