"use client";

import { useState, useEffect } from "react";
import { SafeSimulatorClient } from "./safe-simulator-client";

export function SafeSimulator() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <SafeSimulatorClient /> : null;
}
