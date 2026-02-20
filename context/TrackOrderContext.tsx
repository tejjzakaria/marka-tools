/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */

"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface TrackOrderContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const TrackOrderContext = createContext<TrackOrderContextType | undefined>(undefined);

export function TrackOrderProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <TrackOrderContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </TrackOrderContext.Provider>
  );
}

export function useTrackOrder() {
  const context = useContext(TrackOrderContext);
  if (context === undefined) {
    throw new Error("useTrackOrder must be used within a TrackOrderProvider");
  }
  return context;
}
