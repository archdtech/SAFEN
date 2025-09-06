"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Header } from "@/components/header";
import { SafeSimulator } from "@/components/safe-simulator";
import { SafeSimulatorClient, type SafeSimulatorClientRef } from "@/components/safe-simulator-client";

export default function Home() {
  const reportRef = useRef<HTMLDivElement>(null);
  const simulatorRef = useRef<SafeSimulatorClientRef>(null);

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: "SAFE-Navigator-Report",
    onBeforePrint: () => {
      // Potentially trigger something on the client before printing
      if(simulatorRef.current) {
        // e.g. simulatorRef.current.logSomething();
      }
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header handlePrint={handlePrint} />
      <main className="flex-1">
        <SafeSimulator ref={simulatorRef} reportRef={reportRef} />
      </main>
    </div>
  );
}
