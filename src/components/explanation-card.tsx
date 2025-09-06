"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { explainSafeTerms, type ExplainSafeTermsInput } from "@/ai/flows/explain-safe-terms";
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExplanationCardProps {
  terms: ExplainSafeTermsInput | null;
}

export function ExplanationCard({ terms }: ExplanationCardProps) {
  const [explanation, setExplanation] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (terms && terms.investmentAmount > 0 && terms.valuationCap > 0) {
      startTransition(async () => {
        try {
          // Ensure discount rate is not negative, which can happen if pro mode is off
          const validTerms = { ...terms, discountRate: Math.max(0, terms.discountRate) };
          const result = await explainSafeTerms(validTerms);
          setExplanation(result.explanation);
        } catch (error) {
          console.error("Failed to get explanation:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not generate an explanation at this time. Please try again later.",
          });
          setExplanation("");
        }
      });
    } else {
      setExplanation("");
    }
  }, [terms, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="text-primary" />
          Plain Language Explanation
        </CardTitle>
        <CardDescription>An AI-powered summary of what these terms mean for you.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 min-h-[120px]">
        {isPending && (
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        )}
        {explanation ? (
          <p className="text-sm text-foreground leading-relaxed">{explanation}</p>
        ) : !isPending && (
          <p className="text-sm text-muted-foreground pt-2">
            Adjust the SAFE terms to generate an explanation.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
