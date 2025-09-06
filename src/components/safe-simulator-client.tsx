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
  futureValuation: number,
  isPostMoney: boolean
) {
  if (futureValuation <= 0 || PRE_ROUND_SHARES <= 0 || investmentAmount <= 0) {
    return {
      safeEquity: 0,
      founderEquity: 100,
      newMoneyEquity: 0,
      chartData: [
        { name: "Founders", value: 100 },
        { name: "SAFE Holder", value: 0 },
        { name: "New Investors", value: 0 },
      ],
    };
  }

  // This represents the valuation of the company *before* the new financing round investors put their money in.
  const preMoneyValuation = futureValuation;

  const pricedRoundPricePerShare = preMoneyValuation / PRE_ROUND_SHARES;
  
  const discountedPrice = pricedRoundPricePerShare * (1 - discountRate / 100);

  // If valuation cap is 0 or less, it's not applicable. Use Infinity to ensure discounted price is chosen.
  const capPrice = valuationCap > 0 ? valuationCap / (isPostMoney ? PRE_ROUND_SHARES + (investmentAmount / (valuationCap / PRE_ROUND_SHARES)) : PRE_ROUND_SHARES) : Infinity;
  
  const safeConversionPrice = Math.min(discountedPrice, capPrice);
  
  if (safeConversionPrice <= 0) {
    return {
      safeEquity: 0,
      founderEquity: 100,
      newMoneyEquity: 0,
      chartData: [
        { name: "Founders", value: 100 },
        { name: "SAFE Holder", value: 0 },
        { name: "New Investors", value: 0 },
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
  const [isPostMoney, setIsPostMoney] = useState(true);

  const { safeEquity, founderEquity, chartData } = useMemo(() => 
    calculateEquity(investmentAmount, valuationCap, isProMode ? discountRate : 0, futureValuation, isPostMoney),
    [investmentAmount, valuationCap, discountRate, futureValuation, isProMode, isPostMoney]
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
          discountRate={discountrate}
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
