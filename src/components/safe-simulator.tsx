"use client";

import React, { useState, useEffect, forwardRef } from "react";
import { SafeSimulatorClient, type SafeSimulatorClientRef } from "./safe-simulator-client";

interface SafeSimulatorProps {
  reportRef: React.RefObject<HTMLDivElement>;
}

export const SafeSimulator = forwardRef<SafeSimulatorClientRef, SafeSimulatorProps>(({ reportRef }, ref) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12 text-center">
            Loading Simulator...
        </div>
    );
  }

  return <SafeSimulatorClient ref={ref} reportRef={reportRef} />;
});

SafeSimulator.displayName = 'SafeSimulator';
