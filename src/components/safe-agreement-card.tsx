"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface SafeAgreementCardProps {
    investmentAmount: number;
    setInvestmentAmount: (value: number) => void;
    valuationCap: number;
    setValuationCap: (value: number) => void;
    discountRate: number;
    setDiscountRate: (value: number) => void;
    isProMode: boolean;
    setIsProMode: (value: boolean) => void;
}

export function SafeAgreementCard({
    investmentAmount,
    setInvestmentAmount,
    valuationCap,
    setValuationCap,
    discountRate,
    setDiscountRate,
    isProMode,
    setIsProMode
}: SafeAgreementCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>SAFE Agreement Terms</CardTitle>
                <CardDescription>Adjust the inputs to model your SAFE.</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="pro-mode" checked={isProMode} onCheckedChange={setIsProMode} />
                <Label htmlFor="pro-mode">Pro Mode</Label>
            </div>
        </div>
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
        {isProMode && (
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
        )}
      </CardContent>
    </Card>
  );
}
