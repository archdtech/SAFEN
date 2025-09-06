"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { OwnershipChart } from "./ownership-chart";
import { ExplanationCard } from "./explanation-card";
import type { ExplainSafeTermsInput } from "@/ai/flows/explain-safe-terms";

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
      founderEquity: 100, // Founders own everything if no investment
      chartData: [
        { name: "Founders", value: 100 },
        { name: "SAFE Holder", value: 0 },
      ],
    };
  }

  const pricedRoundPricePerShare = futureValuation / PRE_ROUND_SHARES;
  const discountedPrice = pricedRoundPricePerShare * (1 - discountRate / 100);
  const capPrice = valuationCap > 0 ? valuationCap / PRE_ROUND_SHARES : Infinity;

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

  const { safeEquity, founderEquity, chartData } = useMemo(() => 
    calculateEquity(investmentAmount, valuationCap, discountRate, futureValuation),
    [investmentAmount, valuationCap, discountRate, futureValuation]
  );

  const aiTerms = useMemo<ExplainSafeTermsInput | null>(() => {
    if (investmentAmount > 0 && valuationCap > 0 && discountRate >= 0) {
      return { investmentAmount, valuationCap, discountRate };
    }
    return null;
  }, [investmentAmount, valuationCap, discountRate]);

  return (
    <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col gap-6 lg:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>SAFE Agreement Terms</CardTitle>
            <CardDescription>Adjust the sliders and inputs to model your SAFE.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="investmentAmount">SAFE Investment Amount ($)</Label>
              <Input
                id="investmentAmount"
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                placeholder="e.g., 100000"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valuationCap">Valuation Cap ($)</Label>
              <Input
                id="valuationCap"
                type="number"
                value={valuationCap}
                onChange={(e) => setValuationCap(Number(e.target.value))}
                placeholder="e.g., 10000000"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="discountRate">Discount Rate</Label>
                <span className="text-sm font-mono text-muted-foreground">{discountRate}%</span>
              </div>
              <Slider
                id="discountRate"
                min={0}
                max={50}
                step={1}
                value={[discountRate]}
                onValueChange={(value) => setDiscountRate(value[0])}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-muted/50">
            <CardHeader>
                <CardTitle>Scenario Modeling</CardTitle>
                <CardDescription>See how your equity changes based on a future financing round.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="futureValuation">Hypothetical Post-Money Valuation ($)</Label>
                     <Input
                        id="futureValuation"
                        type="number"
                        value={futureValuation}
                        onChange={(e) => setFutureValuation(Number(e.target.value))}
                        placeholder="e.g., 20000000"
                        className="font-mono"
                    />
                </div>
                <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-sm font-medium">
                        <span>SAFE Holder's Equity:</span>
                        <span className="font-mono text-primary">{safeEquity.toFixed(2)}%</span>
                    </div>
                     <div className="flex justify-between text-sm font-medium">
                        <span>Founders' Diluted Equity:</span>
                        <span className="font-mono">{founderEquity.toFixed(2)}%</span>
                    </div>
                </div>
            </CardContent>
        </Card>

      </div>
      <div className="flex flex-col gap-6 lg:gap-8">
        <OwnershipChart data={chartData} />
        <ExplanationCard terms={aiTerms} />
      </div>
    </div>
  );
}
