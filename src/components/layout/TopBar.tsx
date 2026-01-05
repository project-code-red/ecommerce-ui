"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Smartphone, HelpCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopBarMessage {
  icon?: string;
  text: string;
  bold?: boolean;
}

interface TopBarProps {
  variant?: "static" | "auto-scroll";
  dismissible?: boolean;
  messages?: TopBarMessage[];
  showAppDownload?: boolean;
  showHelp?: boolean;
}

const defaultMessages: TopBarMessage[] = [
  { icon: "🔥", text: "UP TO 50% OFF", bold: true },
  { text: "Free Shipping", bold: false },
  { text: "New Arrivals", bold: false },
];

export function TopBar({
  variant = "static",
  dismissible = false,
  messages = defaultMessages,
  showAppDownload = true,
  showHelp = true,
}: TopBarProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Auto-scroll effect
  useEffect(() => {
    if (variant === "auto-scroll" && !isDismissed) {
      const interval = setInterval(() => {
        setScrollPosition((prev) => {
          const element = document.getElementById("topbar-content");
          if (element) {
            const maxScroll = element.scrollWidth - element.clientWidth;
            if (prev >= maxScroll) {
              return 0; // Reset to start
            }
            return prev + 1; // Scroll speed
          }
          return prev;
        });
      }, 50); // Update every 50ms for smooth scrolling

      return () => clearInterval(interval);
    }
  }, [variant, isDismissed]);

  if (isDismissed) return null;

  return (
    <div className="hidden md:block sticky top-0 z-[60] bg-secondary text-white border-b border-white/5">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-9 text-xs md:text-sm">
          {/* Left Content */}
          <div className="flex-1 flex items-center min-w-0">
            {variant === "auto-scroll" ? (
              <div className="overflow-hidden w-full">
                <div
                  id="topbar-content"
                  className="flex items-center space-x-6 whitespace-nowrap transition-transform duration-75 ease-linear"
                  style={{ transform: `translateX(-${scrollPosition}px)` }}
                >
                  {[...messages, ...messages].map((msg, idx, arr) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-2"
                    >
                      {msg.icon && <span>{msg.icon}</span>}
                      <span className={msg.bold ? "font-semibold" : ""}>
                        {msg.text}
                      </span>
                      {idx < arr.length - 1 && (
                        <span className="text-white/70">|</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4 md:space-x-6">
                {messages.map((msg, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-2"
                  >
                    {msg.icon && <span>{msg.icon}</span>}
                    <span className={msg.bold ? "font-semibold" : ""}>
                      {msg.text}
                    </span>
                    {idx < messages.length - 1 && (
                      <span className="text-white/70 hidden sm:inline ml-4 md:ml-6">
                        |
                      </span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Content */}
          <div className="flex items-center space-x-4 md:space-x-6 flex-shrink-0 ml-4">
            {showAppDownload && (
              <>
                <Link
                  href="/app-download"
                  className="inline-flex items-center space-x-1.5 hover:text-gray-300 transition-colors"
                >
                  <Smartphone className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">App Download</span>
                </Link>
                {showHelp && <span className="text-white/30">|</span>}
              </>
            )}
            {showHelp && (
              <Link
                href="/help"
                className="inline-flex items-center space-x-1.5 hover:text-gray-300 transition-colors"
              >
                <HelpCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Help</span>
              </Link>
            )}
            {dismissible && (
              <>
                {(showAppDownload || showHelp) && (
                  <span className="text-white/30">|</span>
                )}
                <button
                  onClick={() => setIsDismissed(true)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
