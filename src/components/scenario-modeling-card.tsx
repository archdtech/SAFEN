"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface ScenarioModelingCardProps {
    futureValuation: number;
    setFutureValuation: (value: number) => void;
    safeEquity: number;
    founderEquity: number;
    isProMode: boolean;
    isPostMoney: boolean;
    setIsPostMoney: (value: boolean) => void;
}

export function ScenarioModelingCard({
    futureValuation,
    setFutureValuation,
    safeEquity,
    founderEquity,
    isProMode,
    isPostMoney,
    setIsPostMoney,
}: ScenarioModelingCardProps) {
  return (
    <Card className="bg-muted/50">
        <CardHeader>
            <CardTitle>Scenario Modeling</CardTitle>
            <CardDescription>See how equity changes based on a future financing round.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="futureValuation">Hypothetical Pre-Money Valuation ($)</Label>
                 <Input
                    id="futureValuation"
                    type="number"
                    value={futureValuation}
                    onChange={(e) => setFutureValuation(Number(e.target.value))}
                    placeholder="e.g., 20000000"
                    className="font-mono"
                />
            </div>
            {isProMode && (
              <div className="flex items-center justify-between space-x-2 pt-2">
                  <Label htmlFor="post-money-mode" className="flex flex-col space-y-1">
                      <span>Post-Money SAFE</span>
                      <span className="font-normal leading-snug text-muted-foreground text-xs">
                        Calculate ownership based on the YC post-money SAFE method.
                      </span>
                  </Label>
                  <Switch id="post-money-mode" checked={isPostMoney} onCheckedChange={setIsPostMoney} />
              </div>
            )}
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
