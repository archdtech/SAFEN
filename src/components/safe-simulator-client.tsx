"use client";

import { useState, useMemo } from "react";
import { OwnershipChart } from "./ownership-chart";
import { ExplanationCard } from "./explanation-card";
import type { ExplainSafeTermsInput } from "@/ai/flows/explain-safe-terms";
import { SafeAgreementCard } from "./safe-agreement-card";
import { ScenarioModelingCard } from "./scenario-modeling-card";

const PRE_ROUND_SHARES = 10_000_000;

function calculateEquity(
  investmentAmount: number,
  valuationCap: number,
  discountRate: number,
  futureValuation: number
) {
  if (futureValuation <= 0 || PRE_ROUND_SHARES <= 0 || investmentAmount <= 0) {
    return {
      safeEquity: 0,
      founderEquity: 100,
      chartData: [
        { name: "Founders", value: 100 },
        { name: "SAFE Holder", value: 0 },
      ],
    };
  }

  const pricedRoundPricePerShare = futureValuation / PRE_ROUND_SHARES;
  
  // In simple mode, discount rate is 0, so discountedPrice is same as pricedRoundPricePerShare.
  const discountedPrice = pricedRoundPricePerShare * (1 - discountRate / 100);

  // If valuation cap is 0 or less, it's not applicable. Use Infinity to ensure discounted price is chosen.
  const capPrice = valuationCap > 0 ? valuationCap / PRE_ROUND_SHARES : Infinity;
  
  // The conversion price is the *lower* of the two prices.
  const safeConversionPrice = Math.min(discountedPrice, capPrice);
  
  if (safeConversionPrice <= 0) {
    return {
      safeEquity: 0,
      founderEquity: 100,
      chartData: [
        { name: "Founders", value: 100 },
        { name: "SAFE Holder", value: 0 },
      ],
    };
  }

  const sharesToSafeHolder = investmentAmount / safeConversionPrice;
  const totalPostSafeShares = PRE_ROUND_SHARES + sharesToSafeHolder;

  const safeHolderOwnership = (sharesToSafeHolder / totalPostSafeShares) * 100;
  const founderOwnership = (PRE_ROUND_SHARES / totalPostSafeShares) * 100;

  return {
    safeEquity: safeHolderOwnership,
    founderEquity: founderOwnership,
    chartData: [
      { name: "Founders", value: founderOwnership },
      { name: "SAFE Holder", value: safeHolderOwnership },
    ],
  };
}

export function SafeSimulatorClient() {
  const [investmentAmount, setInvestmentAmount] = useState(100_000);
  const [valuationCap, setValuationCap] = useState(10_000_000);
  const [discountRate, setDiscountRate] = useState(20);
  const [futureValuation, setFutureValuation] = useState(20_000_000);
  const [isProMode, setIsProMode] = useState(false);

  const { safeEquity, founderEquity, chartData } = useMemo(() => 
    calculateEquity(investmentAmount, valuationCap, isProMode ? discountRate : 0, futureValuation),
    [investmentAmount, valuationCap, discountRate, futureValuation, isProMode]
  );

  const aiTerms = useMemo<Omit<ExplainSafeTermsInput, 'customPrompt'> | null>(() => {
    if (investmentAmount > 0 && valuationCap > 0) {
      return { investmentAmount, valuationCap, discountRate: isProMode ? discountRate : 0 };
    }
    return null;
  }, [investmentAmount, valuationCap, discountRate, isProMode]);

  return (
    <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col gap-6 lg:gap-8">
        <SafeAgreementCard
          investmentAmount={investmentAmount}
          setInvestmentAmount={setInvestmentAmount}
          valuationCap={valuationCap}
          setValuationCap={setValuationCap}
          discountRate={discountRate}
          setDiscountRate={setDiscountRate}
          isProMode={isProMode}
          setIsProMode={setIsProMode}
        />
        
        <ScenarioModelingCard
            futureValuation={futureValuation}
            setFutureValuation={setFutureValuation}
            safeEquity={safeEquity}
            founderEquity={founderEquity}
            isProMode={isProMode}
        />

      </div>
      <div className="flex flex-col gap-6 lg:gap-8">
        <OwnershipChart data={chartData} />
        <ExplanationCard terms={aiTerms} />
      </div>
    </div>
  );
}
