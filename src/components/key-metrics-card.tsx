"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface KeyMetricsCardProps {
    totalSafeInvestment: number;
    totalSharesToSafeHolders: number;
    effectiveSafePrice: number;
}

export function KeyMetricsCard({ totalSafeInvestment, totalSharesToSafeHolders, effectiveSafePrice }: KeyMetricsCardProps) {

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <FileText className="text-primary" />
            Key Metrics
        </CardTitle>
        <CardDescription>A breakdown of the numbers behind the conversion.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {totalSafeInvestment > 0 ? (
            <div className="space-y-3 text-sm">
                 <div className="flex justify-between font-medium">
                    <span>Total SAFE Investment:</span>
                    <span className="font-mono text-foreground">{formatCurrency(totalSafeInvestment)}</span>
                </div>
                <div className="flex justify-between font-medium">
                    <span>Effective SAFE Conversion Price:</span>
                    <span className="font-mono text-foreground">{formatCurrency(effectiveSafePrice)}</span>
                </div>
                <div className="flex justify-between font-medium">
                    <span>New Shares Issued to SAFE Holders:</span>
                    <span className="font-mono text-foreground">{formatNumber(Math.round(totalSharesToSafeHolders))}</span>
                </div>
            </div>
        ) : (
             <div className="flex items-center justify-center h-full text-muted-foreground text-center pt-8">
              Metrics will appear here once you enter SAFE details.
            </div>
        )}
      </CardContent>
    </Card>
  );
}

    