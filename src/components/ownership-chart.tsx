"use client";

import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useMemo } from "react";

interface OwnershipData {
  name: string;
  value: number;
}

interface OwnershipChartProps {
  data: OwnershipData[];
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))"];

export function OwnershipChart({ data }: OwnershipChartProps) {
  const chartData = useMemo(() => data.filter(d => d.value > 0), [data]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Ownership Visualization</CardTitle>
        <CardDescription>Projected equity distribution after SAFE conversion.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(2)}%`}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => (percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : '')}
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="hsl(var(--background))"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend iconSize={12} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Enter details to see the ownership chart.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
