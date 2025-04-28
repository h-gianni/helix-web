"use client";

import { Check, Minus, MoveRight, Calculator, Lock } from "lucide-react";
import { Badge } from "@/components/ui/core/Badge";
import { Button } from "@/components/ui/core/Button";
import { Card } from "@/components/ui/core/Card";

const features = [
  {
    name: "Price",
    starter: "Free (all cost on us)",
    professional: "$29 per seat/month",
    enterprise: "$49 per seat/month",
  },
  {
    name: "Team Members",
    starter: "Up to 2 per leader",
    professional: "Up to 10, then $1 per employee",
    enterprise: "Unlimited",
  },
  {
    name: "Performance Reviews",
    starter: "2 per year",
    professional: "Unlimited",
    enterprise: "Unlimited",
  },
  {
    name: "AI Features",
    starter: "None",
    professional: "Full AI-powered insights",
    enterprise: "Full AI-powered insights",
  },
  {
    name: "Unlimited Team Hierarchy",
    starter: "Limited*",
    professional: "Yes",
    enterprise: "Yes",
  },
  {
    name: "Super-Users (HR Team)",
    starter: "Not available",
    professional: "Yes",
    enterprise: "Yes",
  },
  {
    name: "Team Member Dashboard Access",
    starter: "Not available",
    professional: "Yes",
    enterprise: "Yes",
  },
  {
    name: "Core Scoring",
    starter: "Yes",
    professional: "Yes",
    enterprise: "Yes",
  },
  {
    name: "Essential Dashboard",
    starter: "Yes",
    professional: "Yes",
    enterprise: "Yes",
  },
  {
    name: "Community Support",
    starter: "Yes",
    professional: "Yes",
    enterprise: "Yes",
  },
  {
    name: "Advanced Analytics & Reporting",
    starter: "No",
    professional: "Yes",
    enterprise: "Yes",
  },
  {
    name: "Standard Integrations (HR/email)",
    starter: "No",
    professional: "Yes",
    enterprise: "Yes",
  },
  {
    name: "Email Support",
    starter: "No",
    professional: "Yes",
    enterprise: "Yes",
  },
  {
    name: "Custom Integrations (SSO, API)",
    starter: "No",
    professional: "No",
    enterprise: "Yes",
  },
  {
    name: "Dedicated Account Management",
    starter: "No",
    professional: "No",
    enterprise: "Yes",
  },
  {
    name: "Priority Support",
    starter: "No",
    professional: "No",
    enterprise: "Yes",
  },
  {
    name: "Custom Branding",
    starter: "No",
    professional: "No",
    enterprise: "Yes",
  },
  {
    name: "Enhanced Security",
    starter: "No",
    professional: "No",
    enterprise: "Yes",
  },
];

export const Pricing = () => (
  <section id="pricing" className="bg-white">
    <div className="section-container">
      <div className="section-header-centered">
        <div>
          <Badge variant="accent">Pricing</Badge>
        </div>
        <h2 className="marketing-h1">Prices that make sense!</h2>
        <p className="marketing-body-lg">
          Managing a team today is already tough. <br />
          Choose a plan that fits your needs and become a Star Leader.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {/* Starter Plan */}
        <Card className="p-4 lg:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="relative bg-muted/50 rounded-md h-32">
              <Badge variant="secondary" className="absolute top-0">
                For the new and curious ones
              </Badge>
            </div>
            <h3 className="marketing-h3">Starter</h3>
            <p className="marketing-body-sm">
              Perfect for leaders wanting to test the waters—experience the
              benefits of real-time insights with cost covered by us.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex gap-0 items-baseline">
              <span className="marketing-h2 mt-2">$0</span>
              <span className="marketing-body">n us, forever!</span>
            </div>
            <Button size="xl" variant="outline" className="w-full">
              Start now <MoveRight />
            </Button>
            <div className="flex justify-center gap-2 marketing-body-xs font-semibold">
              No payment info required
            </div>
            <ul className="marketing-body-xs space-y-1.5 border-t border-border pt-4">
              <li className="flex gap-2.5">
                <Check className="size-3 text-accent mt-0.5 flex-none" />
                <span>Up to 2 Team Members</span>
              </li>
              <li className="flex gap-2.5">
                <Check className="size-3 text-accent mt-0.5 flex-none" />
                <span>2 AI generated Performance Reviews per member/year</span>
              </li>
              <li className="flex gap-2.5">
                <Check className="size-3 text-accent mt-0.5 flex-none" />
                <span>Basic Scoring & Dashboard</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Professional Plan */}
        <Card className="p-4 lg:p-8 shadow-lg flex flex-col justify-between">
          <div className="space-y-4">
            <div className="relative bg-muted/50 rounded-md h-32">
              <Badge variant="accent">Leaders unfair advantage</Badge>
            </div>
            <h3 className="marketing-h3">Professional</h3>
            <p className="marketing-body-sm">
              Ideal for leaders with growing teams, offering comprehensive,
              data-driven leadership tools to empower every decision.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex gap-2 items-baseline">
              <span className="marketing-h2 mt-2">$7.90</span>
              <span className="marketing-body">per seat/month</span>
            </div>
            <Button size="xl" variant="accent" className="w-full">
              Try it <MoveRight />
            </Button>
            <div className="flex justify-center gap-2 marketing-body-xs font-semibold">
              <Lock className="size-4" /> Secure transaction
            </div>
            <ul className="marketing-body-xs space-y-1.5 border-t border-border pt-4">
              <li className="flex gap-2.5">
                <Check className="size-3 text-accent mt-0.5 flex-none" />
                <span>Unlimited Team Members & Hierarchy</span>
              </li>
              <li className="flex gap-2.5">
                <Check className="size-3 text-accent mt-0.5 flex-none" />
                <span>
                  2 AI generated Performance Reviews per member/quarter (8 in a
                  year)
                </span>
              </li>
              <li className="flex gap-2.5">
                <Check className="size-3 text-accent mt-0.5 flex-none" />
                <span>Full AI-Powered Insights & Real-Time Scoring</span>
              </li>
              <li className="flex gap-2.5">
                <Check className="size-3 text-accent mt-0.5 flex-none" />
                <span>Team Member Dashboard Access</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Enterprise Plan */}
        <Card className="p-4 lg:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="relative bg-muted/50 rounded-md h-32">
              <Badge variant="secondary" className="absolute top-0">
                Impactful org results
              </Badge>
            </div>
            <h3 className="marketing-h3">Enterprise</h3>
            <p className="marketing-body-sm">
              Designed for organizations or those with advanced needs—get
              tailor-made integrations, support, and premium analytics.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex gap-2 items-baseline">
              <span className="marketing-h5 pt-2">Custom</span>
              <span className="marketing-body">per seat/month</span>
            </div>
            <Button size="xl" variant="outline" className="w-full">
              Generate a quote <Calculator />
            </Button>
            <div className="flex justify-center gap-2 marketing-body-xs font-semibold">
              <Lock className="size-4" /> Secure transaction
            </div>
            <ul className="marketing-body-xs space-y-1.5 border-t border-border pt-4">
              <li className="flex gap-2.5">
                <Check className="size-3 text-accent mt-0.5 flex-none" />
                <span>All Professional Features, Plus:</span>
              </li>
              <li className="flex gap-2.5">
                <Check className="size-3 text-accent mt-0.5 flex-none" />
                <span>HR Super-User management</span>
              </li>
              <li className="flex gap-2.5">
                <Check className="size-3 text-accent mt-0.5 flex-none" />
                <span>Custom Integrations (SSO, API)</span>
              </li>
              <li className="flex gap-2.5">
                <Check className="size-3 text-accent mt-0.5 flex-none" />
                <span>Advanced Analytics & Standard Integrations</span>
              </li>
              <li className="flex gap-2.5">
                <Check className="size-3 text-accent mt-0.5 flex-none" />
                <span>Enhanced Security & Custom Branding</span>
              </li>
            </ul>
          </div>
        </Card>
      </div>

      {/* Feature Comparison Table */}
      <Card className="p-0 overflow-x-auto w-full mt-10 max-w-5xl mx-auto">
        <table className="w-full border-collapse rounded-t-lg">
          <thead>
            <tr className="bg-secondary">
              <th className="p-3 marketing-h5 text-left rounded-tl-lg"></th>
              <th className="p-3 marketing-h5 text-center">Starter</th>
              <th className="p-3 marketing-h5 text-center">Professional</th>
              <th className="p-3 marketing-h5 text-center rounded-tr-lg">
                Enterprise
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <tr key={index} className="border-t border-border bg-white">
                <td className="bg-background p-3 marketing-body-sm font-semibold text-foreground">
                  {feature.name}
                </td>
                <td className="p-3 marketing-body-sm text-foreground text-center">
                  {renderFeatureIcon(feature.starter)}
                </td>
                <td className="p-3 marketing-body-sm text-foreground text-center">
                  {renderFeatureIcon(feature.professional)}
                </td>
                <td className="p-3 marketing-body-sm text-foreground text-center">
                  {renderFeatureIcon(feature.enterprise)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  </section>
);

// Helper function to render icons or text based on feature availability
const renderFeatureIcon = (value: string) => {
  if (value === "Yes") return <Check className="w-4 h-4 text-accent mx-auto" />;
  if (value === "No")
    return <Minus className="w-4 h-4 text-muted-foreground mx-auto" />;
  return <span>{value}</span>;
};
