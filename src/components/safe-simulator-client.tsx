"use client";

import { useState, useMemo, forwardRef, useImperativeHandle } from "react";
import { OwnershipChart } from "./ownership-chart";
import { ExplanationCard } from "./explanation-card";
import type { ExplainSafeTermsInput } from "@/ai/flows/explain-safe-terms";
import { SafeAgreementCard } from "./safe-agreement-card";
import { ScenarioModelingCard } from "./scenario-modeling-card";
import { ScenarioTemplates } from "./scenario-templates";
import { KeyMetricsCard } from "./key-metrics-card";
import type { Safe } from "@/types";
import { Separator } from "@/components/ui/separator";
import { Report } from "./report";

const PRE_ROUND_SHARES = 10_000_000;

function calculateEquity(
  safes: Safe[],
  futureValuation: number,
  isPostMoney: boolean,
  isProMode: boolean,
) {
  if (futureValuation <= 0 || PRE_ROUND_SHARES <= 0) {
    return {
      founderEquity: 100,
      safeHolderEquity: 0,
      chartData: [{ name: "Founders", value: 100 }],
      totalSafeInvestment: 0,
      totalSharesToSafeHolders: 0,
      effectiveSafePrice: 0,
    };
  }

  const totalSafeInvestment = safes.reduce((acc, s) => acc + s.investmentAmount, 0);
  const conversionValuation = isPostMoney ? futureValuation - totalSafeInvestment : futureValuation;

  if (conversionValuation <= 0) {
     return {
      founderEquity: 100,
      safeHolderEquity: 0,
      chartData: [{ name: "Founders", value: 100 }],
      totalSafeInvestment,
      totalSharesToSafeHolders: 0,
      effectiveSafePrice: 0,
    };
  }

  const pricedRoundPricePerShare = conversionValuation / PRE_ROUND_SHARES;
  let totalSharesToSafeHolders = 0;
  let weightedAverageSafePrice = 0;

  safes.forEach(safe => {
    if (safe.investmentAmount > 0) {
      const discountPrice = pricedRoundPricePerShare * (1 - (isProMode ? safe.discountRate : 0) / 100);
      const capPrice = safe.valuationCap > 0 
        ? safe.valuationCap / PRE_ROUND_SHARES
        : Infinity;
      
      const safeConversionPrice = Math.min(pricedRoundPricePerShare, discountPrice, capPrice);
      
      if (safeConversionPrice > 0) {
        const sharesForThisSafe = safe.investmentAmount / safeConversionPrice;
        totalSharesToSafeHolders += sharesForThisSafe;
        weightedAverageSafePrice += sharesForThisSafe * safeConversionPrice;
      }
    }
  });
  
  if (totalSharesToSafeHolders <= 0) {
     return {
      founderEquity: 100,
      safeHolderEquity: 0,
      chartData: [{ name: "Founders", value: 100 }],
      totalSafeInvestment,
      totalSharesToSafeHolders: 0,
      effectiveSafePrice: 0,
    };
  }

  const effectiveSafePrice = weightedAverageSafePrice / totalSharesToSafeHolders;
  const totalPostSafeShares = PRE_ROUND_SHARES + totalSharesToSafeHolders;

  const safeHolderOwnership = (totalSharesToSafeHolders / totalPostSafeShares) * 100;
  const founderOwnership = (PRE_ROUND_SHARES / totalPostSafeShares) * 100;

  return {
    founderEquity: founderOwnership,
    safeHolderEquity: safeHolderOwnership,
    chartData: [
      { name: "Founders", value: founderOwnership },
      { name: "SAFE Holders", value: safeHolderOwnership },
    ],
    totalSafeInvestment,
    totalSharesToSafeHolders,
    effectiveSafePrice,
  };
}

export interface SafeSimulatorClientRef {
  // Define any methods you want to expose
}

interface SafeSimulatorClientProps {
  reportRef: React.RefObject<HTMLDivElement>;
}

export const SafeSimulatorClient = forwardRef<SafeSimulatorClientRef, SafeSimulatorClientProps>(({ reportRef }, ref) => {
  const [safes, setSafes] = useState<Safe[]>([
    { id: 1, investmentAmount: 100000, valuationCap: 10000000, discountRate: 20 },
  ]);
  const [futureValuation, setFutureValuation] = useState(20_000_000);
  const [isProMode, setIsProMode] = useState(false);
  const [isPostMoney, setIsPostMoney] = useState(false);

  useImperativeHandle(ref, () => ({
    // Expose methods here
  }));

  const { 
    founderEquity, 
    safeHolderEquity, 
    chartData, 
    totalSafeInvestment,
    totalSharesToSafeHolders,
    effectiveSafePrice 
  } = useMemo(() => 
    calculateEquity(safes, futureValuation, isPostMoney, isProMode),
    [safes, futureValuation, isPostMoney, isProMode]
  );
  
  const aiTerms = useMemo<Omit<ExplainSafeTermsInput, 'customPrompt'> | null>(() => {
    const totalInvestment = safes.reduce((acc, s) => acc + s.investmentAmount, 0);
    const firstSafe = safes[0];
    if (totalInvestment > 0 && firstSafe && firstSafe.valuationCap > 0) {
      // For simplicity, we send the first SAFE's data to the AI. This could be aggregated later.
      return { 
        investmentAmount: totalInvestment, 
        valuationCap: firstSafe.valuationCap, 
        discountRate: isProMode ? firstSafe.discountRate : 0 
      };
    }
    return null;
  }, [safes, isProMode]);

  const addSafe = () => {
    setSafes([...safes, { id: Date.now(), investmentAmount: 50000, valuationCap: 12000000, discountRate: 15 }]);
  };

  const removeSafe = (id: number) => {
    setSafes(safes.filter(safe => safe.id !== id));
  };

  const updateSafe = (id: number, field: keyof Safe, value: number) => {
    setSafes(safes.map(safe => safe.id === id ? { ...safe, [field]: value } : safe));
  };

  const loadScenario = (newSafes: Safe[], newFutureValuation: number) => {
    setSafes(newSafes);
    setFutureValuation(newFutureValuation);
  };


  return (
    <>
      <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8">
        <ScenarioTemplates loadScenario={loadScenario} />
        
        <div className="space-y-4 p-6 border rounded-lg bg-card shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Step 1: Define SAFE Agreements</h2>
          <p className="text-muted-foreground">
            Start by entering the terms for one or more SAFE notes. You can add multiple SAFEs to see how they stack.
          </p>
        </div>
        <SafeAgreementCard
          safes={safes}
          updateSafe={updateSafe}
          addSafe={addSafe}
          removeSafe={removeSafe}
          isProMode={isProMode}
          setIsProMode={setIsProMode}
        />
        
        <Separator className="my-8" />

        <div className="space-y-4 p-6 border rounded-lg bg-card shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Step 2: Model a Future Financing Round</h2>
          <p className="text-muted-foreground">
            Use the slider to set a hypothetical valuation for your next financing round and see how it impacts dilution.
          </p>
        </div>
        <ScenarioModelingCard
            futureValuation={futureValuation}
            setFutureValuation={setFutureValuation}
            safeEquity={safeHolderEquity}
            founderEquity={founderEquity}
            isProMode={isProMode}
            isPostMoney={isPostMoney}
            setIsPostMoney={setIsPostMoney}
        />

        <Separator className="my-8" />
        
        <div className="space-y-4 p-6 border rounded-lg bg-card shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Step 3: Visualize & Understand</h2>
          <p className="text-muted-foreground">
            Review the projected ownership breakdown and use the AI assistant to get a plain-language explanation of the terms.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
            <OwnershipChart data={chartData} />
            <KeyMetricsCard 
              totalSafeInvestment={totalSafeInvestment}
              totalSharesToSafeHolders={totalSharesToSafeHolders}
              effectiveSafePrice={effectiveSafePrice}
            />
        </div>

        <Separator className="my-8" />
        
        <div className="space-y-4 p-6 border rounded-lg bg-card shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Step 4: Get AI-Powered Insights</h2>
          <p className="text-muted-foreground">
            Use the AI assistant to get a plain-language explanation of the terms or ask your own questions.
          </p>
        </div>
        <ExplanationCard terms={aiTerms} />
      </div>

      {/* Hidden component for printing */}
      <div className="hidden">
        <div ref={reportRef}>
          <Report 
            safes={safes}
            futureValuation={futureValuation}
            isPostMoney={isPostMoney}
            chartData={chartData}
            totalSafeInvestment={totalSafeInvestment}
            totalSharesToSafeHolders={totalSharesToSafeHolders}
            effectiveSafePrice={effectiveSafePrice}
          />
        </div>
      </div>
    </>
  );
});

SafeSimulatorClient.displayName = "SafeSimulatorClient";
