"use client";

import { useOfferPopup } from "@/hooks/useOfferPopup";
import { OfferPopup } from "./OfferPopup";

export function OfferPopupWrapper() {
  const { isOpen, closePopup, dismissPopup } = useOfferPopup();

  return (
    <OfferPopup
      isOpen={isOpen}
      onClose={closePopup}
      onDismiss={dismissPopup}
    />
  );
}

