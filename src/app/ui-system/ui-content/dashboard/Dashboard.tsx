"use client";

import React from "react";
import { 
  Users, 
  Award, 
  Target, 
  BarChart3, 
  CalendarClock, 
  CheckSquare, 
  AlertCircle, 
  Briefcase, 
  LineChart,
  TrendingUp,
  TrendingDown,
  Zap,
  ClipboardCheck,
  UserCircle,
  Building,
  Calendar,
  MessageSquare,
  Star,
  UserCheck,
  Layers,
  FileText
} from "lucide-react";

// Core UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/core/Card";
import { Separator } from "@/components/ui/core/Separator";
import { Button } from "@/components/ui/core/Button";

// Stats Components
import { StatsCard, StatItem } from "@/components/ui/composite/StatsCard";

// Chart Components
import { BaseLineChart } from "@/components/ui/charts/BaseLineChart";
import { BaseAreaChart } from "@/components/ui/charts/BaseAreaChart";
import { BaseBarChart } from "@/components/ui/charts/BaseBarChart";
import { BasePieChart } from "@/components/ui/charts/BasePieChart";
import { BaseRadarChart } from "@/components/ui/charts/BaseRadarChart";

// Sample data aligned with database schema
const teamPerformanceData = [
  { month: "Jan", Engineering: 82, "Product Design": 78, Marketing: 75, Sales: 79, "Customer Success": 80 },
  { month: "Feb", Engineering: 84, "Product Design": 80, Marketing: 76, Sales: 81, "Customer Success": 82 },
  { month: "Mar", Engineering: 86, "Product Design": 82, Marketing: 79, Sales: 84, "Customer Success": 85 },
  { month: "Apr", Engineering: 89, "Product Design": 85, Marketing: 82, Sales: 87, "Customer Success": 88 },
  { month: "May", Engineering: 87, "Product Design": 83, Marketing: 80, Sales: 86, "Customer Success": 87 },
  { month: "Jun", Engineering: 90, "Product Design": 84, Marketing: 82, Sales: 89, "Customer Success": 90 },
];

// Sample data for business action completion
const actionCompletionData = [
  { month: "Jan", completed: 15, active: 25, archived: 5 },
  { month: "Feb", completed: 18, active: 22, archived: 5 },
  { month: "Mar", completed: 22, active: 20, archived: 3 },
  { month: "Apr", completed: 25, active: 18, archived: 2 },
  { month: "May", completed: 30, active: 15, archived: 0 },
  { month: "Jun", completed: 28, active: 18, archived: 2 },
];

// Sample data for team member distribution by function
const teamFunctionDistribution = [
  { name: "Engineering", value: 12 },
  { name: "Product Design", value: 8 },
  { name: "Marketing", value: 6 },
  { name: "Sales", value: 9 },
  { name: "Customer Success", value: 7 },
];

// Sample data for performance review status
const reviewStatusData = [
  { name: "Draft", value: 8 },
  { name: "Published", value: 15 },
  { name: "Acknowledged", value: 10 },
];

// Sample data for job grade distribution
const jobGradeDistribution = [
  { name: "Level 1", value: 5 },
  { name: "Level 2", value: 10 },
  { name: "Level 3", value: 12 },
  { name: "Level 4", value: 8 },
  { name: "Level 5", value: 4 },
  { name: "Level 6", value: 3 },
  { name: "Level 7", value: 1 },
];

// Sample quarterly data for team scores
const quarterlyScoreData = [
  { team: "Engineering", Q1: 85, Q2: 88, Q3: 86, Q4: 90 },
  { team: "Product Design", Q1: 78, Q2: 82, Q3: 85, Q4: 83 },
  { team: "Marketing", Q1: 76, Q2: 80, Q3: 83, Q4: 87 },
  { team: "Sales", Q1: 82, Q2: 85, Q3: 87, Q4: 91 },
  { team: "Customer Success", Q1: 80, Q2: 84, Q3: 86, Q4: 89 },
];

// Sample data for feedback by type
const feedbackByTypeData = [
  { month: "Jan", strengths: 25, improvements: 18, goals: 12 },
  { month: "Feb", strengths: 28, improvements: 20, goals: 15 },
  { month: "Mar", strengths: 32, improvements: 24, goals: 18 },
  { month: "Apr", strengths: 35, improvements: 28, goals: 22 },
  { month: "May", strengths: 40, improvements: 32, goals: 26 },
  { month: "Jun", strengths: 42, improvements: 35, goals: 30 },
];

// Sample data for business action priorities
const businessActionPriorityData = [
  { name: "High", value: 15 },
  { name: "Medium", value: 35 },
  { name: "Low", value: 20 },
];

// Sample data for member score distribution
const memberScoreDistribution = [
  { score: 1, count: 5 },
  { score: 2, count: 8 },
  { score: 3, count: 20 },
  { score: 4, count: 35 },
  { score: 5, count: 22 },
];

const DashboardShowcase = () => {
  return (
    <div className="space-y-8">

      {/* Top Stats Section */}
      <div className="space-y-4">

      <StatsCard
          items={[
            {
              title: "Total Team Members",
              value: "42",
              trend: "up",
              trendValue: "+5",
              trendLabel: "from last month",
              icon: Users,
            },
            {
              title: "Average Rating",
              value: "4.2",
              trend: "up",
              trendValue: "+0.3",
              trendLabel: "from last quarter",
              icon: Star,
            },
            {
              title: "Active Teams",
              value: "5",
              trend: "neutral",
              trendValue: "No change",
              icon: Building,
            },
            {
              title: "Business Actions",
              value: "38",
              trend: "up",
              trendValue: "+6",
              trendLabel: "this month",
              icon: CheckSquare,
            },
          ]}
          columns={4}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Trends</CardTitle>
              <CardDescription>Monthly performance scores by team function</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BaseLineChart
                  data={teamPerformanceData}
                  xKey="month"
                  yKeys={["Engineering", "Product Design", "Marketing", "Sales", "Customer Success"]}
                  height="100%"
                  curved={true}
                  showDots={true}
                  variant="categorical"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
              <CardDescription>Distribution of member scores across rating scale</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BaseBarChart
                  data={memberScoreDistribution}
                  xKey="score"
                  yKeys={["count"]}
                  layout="vertical"
                  height="100%"
                  variant="primary"
                  showLegend={false}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
          <StatsCard
            items={[
              {
                title: "Engineering",
                value: "4.5",
                trend: "up",
                trendValue: "+0.3",
                trendLabel: "vs. last quarter",
                icon: Zap,
              },
              {
                title: "Product Design",
                value: "4.2",
                trend: "up",
                trendValue: "+0.2",
                trendLabel: "vs. last quarter",
                icon: Briefcase,
              },
              {
                title: "Marketing",
                value: "4.1",
                trend: "up",
                trendValue: "+0.4",
                trendLabel: "vs. last quarter",
                icon: Target,
              },
              {
                title: "Sales",
                value: "4.4",
                trend: "neutral",
                trendValue: "No change",
                icon: BarChart3,
              },
              {
                title: "Customer Success",
                value: "4.5",
                trend: "up",
                trendValue: "+0.2",
                trendLabel: "vs. last quarter",
                icon: UserCheck,
              },
            ]}
            columns={5}
            background="default"
          />

        <Card>
          <CardHeader>
            <CardTitle>Quarterly Performance by Team</CardTitle>
            <CardDescription>Team scores across all quarters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <BaseBarChart
                data={quarterlyScoreData}
                xKey="team"
                yKeys={["Q1", "Q2", "Q3", "Q4"]}
                height="100%"
                variant="categorical"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Review Status</CardTitle>
              <CardDescription>Distribution of performance reviews by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BasePieChart
                  data={reviewStatusData}
                  dataKey="value"
                  nameKey="name"
                  height="100%"
                  innerRadius={60}
                  outerRadius={100}
                  variant="categorical"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feedback Components</CardTitle>
              <CardDescription>Volume of different feedback components over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BaseAreaChart
                  data={feedbackByTypeData}
                  xKey="month"
                  yKeys={["strengths", "improvements", "goals"]}
                  height="100%"
                  curved={true}
                  stacked={true}
                  variant="primary"
                />
              </div>
            </CardContent>
          </Card>
        </div>

          <StatsCard
            items={[
              {
                title: "Pending Reviews",
                value: "8",
                trend: "down",
                trendValue: "-3",
                trendLabel: "from last quarter",
                icon: FileText,
              },
              {
                title: "Feedback Count",
                value: "108",
                trend: "up",
                trendValue: "+12",
                trendLabel: "from last quarter",
                icon: MessageSquare,
              },
              {
                title: "Review Completion",
                value: "76%",
                trend: "up",
                trendValue: "+8%",
                trendLabel: "from last quarter",
                icon: CheckSquare,
              },
            ]}
            columns={3}
            withDividers={true}
          />

        <Card>
          <CardHeader>
            <CardTitle>Skills Assessment</CardTitle>
            <CardDescription>Comparison of skill dimensions across seniority levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <BaseRadarChart
                data={[
                  { skill: "Technical", "Senior": 90, "Mid-level": 70, "Junior": 45 },
                  { skill: "Communication", "Senior": 85, "Mid-level": 65, "Junior": 50 },
                  { skill: "Leadership", "Senior": 80, "Mid-level": 60, "Junior": 35 },
                  { skill: "Problem Solving", "Senior": 88, "Mid-level": 72, "Junior": 55 },
                  { skill: "Teamwork", "Senior": 92, "Mid-level": 80, "Junior": 65 },
                  { skill: "Initiative", "Senior": 86, "Mid-level": 68, "Junior": 45 },
                ]}
                dataKeys={["Senior", "Mid-level", "Junior"]}
                labelKey="skill"
                height="100%"
                variant="categorical"
                outerRadius={140}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Function Distribution</CardTitle>
              <CardDescription>Distribution of team members across functions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <BasePieChart
                  data={teamFunctionDistribution}
                  dataKey="value"
                  nameKey="name"
                  height="100%"
                  innerRadius={0}
                  variant="categorical"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Grade Distribution</CardTitle>
              <CardDescription>Distribution of team members across job grades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <BasePieChart
                  data={jobGradeDistribution}
                  dataKey="value"
                  nameKey="name"
                  height="100%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  variant="primary"
                />
              </div>
            </CardContent>
          </Card>
        </div>

          <StatsCard
            items={[
              {
                title: "Team Admins",
                value: "8",
                trendLabel: "Across all teams",
                icon: UserCircle,
              },
              {
                title: "Active Members",
                value: "36",
                trend: "up",
                trendValue: "+3",
                trendLabel: "from last month",
                icon: Users,
              },
              {
                title: "On Leave",
                value: "6",
                trend: "up",
                trendValue: "+2",
                trendLabel: "from last month",
                icon: Calendar,
              },
            ]}
            columns={3}
            background="default"
          />

        <Card>
          <CardHeader>
            <CardTitle>Team Member Status</CardTitle>
            <CardDescription>Distribution of team members by job grade and function</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <BaseBarChart
                data={[
                  { function: "Engineering", "Junior (L1-2)": 4, "Mid-level (L3-5)": 6, "Senior (L6-7)": 2 },
                  { function: "Product Design", "Junior (L1-2)": 3, "Mid-level (L3-5)": 4, "Senior (L6-7)": 1 },
                  { function: "Marketing", "Junior (L1-2)": 2, "Mid-level (L3-5)": 3, "Senior (L6-7)": 1 },
                  { function: "Sales", "Junior (L1-2)": 3, "Mid-level (L3-5)": 5, "Senior (L6-7)": 1 },
                  { function: "Customer Success", "Junior (L1-2)": 2, "Mid-level (L3-5)": 4, "Senior (L6-7)": 1 },
                ]}
                xKey="function"
                yKeys={["Junior (L1-2)", "Mid-level (L3-5)", "Senior (L6-7)"]}
                stacked={true}
                height="100%"
                variant="categorical"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Action Completion Trends</CardTitle>
              <CardDescription>Monthly business action status distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BaseAreaChart
                  data={actionCompletionData}
                  xKey="month"
                  yKeys={["completed", "active", "archived"]}
                  height="100%"
                  curved={true}
                  stacked={true}
                  variant="categorical"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Action Priorities</CardTitle>
              <CardDescription>Distribution of business actions by priority</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BasePieChart
                  data={businessActionPriorityData}
                  dataKey="value"
                  nameKey="name"
                  height="100%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  variant="sequential"
                />
              </div>
            </CardContent>
          </Card>
        </div>

          <StatsCard
            items={[
              {
                title: "Active Actions",
                value: "18",
                trend: "down",
                trendValue: "-3",
                trendLabel: "from last month",
                icon: Layers,
              },
              {
                title: "Completed Actions",
                value: "28",
                trend: "up",
                trendValue: "+5",
                trendLabel: "from last month",
                icon: CheckSquare,
              },
              {
                title: "Completion Rate",
                value: "74%",
                trend: "up",
                trendValue: "+8%",
                trendLabel: "from last month",
                icon: Award,
              },
            ]}
            columns={3}
            withDividers={false}
          />

        <Card>
          <CardHeader>
            <CardTitle>Actions by Team</CardTitle>
            <CardDescription>Distribution of business actions across teams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <BaseBarChart
                data={[
                  { team: "Engineering", active: 5, completed: 8, archived: 2 },
                  { team: "Product Design", active: 4, completed: 5, archived: 1 },
                  { team: "Marketing", active: 3, completed: 6, archived: 0 },
                  { team: "Sales", active: 4, completed: 7, archived: 1 },
                  { team: "Customer Success", active: 2, completed: 4, archived: 1 },
                ]}
                xKey="team"
                yKeys={["active", "completed", "archived"]}
                stacked={true}
                height="100%"
                variant="categorical"
              />
            </div>
          </CardContent>
        </Card>

        <StatsCard
          items={[
            {
              title: "Avg. Time to Complete Action",
              value: "14 days",
              trend: "down",
              trendValue: "-2 days",
              trendLabel: "from previous period",
              icon: CalendarClock,
            },
            {
              title: "Avg. Review Turnaround",
              value: "5.2 days",
              trend: "down",
              trendValue: "-0.8 days",
              trendLabel: "from previous period",
              icon: FileText,
            },
          ]}
          columns={2}
          background="default"
        />
        
        <StatsCard
          items={[
            {
              title: "New Members This Month",
              value: "5",
              trend: "up",
              trendValue: "+2",
              trendLabel: "vs. last month",
              icon: Users,
            },
            {
              title: "Top Performer",
              value: "Engineering",
              trendLabel: "Highest rated team",
              icon: Award,
            },
            {
              title: "Subscription",
              value: "Premium",
              trendLabel: "Auto-renews in 45 days",
              icon: Building,
            },
          ]}
          columns={3}
          background="default"
        />

        <StatsCard
          items={[
            {
              title: "Job Titles",
              value: "18",
              trendLabel: "Across all teams",
              icon: Briefcase,
            },
            {
              title: "Job Grades",
              value: "7",
              trendLabel: "Across organization",
              icon: Layers,
            },
            {
              title: "High Priority Actions",
              value: "15",
              trend: "up",
              trendValue: "+3",
              trendLabel: "this month",
              icon: AlertCircle,
            },
            {
              title: "Performance Reviews",
              value: "33",
              trendLabel: "Current quarter",
              icon: FileText,
            },
          ]}
          columns={4}
          withDividers={false}
        />
      </div>
    </div>
  );
};

export default DashboardShowcase;