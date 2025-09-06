"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { explainSafeTerms, type ExplainSafeTermsInput } from "@/ai/flows/explain-safe-terms";
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ExplanationCardProps {
  terms: ExplainSafeTermsInput | null;
}

export function ExplanationCard({ terms }: ExplanationCardProps) {
  const [explanation, setExplanation] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerateExplanation = () => {
    if (terms && terms.investmentAmount > 0 && terms.valuationCap > 0) {
      startTransition(async () => {
        try {
          const validTerms = { 
            ...terms, 
            discountRate: Math.max(0, terms.discountRate),
            customPrompt: customPrompt || undefined,
          };
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
       toast({
        variant: "default",
        title: "Missing Terms",
        description: "Please set the SAFE Investment Amount and Valuation Cap first.",
      });
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="text-primary" />
          Plain Language Explanation
        </CardTitle>
        <CardDescription>An AI-powered summary of what these terms mean for you.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            placeholder="Optional: Ask a specific question, e.g., 'Explain this to me like I'm a first-time founder.'"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="mb-2"
          />
          <Button onClick={handleGenerateExplanation} disabled={isPending}>
            {isPending ? "Generating..." : "Generate Explanation"}
          </Button>
        </div>

        <div className="min-h-[120px] rounded-md border border-dashed bg-muted/50 p-4">
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
            <p className="text-sm text-muted-foreground text-center pt-8">
              Click "Generate Explanation" to get started.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
