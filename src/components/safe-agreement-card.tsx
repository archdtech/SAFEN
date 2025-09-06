"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2, PlusCircle } from "lucide-react";
import type { Safe } from "@/types";

interface SafeAgreementCardProps {
    safes: Safe[];
    updateSafe: (id: number, field: keyof Safe, value: number) => void;
    addSafe: () => void;
    removeSafe: (id: number) => void;
    isProMode: boolean;
    setIsProMode: (value: boolean) => void;
}

export function SafeAgreementCard({
    safes,
    updateSafe,
    addSafe,
    removeSafe,
    isProMode,
    setIsProMode
}: SafeAgreementCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>SAFE Agreements</CardTitle>
                <CardDescription>Model one or more SAFE agreements.</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="pro-mode" checked={isProMode} onCheckedChange={setIsProMode} />
                <Label htmlFor="pro-mode">Pro Mode</Label>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {safes.map((safe, index) => (
          <div key={safe.id} className="p-4 border rounded-lg space-y-4 relative bg-muted/20">
             <div className="flex justify-between items-center">
                <h4 className="font-semibold text-foreground">SAFE #{index + 1}</h4>
                {safes.length > 1 && (
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeSafe(safe.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`investmentAmount-${safe.id}`}>SAFE Investment Amount ($)</Label>
              <Input
                id={`investmentAmount-${safe.id}`}
                type="number"
                value={safe.investmentAmount}
                onChange={(e) => updateSafe(safe.id, 'investmentAmount', Number(e.target.value))}
                placeholder="e.g., 100000"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`valuationCap-${safe.id}`}>Valuation Cap ($)</Label>
              <Input
                id={`valuationCap-${safe.id}`}
                type="number"
                value={safe.valuationCap}
                onChange={(e) => updateSafe(safe.id, 'valuationCap', Number(e.target.value))}
                placeholder="e.g., 10000000"
                className="font-mono"
              />
            </div>
            {isProMode && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor={`discountRate-${safe.id}`}>Discount Rate</Label>
                  <span className="text-sm font-mono text-muted-foreground">{safe.discountRate}%</span>
                </div>
                <Slider
                  id={`discountRate-${safe.id}`}
                  min={0}
                  max={50}
                  step={1}
                  value={[safe.discountRate]}
                  onValueChange={(value) => updateSafe(safe.id, 'discountRate', value[0])}
                />
              </div>
            )}
          </div>
        ))}
         {safes.length < 5 && (
            <Button variant="outline" onClick={addSafe} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Another SAFE
            </Button>
        )}
      </CardContent>
    </Card>
  );
}

    
