"use client";

import React, { ReactNode } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useChartStyles } from "@/hooks/useChartStyles";

interface BaseLineChartProps {
  data: any[];
  xKey: string;
  yKeys: string[];
  height?: number | string;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  showLegend?: boolean;
  customLegend?: React.ReactElement | ((props: any) => React.ReactElement);
  variant?: "primary" | "sequential" | "categorical" | "divergent";
  domain?: [number, number];
  curved?: boolean;
  showDots?: boolean;
  customDot?: React.ReactElement | ((props: any) => React.ReactElement);
}

export function BaseLineChart({
  data,
  xKey,
  yKeys,
  height = 300,
  margin = { top: 20, right: 30, left: 20, bottom: 30 },
  showLegend = true,
  customLegend,
  variant = "categorical",
  domain,
  curved = true,
  showDots = true,
  customDot,
}: BaseLineChartProps) {
  const { getColorPalette, chartDefaults, getLegendEffectOpacity } =
    useChartStyles({
      variant,
      colorCount: yKeys.length,
    });

  const colors = getColorPalette(yKeys.length);
  const legendEffect = getLegendEffectOpacity();

  // Default legend renderer with opacity effect
  const renderLegend = (props: any) => {
    const { payload } = props;

    return (
      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-2 text-sm">
        {payload.map((entry: any, index: number) => (
          <li
            key={`item-${index}`}
            className="flex items-center cursor-pointer"
            onMouseEnter={(e) => legendEffect.onMouseEnter(entry, index, e)}
            onMouseLeave={(e) => legendEffect.onMouseLeave(entry, index, e)}
          >
            <div
              className="mr-2 size-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-foreground">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  // Default dot component
  const DefaultDot = (props: any) => {
    const { cx, cy, stroke } = props;

    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        stroke={stroke}
        strokeWidth={1}
        fill="#FFFFFF"
      />
    );
  };

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={margin}>
          {/* Add gradient definitions */}
          <defs>
            {colors.map((color, index) => (
              <linearGradient
                key={`gradient-${index}`}
                id={`chart-gradient-${index}`}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor={color} stopOpacity={1} />
                <stop offset="100%" stopColor={color} stopOpacity={0.5} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke={chartDefaults.stroke} />

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

          <Tooltip {...chartDefaults.tooltipStyle} />

          {showLegend && <Legend content={customLegend || renderLegend} />}

          {yKeys.map((dataKey, index) => (
            <Line
              key={dataKey}
              type={curved ? "monotone" : "linear"}
              dataKey={dataKey}
              stroke={colors[index]}
              strokeWidth={chartDefaults.strokeWidth}
              name={dataKey}
              dot={showDots ? customDot || <DefaultDot /> : false}
              activeDot={{
                r: 6,
                strokeWidth: 0,
                fill: colors[index],
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
