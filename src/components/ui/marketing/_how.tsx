import { Badge } from "@/components/ui/core/Badge";
import { Circle } from "lucide-react";

// Steps data array for clean separation of content
const steps = [
  {
    title: "Set Up Your Org and Team",
    description:
      "Map your team structure and identify the most critical roles—this lays the foundation for focused performance tracking.",
  },
  {
    title: "Score Actions & Behaviors in Real Time",
    description:
      "Capture everyday performance with quick scoring. Once entered, our AI analyzes these scores to generate data-driven insights that reveal trends, patterns, and opportunities for growth.",
  },
  {
    title: "Turn Insights into Action",
    description:
      "Leverage these AI-powered metrics to provide targeted feedback, address issues early, and align each person’s effort with your wider business goals.",
  },
];

export const How = () => (
  <section className="flex p-0">
    <div className="hidden md:block bg-muted w-2/5 rounded-tr-xl"></div>
    <div className="section-container lg:w-3/5 px-4 lg:p-16 lg:py-20">
      <div className="section-header">
        <div>
          <Badge>Easy peasy</Badge>
        </div>
        <h2 className="marketing-h1">
          Your Secret Weapon for Building an A-Team
        </h2>
        <p className="marketing-body-lg">
          Managing performance isn’t just about annual reviews—it’s about
          continuous insight, coaching, and alignment with business goals. Our
          AI-powered app combines real-time scoring with instant analytics so
          you can pinpoint each team member’s strengths, address issues early,
          and drive results that truly stand out.
        </p>
      </div>

      {/* Vertical Stepper */}
      <div className="relative flex flex-col gap-1 max-w-3xl px-4 lg:pl-0">
        {steps.map((step, index) => (
          <div key={index} className="flex items-stretch gap-6 relative">
            {/* Step Indicator (Dot & Vertical Line) */}
            <div className="flex flex-col items-center">
              <Circle className="size-4 fill-foreground-muted/25 text-background" />
              {index !== steps.length - 1 && (
                <div className="w-1 bg-foreground-muted/10 h-full min-h-[50px] mt-1"></div>
              )}
            </div>

            {/* Step Content */}
            <div className="space-y-4 max-w-lg -mt-1">
              <div>
                <Badge variant="secondary">Step {index + 1}</Badge>
              </div>
              <div className="space-y-1.5">
              <h3 className="marketing-h4">{step.title}</h3>
              <p className="marketing-body text-foreground-weak pb-8">
                {step.description}
              </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
