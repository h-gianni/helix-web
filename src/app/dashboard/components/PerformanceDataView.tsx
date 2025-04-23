"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/core/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { usePerformersStore } from "@/store/performers-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/core/Select";
import { Label } from "@/components/ui/core/Label";
import type { Member } from "@/store/member";
import type { TeamResponse } from "@/lib/types/api";

interface PerformanceDataViewProps {
  performers: Member[];
  teams: TeamResponse[];
}

export default function PerformanceDataView({ performers, teams }: PerformanceDataViewProps) {
  const { performanceCategories, getPerformanceCategory } = usePerformersStore();
  const [timeRange, setTimeRange] = useState("quarter");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // Skip performers without ratings
  const ratedPerformers = performers.filter(p => p.ratingsCount > 0);
  
  // Calculate performers by category for pie chart
  const performersByCategory = performanceCategories.map(category => {
    const count = performers.filter(performer => {
      if (category.label === "Not Scored") {
        return performer.ratingsCount === 0;
      }
      return (
        performer.ratingsCount > 0 &&
        performer.averageRating >= category.minRating &&
        performer.averageRating <= category.maxRating
      );
    }).length;
    
    return {
      name: category.label,
      value: count,
      color: category.label === "Not Scored" 
        ? "#6e7681" 
        : getComputedColorFromClassName(category.className)
    };
  }).filter(item => item.value > 0);
  
  // Calculate team performance for bar chart
  const teamPerformance = teams.map(team => {
    const teamMembers = performers.filter(p => p.teamId === team.id && p.ratingsCount > 0);
    const avgRating = teamMembers.length > 0
      ? teamMembers.reduce((sum, p) => sum + p.averageRating, 0) / teamMembers.length
      : 0;
    
    return {
      name: team.name,
      rating: parseFloat(avgRating.toFixed(2)),
      members: teamMembers.length
    };
  }).filter(t => t.rating > 0);

  // Sample time series data - in a real app, this would come from an API
  const timeSeriesData = [
    { period: "Q1 2023", "Team A": 3.8, "Team B": 4.2 },
    { period: "Q2 2023", "Team A": 4.0, "Team B": 4.0 },
    { period: "Q3 2023", "Team A": 4.2, "Team B": 3.9 },
    { period: "Q4 2023", "Team A": 4.5, "Team B": 4.1 },
    { period: "Q1 2024", "Team A": 4.3, "Team B": 4.4 }
  ];

  // Sample data for performance by job grade
  const performanceByGrade = [
    { name: "Junior", rating: 3.6, count: 15 },
    { name: "Mid-level", rating: 4.1, count: 25 },
    { name: "Senior", rating: 4.5, count: 18 },
    { name: "Lead", rating: 4.7, count: 6 },
  ];

  // Helper function to derive colors from TailwindCSS classnames
  function getComputedColorFromClassName(className: string) {
    // Extract the color from className like "text-success-base"
    const colorMatch = className.match(/text-([a-z]+)-([a-z]+)/);
    if (!colorMatch) return "#6e7681";
    
    const colorMap: Record<string, Record<string, string>> = {
      success: { base: "#10b981", lightest: "#ecfdf5" },
      primary: { base: "#3b82f6", lightest: "#eff6ff" },
      warning: { base: "#f59e0b", lightest: "#fffbeb" },
      destructive: { base: "#ef4444", lightest: "#fef2f2" }
    };
    
    return colorMap[colorMatch[1]]?.[colorMatch[2]] || "#6e7681";
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 border rounded-md text-center">
              <div className="text-2xl font-bold">{performers.length}</div>
              <div className="text-sm text-muted-foreground">Total Members</div>
            </div>
            <div className="p-4 border rounded-md text-center">
              <div className="text-2xl font-bold">
                {ratedPerformers.length > 0 
                  ? (ratedPerformers.reduce((sum, p) => sum + p.averageRating, 0) / ratedPerformers.length).toFixed(1)
                  : "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
            <div className="p-4 border rounded-md text-center">
              <div className="text-2xl font-bold">
                {ratedPerformers.length > 0
                  ? Math.max(...ratedPerformers.map(p => p.averageRating)).toFixed(1)
                  : "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">Highest Rating</div>
            </div>
            <div className="p-4 border rounded-md text-center">
              <div className="text-2xl font-bold">{performers.filter(p => p.ratingsCount === 0).length}</div>
              <div className="text-unavailable">Not Rated</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={teamPerformance}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis domain={[0, 5]} />
                  <Tooltip 
                    formatter={(value, name) => {
                      return name === "rating" 
                        ? [`${value} / 5`, "Avg Rating"] 
                        : [value, "Members"];
                    }}
                  />
                  <Bar dataKey="rating" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performersByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {performersByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => [`${value} members`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      {/* Team Performance Over Time */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Team Performance Trends</CardTitle>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quarter">Quarterly</SelectItem>
              <SelectItem value="half-year">Half-Yearly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
              <SelectItem value="two-years">Last 2 Years</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                {/* In a real app, map over actual teams */}
                <Line 
                  type="monotone" 
                  dataKey="Team A" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="Team B" 
                  stroke="#10b981" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance by Job Grade */}
      <Card>
        <CardHeader>
          <CardTitle>Performance by Job Grade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceByGrade}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip 
                  formatter={(value, name) => {
                    return name === "rating" 
                      ? [`${value} / 5`, "Avg Rating"] 
                      : [value, "Count"];
                  }}
                />
                <Legend />
                <Bar dataKey="rating" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Performance by Category</CardTitle>
          <div className="mt-2">
            <Label htmlFor="category">Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category" className="w-full md:w-1/3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category1">Customer Centricity</SelectItem>
                <SelectItem value="category2">Technical Skills</SelectItem>
                <SelectItem value="category3">Leadership</SelectItem>
                <SelectItem value="category4">Teamwork</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {selectedCategory ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={ratedPerformers
                    .sort((a, b) => b.averageRating - a.averageRating)
                    .slice(0, 10)
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 5]} />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value} / 5`, "Rating"]} />
                  <Bar dataKey="averageRating" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-60 items-center justify-center text-muted-foreground">
              Select a category to view performance ranking
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}