"use client";

import { useState, useMemo, useEffect } from "react";
import { OwnershipChart } from "./ownership-chart";
import { ExplanationCard } from "./explanation-card";
import type { ExplainSafeTermsInput } from "@/ai/flows/explain-safe-terms";
import { SafeAgreementCard } from "./safe-agreement-card";
import { ScenarioModelingCard } from "./scenario-modeling-card";

const PRE_ROUND_SHARES = 10_000_000;

interface Safe {
  id: number;
  investmentAmount: number;
  valuationCap: number;
  discountRate: number;
}

function calculateEquity(
  safes: Safe[],
  futureValuation: number,
  isPostMoney: boolean,
  isProMode: boolean,
) {
  if (futureValuation <= 0 || PRE_ROUND_SHARES <= 0 || safes.length === 0) {
    return {
      safeEquity: 0,
      founderEquity: 100,
      chartData: [{ name: "Founders", value: 100 }],
    };
  }
  
  const pricedRoundPricePerShare = futureValuation / PRE_ROUND_SHARES;
  let totalSharesToSafeHolders = 0;

  safes.forEach(safe => {
    if (safe.investmentAmount > 0) {
      const discountedPrice = pricedRoundPricePerShare * (1 - (isProMode ? safe.discountRate : 0) / 100);
      const capPrice = safe.valuationCap > 0 
        ? safe.valuationCap / (isPostMoney ? PRE_ROUND_SHARES + (safes.reduce((acc, s) => acc + s.investmentAmount, 0) / (safe.valuationCap / PRE_ROUND_SHARES)) : PRE_ROUND_SHARES) 
        : Infinity;
      
      const safeConversionPrice = Math.min(discountedPrice, capPrice);
      
      if (safeConversionPrice > 0) {
        totalSharesToSafeHolders += safe.investmentAmount / safeConversionPrice;
      }
    }
  });

  if (totalSharesToSafeHolders <= 0) {
     return {
      safeEquity: 0,
      founderEquity: 100,
      chartData: [{ name: "Founders", value: 100 }],
    };
  }

  const totalPostSafeShares = PRE_ROUND_SHARES + totalSharesToSafeHolders;

  const safeHolderOwnership = (totalSharesToSafeHolders / totalPostSafeShares) * 100;
  const founderOwnership = (PRE_ROUND_SHARES / totalPostSafeShares) * 100;

  return {
    safeEquity: safeHolderOwnership,
    founderEquity: founderOwnership,
    chartData: [
      { name: "Founders", value: founderOwnership },
      { name: "SAFE Holders", value: safeHolderOwnership },
    ],
  };
}


export function SafeSimulatorClient() {
  const [safes, setSafes] = useState<Safe[]>([
    { id: 1, investmentAmount: 100000, valuationCap: 10000000, discountRate: 20 },
  ]);
  const [futureValuation, setFutureValuation] = useState(20_000_000);
  const [isProMode, setIsProMode] = useState(false);
  const [isPostMoney, setIsPostMoney] = useState(true);

  const { safeEquity, founderEquity, chartData } = useMemo(() => 
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


  return (
    <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col gap-6 lg:gap-8">
        <SafeAgreementCard
          safes={safes}
          updateSafe={updateSafe}
          addSafe={addSafe}
          removeSafe={removeSafe}
          isProMode={isProMode}
          setIsProMode={setIsProMode}
        />
        
        <ScenarioModelingCard
            futureValuation={futureValuation}
            setFutureValuation={setFutureValuation}
            safeEquity={safeEquity}
            founderEquity={founderEquity}
            isProMode={isProMode}
            isPostMoney={isPostMoney}
            setIsPostMoney={setIsPostMoney}
        />

      </div>
      <div className="flex flex-col gap-6 lg:gap-8">
        <OwnershipChart data={chartData} />
        <ExplanationCard terms={aiTerms} />
      </div>
    </div>
  );
}
