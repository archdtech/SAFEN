"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Header } from "@/components/header";
import { SafeSimulator } from "@/components/safe-simulator";
import { type SafeSimulatorClientRef } from "@/components/safe-simulator-client";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function Home() {
  const reportRef = useRef<HTMLDivElement>(null);
  const simulatorRef = useRef<SafeSimulatorClientRef>(null);

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: "SAFE-Navigator-Report",
  });

  const PrintButton = (
    <Button onClick={handlePrint} variant="outline">
      <Printer className="mr-2" />
      Export to PDF
    </Button>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header ActionButton={PrintButton} />
      <main className="flex-1">
        <SafeSimulator ref={simulatorRef} reportRef={reportRef} />
      </main>
    </div>
  );
}
