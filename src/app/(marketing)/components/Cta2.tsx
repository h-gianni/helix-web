"use client";

import { MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/core/Badge";
import { Button } from "@/components/ui/core/Button";

export const CTA2 = () => (
  <section>
    <div className="section-container">
      <div className="section-header-centered">
        <div>
          <Badge variant="accent">Get started</Badge>
        </div>
        <h3 className="marketing-h1">Try UpScore today!</h3>
        <p className="marketing-body-lg">
          Start with our “Starter” plan—absolutely free, with no payment info
          required and no strings attached. If you love what you see, you can
          easily upgrade to our Professional plan at any time.
        </p>
        <div className="flex flex-col md:flex-row gap-4 mx-auto">
          <Button variant="outline" size="xl">
            I want to see a Demo <PhoneCall />
          </Button>
          <Button variant="accent" size="xl">
            Sign up here <MoveRight />
          </Button>
        </div>

        <p className="marketing-body pt-8 max-w-xs mx-auto">
          Experience how our AI-powered app transforms performance
          management—one real-time score at a time.
        </p>
      </div>
    </div>
  </section>
);
