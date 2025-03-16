"use client";

import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useChartStyles } from "@/hooks/useChartStyles";

interface BasePieChartProps {
  data: Array<{ name: string; value: number; [key: string]: any }>;
  dataKey?: string;
  nameKey?: string;
  height?: number | string;
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
  showLegend?: boolean;
  customLegend?: React.ReactElement | ((props: any) => React.ReactElement);
  variant?: 'primary' | 'sequential' | 'categorical' | 'divergent';
  showLabels?: boolean;
  labelType?: 'name' | 'value' | 'percent' | 'name-percent';
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
}

export function BasePieChart({
  data,
  dataKey = 'value',
  nameKey = 'name',
  height = 300,
  innerRadius = 0,
  outerRadius = 90,
  paddingAngle = 0,
  showLegend = true,
  customLegend,
  variant = 'categorical',
  showLabels = true,
  labelType = 'name-percent',
  margin = { top: 0, right: 0, bottom: 0, left: 0 }
}: BasePieChartProps) {
  
  // Helper function to darken a color by a percentage
  const darkenColor = (color: string, percent: number = 25): string => {
    // For CSS variables, we can use the filter property in the component
    if (color.startsWith('var(')) {
      return color;
    }
    
    // For HSL format
    if (color.startsWith('hsl')) {
      // Extract HSL values
      const match = color.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/);
      if (match) {
        const h = parseInt(match[1]);
        const s = parseInt(match[2]);
        const l = parseInt(match[3]);
        // Darken by reducing lightness
        const newL = Math.max(0, l - percent);
        return `hsl(${h} ${s}% ${newL}%)`;
      }
      return color;
    }
    
    // Handle hex or rgb as a fallback
    try {
      // Create a dummy element
      const dummyEl = document.createElement('div');
      dummyEl.style.color = color;
      document.body.appendChild(dummyEl);
      
      // Get computed color
      const computedColor = getComputedStyle(dummyEl).color;
      document.body.removeChild(dummyEl);
      
      // Parse RGB values
      const rgb = computedColor.match(/\d+/g);
      if (rgb) {
        const factor = 1 - percent / 100;
        const r = Math.round(parseInt(rgb[0]) * factor);
        const g = Math.round(parseInt(rgb[1]) * factor);
        const b = Math.round(parseInt(rgb[2]) * factor);
        return `rgb(${r}, ${g}, ${b})`;
      }
    } catch (e) {
      console.error('Error darkening color:', e);
    }
    
    return color;
  };
  const { getColorPalette, chartDefaults, isDark } = useChartStyles({
    variant,
    colorCount: data.length
  });
  
  const colors = getColorPalette(data.length);
  
  // Track active index for hover effect
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  // Custom legend renderer for pie charts
  const renderLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-4 text-sm">
        {payload.map((entry: any, index: number) => (
          <li 
            key={`item-${index}`} 
            className="flex items-center cursor-pointer"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div
              className="mr-2 size-2.5 rounded-full"
              style={{ backgroundColor: colors[index] }}
            />
            <span className="text-sm text-foreground">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  // Custom label renderer with better positioning
  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, name, value, index } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.7; // Position labels further out
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-midAngle * RADIAN);
    const cos = Math.cos(-midAngle * RADIAN);
    const x = cx + radius * cos;
    const y = cy + radius * sin;
    
    // Only show label for segments with enough area
    if (percent < 0.05) return null;
  
    let label = '';
    switch (labelType) {
      case 'name':
        label = name;
        break;
      case 'value':
        label = value.toString();
        break;
      case 'percent':
        label = `${(percent * 100).toFixed(0)}%`;
        break;
      case 'name-percent':
      default:
        label = `${name}: ${(percent * 100).toFixed(0)}%`;
    }
  
    // Determine text anchor based on position in the circle
    const textAnchor = x > cx ? 'start' : 'end';
  
    return (
      <text 
        x={x} 
        y={y} 
        fill={isDark ? "#f5f5f7" : "#333"} 
        textAnchor={textAnchor} 
        dominantBaseline="central"
        fontSize={12}
        // fontWeight={activeIndex === index ? "bold" : "normal"}
        // Ensure labels are always visible regardless of hover state
        opacity={1}
      >
        {label}
      </text>
    );
  };

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={margin}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={showLabels}
            label={showLabels ? renderCustomizedLabel : undefined}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            paddingAngle={paddingAngle}
            dataKey={dataKey}
            nameKey={nameKey}
            cornerRadius={0}
            // Make sure all labels remain visible during interaction
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index]} 
                stroke={isDark ? "#222" : "#fff"}
                strokeWidth={1}
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                style={{
                  // Apply filter only to the active cell for darkening effect
                  filter: activeIndex === index ? 'brightness(0.75)' : undefined,
                  // Add cursor pointer to indicate interactive element
                  cursor: 'pointer',
                  // Add transition for smooth effect
                  transition: 'filter 0.2s ease-in-out',
                }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              />
            ))}
          </Pie>
          
          <Tooltip 
            {...chartDefaults.tooltipStyle}
            formatter={(value, name, props) => [`${value}`, name]}
          />
          
          {showLegend && (
            <Legend content={customLegend || renderLegend} />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}