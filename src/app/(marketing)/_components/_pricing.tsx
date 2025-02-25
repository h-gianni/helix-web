import { Check, Minus, MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/core/Badge";
import { Button } from "@/components/ui/core/Button";

const features = [
  { name: "Price", starter: "Free", professional: "$9 per seat/month", enterprise: "$19 per seat/month" },
  { name: "Team Members", starter: "Up to 2 per leader", professional: "Up to 10, then $1 per employee", enterprise: "Unlimited" },
  { name: "Performance Reviews", starter: "2 per year", professional: "Unlimited", enterprise: "Unlimited" },
  { name: "AI Features", starter: "None", professional: "Full AI-powered insights", enterprise: "Full AI-powered insights" },
  { name: "Unlimited Team Hierarchy", starter: "Limited*", professional: "Yes", enterprise: "Yes" },
  { name: "Super-Users (HR Team)", starter: "Not available", professional: "Yes", enterprise: "Yes" },
  { name: "Team Member Dashboard Access", starter: "Not available", professional: "Yes", enterprise: "Yes" },
  { name: "Core Scoring", starter: "Yes", professional: "Yes", enterprise: "Yes" },
  { name: "Essential Dashboard", starter: "Yes", professional: "Yes", enterprise: "Yes" },
  { name: "Community Support", starter: "Yes", professional: "Yes", enterprise: "Yes" },
  { name: "Advanced Analytics & Reporting", starter: "No", professional: "Yes", enterprise: "Yes" },
  { name: "Standard Integrations (HR/email)", starter: "No", professional: "Yes", enterprise: "Yes" },
  { name: "Email Support", starter: "No", professional: "Yes", enterprise: "Yes" },
  { name: "Custom Integrations (SSO, API)", starter: "No", professional: "No", enterprise: "Yes" },
  { name: "Dedicated Account Management", starter: "No", professional: "No", enterprise: "Yes" },
  { name: "Priority Support", starter: "No", professional: "No", enterprise: "Yes" },
  { name: "Custom Branding", starter: "No", professional: "No", enterprise: "Yes" },
  { name: "Enhanced Security", starter: "No", professional: "No", enterprise: "Yes" },
];

export const Pricing = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col items-center gap-10">
        <Badge>Pricing</Badge>
        <h2 className="text-3xl md:text-5xl tracking-tighter text-center font-light">
          Prices that make sense!
        </h2>
        <p className="text-lg leading-relaxed text-muted-foreground text-center max-w-xl">
          Managing a small business today is already tough. Choose a plan that fits your needs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Starter Plan */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-2xl">Starter (It's on us)</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Perfect for leaders wanting to test the waters—experience the benefits of real-time insights with cost covered by us.
            </p>
            <p className="text-4xl mt-6">$0</p>
            <p className="text-sm text-muted-foreground">/ month</p>
            <Button variant="outline" className="gap-4 mt-6">
              Start now <MoveRight />
            </Button>
          </div>

          {/* Professional Plan */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-2xl">Professional</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Ideal for leaders with growing teams, offering comprehensive, data-driven leadership tools to empower every decision.
            </p>
            <p className="text-4xl mt-6">$29</p>
            <p className="text-sm text-muted-foreground">/ seat/month</p>
            <Button className="gap-4 mt-6">Try it <MoveRight /></Button>
          </div>

          {/* Enterprise Plan */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-2xl">Enterprise</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Designed for larger organizations or those with advanced needs—get tailor-made integrations, support, and premium analytics.
            </p>
            <p className="text-4xl mt-6">$49</p>
            <p className="text-sm text-muted-foreground">/ seat/month</p>
            <Button variant="outline" className="gap-4 mt-6">
              Generate a quote <PhoneCall />
            </Button>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="overflow-x-auto w-full mt-10">
          <table className="w-full border-collapse border border-muted">
            <thead>
              <tr>
                <th className="p-3 text-left">Feature</th>
                <th className="p-3 text-center">Starter</th>
                <th className="p-3 text-center">Professional</th>
                <th className="p-3 text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3">{feature.name}</td>
                  <td className="p-3 text-center">{renderFeatureIcon(feature.starter)}</td>
                  <td className="p-3 text-center">{renderFeatureIcon(feature.professional)}</td>
                  <td className="p-3 text-center">{renderFeatureIcon(feature.enterprise)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-muted-foreground mt-4">
          *Limited: Only up to 2 team members allowed.
        </p>
      </div>
    </div>
  </div>
);

// Helper function to render icons or text based on feature availability
const renderFeatureIcon = (value: string) => {
  if (value === "Yes") return <Check className="w-4 h-4 text-primary" />;
  if (value === "No") return <Minus className="w-4 h-4 text-muted-foreground" />;
  return <span>{value}</span>;
};
