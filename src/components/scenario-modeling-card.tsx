"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ScenarioModelingCardProps {
    futureValuation: number;
    setFutureValuation: (value: number) => void;
    safeEquity: number;
    founderEquity: number;
    isProMode: boolean;
}

export function ScenarioModelingCard({
    futureValuation,
    setFutureValuation,
    safeEquity,
    founderEquity,
    isProMode
}: ScenarioModelingCardProps) {
  return (
    <Card className="bg-muted/50">
        <CardHeader>
            <CardTitle>Scenario Modeling</CardTitle>
            <CardDescription>See how equity changes based on a future financing round.</CardDescription>
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
  );
}
