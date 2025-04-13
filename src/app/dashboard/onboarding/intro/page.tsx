// app/dashboard/onboarding/intro/page.tsx

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/core/Button";
import {
  ArrowRight,
  Building2,
  Users,
  Globe,
  PencilRuler,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/core/Badge";
import Image from "next/image";
import LogoImage from "@/assets/shared/logo.svg";
import { Card } from "@/components/ui/core/Card";

export default function OnboardingIntroPage() {
  const router = useRouter();

  // Define steps without completion status
  const setupSteps = [
    {
      icon: Building2,
      title: "1. Organisation info",
      description: "Add basic info about your organisation",
      time: "Est. 10 sec",
      path: "/dashboard/onboarding/organisation",
    },
    {
      icon: Globe,
      title: "2. Org Actions",
      description: "Select actions that align with your organisation's values",
      time: "Est. 30 sec",
      path: "/dashboard/onboarding/global-actions",
    },
    {
      icon: PencilRuler,
      title: "3. Function Actions",
      description:
        "Select function-specific actions for performance evaluation",
      time: "Est. 1 min",
      path: "/dashboard/onboarding/function-actions",
    },
    {
      icon: User,
      title: "4. Members",
      description: "Add the people you are responsible for",
      time: "Est. 1-2 min",
      path: "/dashboard/onboarding/members",
    },
    {
      icon: Users,
      title: "5. Teams",
      description: "Create teams and assign people and functions to them",
      time: "Est. 1 min",
      path: "/dashboard/onboarding/teams",
    },
    {
      icon: Users,
      title: "6. Summary",
      description: "Review the configuration and complete the onboarding",
      time: "Est. 15 sec",
      path: "/dashboard/onboarding/summary",
    },
  ];

  const handleStartOnboarding = () => {
    // Always start at the beginning
    router.push("/dashboard/onboarding/organisation");
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
        <div className="space-y-8 mb-8">
          <div className="space-y-4 mb-4">
            <div className="flex justify-center mb-4">
              <Image
                src={LogoImage}
                alt="JustScore"
                className="size-16"
                priority
              />
            </div>
            <h1 className="display-1 mb-4">JustScore</h1>
          </div>
          <p className="body-lg text-foreground-weak max-w-xl mx-auto py-4">
            Let&apos;s get your organisation set up so you can start tracking and
            improving team performance. <br />
            This quick and easy onboarding will guide you through the
            configuration.
          </p>
          <div className="space-y-6 pb-4">
            <Badge variant="secondary">Est. 1-3 min</Badge>
            <div>
            <Button
              size="xl"
              variant="primary"
              onClick={handleStartOnboarding}
              className="gap-2"
            >
              Start Onboarding <ArrowRight className="size-4" />
            </Button>
            </div>
          </div>
          <Card className="w-full grid md:grid-cols-3 items-start gap-4 max-w-4xl p-8 text-left">
            {setupSteps.map((step, index) => (
              <div
                key={step.title}
                className="flex flex-row justify-center gap-4 p-4 rounded-lg relative"
              >
                <div className="flex-shrink-0">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-neutral-lightest">
                    <step.icon className="size-5 text-primary" />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <h3 className="heading-4">{step.title}</h3>
                  <p className="body-sm text-foreground-weak">
                    {step.description}
                  </p>
                  {/* <p className="text-xs text-foreground-muted">{step.time}</p> */}
                </div>
              </div>
            ))}
          </Card>
          <div className="text-sm text-foreground-weak">
            <p>
              Need help? Contact our support team at{" "}
              <a
                href="mailto:support@justscore.ai"
                className="text-primary hover:underline"
              >
                support@justscore.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
