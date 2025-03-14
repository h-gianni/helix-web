"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/core/Card";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const distributionData = [
  { name: "Star", value: 2, color: "#FF9500" }, // Apple orange
  { name: "Strong", value: 3, color: "#007AFF" }, // Apple blue
  { name: "Solid", value: 3, color: "#5856D6" }, // Apple purple
  { name: "Lower", value: 1, color: "#AF52DE" }, // Apple pink/purple
  { name: "Poor", value: 1, color: "#FF2D55" }, // Apple red
  { name: "Not Scored", value: 1, color: "#8E8E93" }, // Apple gray
];

// Custom renderer for the legend that uses circles instead of rectangles
// const renderLegend = (props: any) => {
//   const { payload } = props;

//   return (
//     <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-4 text-sm text-foreground">
//       {payload.map((entry: any, index: number) => (
//         <li key={`item-${index}`} className="flex items-center">
//           <div
//             className="mr-2 h-3 w-3 rounded-full"
//             style={{ backgroundColor: entry.color }}
//           />
//           <span className="text-sm text-foreground-muted">{entry.value}</span>
//         </li>
//       ))}
//     </ul>
//   );
// };

export function PerformanceDistribution() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-slate-800">
          Performance Distribution
        </CardTitle>
        <CardDescription className="text-sm text-slate-500">
          Distribution of team members across different performance categories.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {distributionData.map((entry, index) => (
                  <linearGradient
                    key={`gradient-${index}`}
                    id={`colorGradient-${index}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                    <stop
                      offset="100%"
                      stopColor={entry.color}
                      stopOpacity={0.7}
                    />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                innerRadius={50}
                paddingAngle={0}
                dataKey="value"
                label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                className="text-sm font-medium"
                cornerRadius={0}
              >
                {distributionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#colorGradient-${index})`}
                    stroke={entry.color}
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} members`, ""]}
                contentStyle={{
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #f1f1f1",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  padding: "8px 12px",
                }}
                itemStyle={{ fontSize: "12px" }}
                labelStyle={{ fontSize: "12px", fontWeight: "bold" }}
              />
              {/* <Legend
                content={renderLegend}
                verticalAlign="bottom"
                height={36}
              /> */}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
