"use client";

import { useState, useEffect } from "react";
import { SafeSimulatorClient } from "./safe-simulator-client";

export function SafeSimulator() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Render a placeholder or loader on the server
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12 text-center">
            Loading Simulator...
        </div>
    );
  }

  return <SafeSimulatorClient />;
}
