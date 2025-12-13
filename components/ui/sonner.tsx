"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        style: {
          borderRadius: 9999,
          fontSize: 14,
        },
      }}
    />
  );
}
