
"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Safe } from "@/types";

interface Scenario {
    name: string;
    description: string;
    safes: Safe[];
    futureValuation: number;
}

const templates: Scenario[] = [
    {
        name: "Standard Pre-Seed",
        description: "A common starting point: a single SAFE on a standard valuation cap with a discount.",
        safes: [{ id: 1, investmentAmount: 150000, valuationCap: 5000000, discountRate: 20 }],
        futureValuation: 10000000,
    },
    {
        name: "Competitive Party Round",
        description: "Multiple investors are coming in on slightly different terms, common in a 'hot' round.",
        safes: [
            { id: 1, investmentAmount: 50000, valuationCap: 8000000, discountRate: 20 },
            { id: 2, investmentAmount: 75000, valuationCap: 8000000, discountRate: 20 },
            { id: 3, investmentAmount: 25000, valuationCap: 9000000, discountRate: 25 },
        ],
        futureValuation: 15000000,
    },
    {
        name: "High-Resolution Bridge",
        description: "A bridge round to extend runway, with terms that reflect significant progress since the last raise.",
        safes: [{ id: 1, investmentAmount: 500000, valuationCap: 25000000, discountRate: 25 }],
        futureValuation: 50000000,
    },
];

interface ScenarioTemplatesProps {
    loadScenario: (safes: Safe[], futureValuation: number) => void;
}

export function ScenarioTemplates({ loadScenario }: ScenarioTemplatesProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Scenario Templates</CardTitle>
                <CardDescription>
                    Explore common fundraising scenarios by loading these pre-built templates into the simulator.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
                {templates.map((template) => (
                    <div key={template.name} className="p-4 border rounded-lg flex flex-col bg-muted/20">
                        <h4 className="font-semibold mb-1">{template.name}</h4>
                        <p className="text-sm text-muted-foreground flex-1 mb-4">{template.description}</p>
                        <Button onClick={() => loadScenario(template.safes, template.futureValuation)}>
                            Load Scenario
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

    