"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "offer_popup_dismissed";
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const SHOW_DELAY = 1200; // 1.2 seconds

interface UseOfferPopupReturn {
  isOpen: boolean;
  openPopup: () => void;
  closePopup: () => void;
  dismissPopup: () => void;
}

export function useOfferPopup(): UseOfferPopupReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if popup was dismissed recently
    const dismissedData = localStorage.getItem(STORAGE_KEY);
    if (dismissedData) {
      const dismissedTime = parseInt(dismissedData, 10);
      const now = Date.now();
      
      // If dismissed less than 7 days ago, don't show
      if (now - dismissedTime < DISMISS_DURATION) {
        return;
      }
    }

    // Show popup after delay
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, SHOW_DELAY);

    return () => clearTimeout(timer);
  }, []);

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const dismissPopup = () => {
    setIsOpen(false);
    // Store dismissal timestamp
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  return {
    isOpen: mounted ? isOpen : false,
    openPopup,
    closePopup,
    dismissPopup,
  };
}

