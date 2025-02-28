import { MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/core/Badge";
import { Button } from "@/components/ui/core/Button";

export const CTA1 = () => (
  <section className="bg-muted">
    <div className="section-container rounded-md">
      <div className="section-header-centered">
        <div>
          <Badge>Get started</Badge>
        </div>
        <h3 className="marketing-h1">Ready to see it all in action?</h3>
        <p className="marketing-body-lg">
          Start with our “Starter” plan—absolutely free, with no payment info
          required and no strings attached. If you love what you see, you can
          easily upgrade to our Professional plan at any time.
        </p>
        <div className="flex flex-row gap-4 mx-auto">
          <Button variant="outline" size="lg">
            I want to see a demo <PhoneCall />
          </Button>
          <Button size="lg">
            I want to play with it <MoveRight />
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
