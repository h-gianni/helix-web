"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useChartStyles } from "@/hooks/useChartStyles";

interface BaseBarChartProps {
  data: any[];
  xKey: string;
  yKeys: string[];
  labelKeys?: string[]; 
  stacked?: boolean;
  layout?: "vertical" | "horizontal";
  barSize?: number;
  showLegend?: boolean;
  height?: number | string;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  customLegend?: React.ReactElement | ((props: any) => React.ReactElement);
  variant?: "primary" | "sequential" | "categorical" | "divergent";
  domain?: [number, number];
}

export function BaseBarChart({
  data,
  xKey,
  yKeys,
  labelKeys, 
  stacked = false,
  layout = "horizontal",
  barSize = 32,
  showLegend = true,
  height = 300,
  margin = { top: 20, right: 0, left: -20, bottom: 20 },
  customLegend,
  variant = "categorical",
  domain,
}: BaseBarChartProps) {
  const { getColorPalette, chartDefaults, getLegendEffectOpacity } =
    useChartStyles({
      variant,
      colorCount: yKeys.length,
    });

  const colors = getColorPalette(yKeys.length);
  const legendEffect = getLegendEffectOpacity();
  
  // Generate unique ID for this chart instance
  const uniqueId = React.useId();

  // Custom tooltip content
  const renderTooltipContent = (props: any) => {
    const { active, payload, label } = props;
    
    if (!active || !payload || !payload.length) {
      return null;
    }

    return (
      <div className="rounded-md bg-background p-2 shadow-md border border-border text-foreground">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => {
          const keyIndex = yKeys.indexOf(entry.dataKey);
          const customLabel = labelKeys && labelKeys[keyIndex] 
            ? labelKeys[keyIndex] 
            : entry.dataKey;
            
          return (
            <p key={`tooltip-${index}`} className="text-sm">
              <span 
                className="inline-block size-2 rounded-full mr-1" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="ml-0">{customLabel}: {entry.value}</span>
            </p>
          );
        })}
      </div>
    );
  };

  // Default legend renderer with opacity effect and custom labels
  const renderLegend = (props: any) => {
    const { payload } = props;

    return (
      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-2 text-sm">
        {payload.map((entry: any, index: number) => {
          // Get the custom label if provided, otherwise use the entry value
          const label = labelKeys && labelKeys[index] 
            ? labelKeys[index] 
            : entry.value;
            
          return (
            <li
              key={`item-${index}`}
              className="flex items-center cursor-pointer"
              onMouseEnter={(e) => legendEffect.onMouseEnter(entry, index, e)}
              onMouseLeave={(e) => legendEffect.onMouseLeave(entry, index, e)}
            >
              <div
                className="mr-2 size-2.5 rounded-full"
                style={{ backgroundColor: colors[index] }}
              />
              <span className="text-sm text-foreground">{label}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={layout}
          margin={margin}
          barSize={barSize}
          barGap={stacked ? 0 : 4}
        >
          {/* Define Gradients With Unique IDs and Correct Orientation - Only for non-stacked charts */}
          {!stacked && (
            <defs>
              {colors.map((color, index) => {
                // Create a unique gradient ID for each bar
                const gradientId = `chart-gradient-${uniqueId}-${index}`;
                
                return (
                  <linearGradient
                    key={gradientId}
                    id={gradientId}
                    // FIXED COORDINATES:
                    // Vertical layout: left-to-right gradient
                    // Horizontal layout: bottom-to-top gradient
                    x1="0%"
                    y1={layout === "horizontal" ? "100%" : "0%"}
                    x2={layout === "vertical" ? "100%" : "0%"}
                    y2={layout === "horizontal" ? "0%" : "0%"}
                  >
                    <stop
                      offset="0%"
                      stopColor={color}
                      stopOpacity={0.7}
                    />
                    <stop
                      offset="100%"
                      stopColor={color}
                      stopOpacity={1}
                    />
                  </linearGradient>
                );
              })}
            </defs>
          )}
          <CartesianGrid strokeDasharray="3 3" stroke={chartDefaults.stroke} />
          {layout === "horizontal" ? (
            <>
              <XAxis
                dataKey={xKey}
                axisLine={{ stroke: chartDefaults.axisColor }}
                tickLine={{ stroke: chartDefaults.axisColor }}
                tick={{
                  fontSize: chartDefaults.labelFontSize,
                  fill: chartDefaults.labelColor,
                }}
              />
              <YAxis
                domain={domain || ["auto", "auto"]}
                axisLine={{ stroke: chartDefaults.axisColor }}
                tickLine={{ stroke: chartDefaults.axisColor }}
                tick={{
                  fontSize: chartDefaults.labelFontSize,
                  fill: chartDefaults.tickColor,
                }}
              />
            </>
          ) : (
            <>
              <XAxis
                type="number"
                domain={domain || ["auto", "auto"]}
                axisLine={{ stroke: chartDefaults.axisColor }}
                tickLine={{ stroke: chartDefaults.axisColor }}
                tick={{
                  fontSize: chartDefaults.labelFontSize,
                  fill: chartDefaults.tickColor,
                }}
              />
              <YAxis
                dataKey={xKey}
                type="category"
                axisLine={{ stroke: chartDefaults.axisColor }}
                tickLine={{ stroke: chartDefaults.axisColor }}
                tick={{
                  fontSize: chartDefaults.labelFontSize,
                  fill: chartDefaults.labelColor,
                }}
              />
            </>
          )}
          <Tooltip content={renderTooltipContent} cursor={{ fill: 'rgba(0, 0, 0, 0.08)' }} />
          {showLegend && <Legend content={customLegend || renderLegend} />}
          {yKeys.map((dataKey, index) => {
            // For non-stacked charts, use gradients
            const fillValue = !stacked 
              ? `url(#chart-gradient-${uniqueId}-${index})` 
              : colors[index];
            
            // For stacked charts, only apply radius to the last (top) bar
            const isLastBar = stacked && index === yKeys.length - 1;
            // For radius, must use a tuple with exactly 4 elements (not an array)
            const radius = (() => {
              if (!stacked) {
                // Regular radius for non-stacked
                return layout === "horizontal" ? [4, 4, 0, 0] as [number, number, number, number] : [0, 4, 4, 0] as [number, number, number, number];
              } else if (isLastBar) {
                // Only top bar gets radius in stacked mode
                return layout === "horizontal" ? [4, 4, 0, 0] as [number, number, number, number] : [0, 4, 4, 0] as [number, number, number, number];
              } else {
                // No radius for other bars in stack
                return [0, 0, 0, 0] as [number, number, number, number];
              }
            })();
            
            return (
              <Bar
                key={dataKey}
                dataKey={dataKey}
                stackId={stacked ? "stack" : undefined}
                fill={fillValue}
                stroke={colors[index]}
                strokeWidth={0}
                radius={radius}
                name={dataKey}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}