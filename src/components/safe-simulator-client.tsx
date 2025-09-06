"use client";

import { useState, useMemo } from "react";
import { OwnershipChart } from "./ownership-chart";
import { ExplanationCard } from "./explanation-card";
import type { ExplainSafeTermsInput } from "@/ai/flows/explain-safe-terms";
import { SafeAgreementCard } from "./safe-agreement-card";
import { ScenarioModelingCard } from "./scenario-modeling-card";
import { ScenarioTemplates } from "./scenario-templates";
import type { Safe } from "@/types";


const PRE_ROUND_SHARES = 10_000_000;

function calculateEquity(
  safes: Safe[],
  futureValuation: number,
  isPostMoney: boolean,
  isProMode: boolean,
) {
  if (futureValuation <= 0 || PRE_ROUND_SHARES <= 0) {
    return {
      safeEquity: 0,
      founderEquity: 100,
      chartData: [{ name: "Founders", value: 100 }],
    };
  }

  // Calculate total SAFE investment
  const totalSafeInvestment = safes.reduce((acc, s) => acc + s.investmentAmount, 0);

  // Determine the company valuation for conversion
  const conversionValuation = isPostMoney ? futureValuation - totalSafeInvestment : futureValuation;

  if (conversionValuation <= 0) {
     return {
      safeEquity: 0,
      founderEquity: 100,
      chartData: [{ name: "Founders", value: 100 }],
    };
  }

  const pricedRoundPricePerShare = conversionValuation / PRE_ROUND_SHARES;
  let totalSharesToSafeHolders = 0;

  safes.forEach(safe => {
    if (safe.investmentAmount > 0) {
      const discountPrice = pricedRoundPricePerShare * (1 - (isProMode ? safe.discountRate : 0) / 100);
      const capPrice = safe.valuationCap > 0 
        ? safe.valuationCap / PRE_ROUND_SHARES
        : Infinity;
      
      const safeConversionPrice = Math.min(discountPrice, capPrice);
      
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
  const [isPostMoney, setIsPostMoney] = useState(false);

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

  const loadScenario = (newSafes: Safe[], newFutureValuation: number) => {
    setSafes(newSafes);
    setFutureValuation(newFutureValuation);
  };


  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8">
        <ScenarioTemplates loadScenario={loadScenario} />
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
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
    </div>
  );
}
