"use client";

import React, { ReactNode } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useChartStyles } from "@/hooks/useChartStyles";

interface BaseRadarChartProps {
  data: any[];
  dataKeys: string[];
  labelKey: string;
  height?: number | string;
  showLegend?: boolean;
  customLegend?: React.ReactElement | ((props: any) => React.ReactElement);
  variant?: 'primary' | 'sequential' | 'categorical' | 'divergent';
  outerRadius?: number;
  domain?: [number, number];
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
}

export function BaseRadarChart({
  data,
  dataKeys,
  labelKey,
  height = 300,
  showLegend = true,
  customLegend,
  variant = 'categorical',
  outerRadius = 90,
  domain,
  margin = { top: 20, right: 0, left: 0, bottom: 20 }
}: BaseRadarChartProps) {
  const { getColorPalette, getRadarGradients, chartDefaults, getLegendEffectOpacity } = useChartStyles({
    variant,
    colorCount: dataKeys.length
  });
  
  const colors = getColorPalette(dataKeys.length);
  const radarGradients = getRadarGradients(colors);
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

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius={outerRadius} data={data} margin={margin}>
          {/* Add gradient definitions */}
          <defs>
            {radarGradients.map((gradient) => (
              <linearGradient
                key={gradient.id}
                id={gradient.id}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={gradient.color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={gradient.color} stopOpacity={0.2}/>
              </linearGradient>
            ))}
          </defs>
          
          <PolarGrid stroke={chartDefaults.stroke} />
          
          <PolarAngleAxis 
            dataKey={labelKey} 
            tick={{ 
              fill: chartDefaults.labelColor, 
              fontSize: chartDefaults.labelFontSize 
            }}
          />
          
          <PolarRadiusAxis
            angle={30}
            domain={domain || [0, 'auto']}
            axisLine={false}
            tick={{ 
              fill: chartDefaults.tickColor, 
              fontSize: 10 
            }}
          />
          
          {dataKeys.map((dataKey, index) => (
            <Radar
              key={dataKey}
              name={dataKey}
              dataKey={dataKey}
              stroke={colors[index]}
              fill={`url(#radar-gradient-${index})`}
              fillOpacity={chartDefaults.fillOpacity}
              strokeWidth={chartDefaults.strokeWidth}
            />
          ))}
          
          <Tooltip {...chartDefaults.tooltipStyle} />
          
          {showLegend && (
            <Legend content={customLegend || renderLegend} />
          )}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}