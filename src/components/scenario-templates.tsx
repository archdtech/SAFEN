
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
        name: "Early Stage: First Check",
        description: "A typical scenario for a startup raising a small pre-seed round. A single SAFE with a low cap to get started.",
        safes: [{ id: 1, investmentAmount: 150000, valuationCap: 5000000, discountRate: 20 }],
        futureValuation: 10000000,
    },
    {
        name: "Growth Stage: Party Round",
        description: "Modeling a round with multiple angel investors, each contributing different amounts on similar terms.",
        safes: [
            { id: 1, investmentAmount: 50000, valuationCap: 8000000, discountRate: 20 },
            { id: 2, investmentAmount: 75000, valuationCap: 8000000, discountRate: 20 },
            { id: 3, investmentAmount: 25000, valuationCap: 9000000, discountRate: 25 },
        ],
        futureValuation: 15000000,
    },
    {
        name: "Late Stage: Bridge Round",
        description: "A bridge round from existing investors to extend runway before a Series A. Higher valuation cap reflects progress.",
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
