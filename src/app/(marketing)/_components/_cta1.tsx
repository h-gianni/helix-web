import { MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/core/Badge";
import { Button } from "@/components/ui/core/Button";

export const CTA1 = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col text-center bg-muted rounded-md p-4 lg:p-14 gap-8 items-center">
        <div>
          <Badge>Get started</Badge>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
            Ready to see it all in action?
          </h3>
          <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl">
            Start with our “On Us” plan—absolutely free, with no payment info
            required and no strings attached. If you love what you see, you can
            easily upgrade to our Professional plan at any time.
          </p>
        </div>
        <div className="flex flex-row gap-4">
          <Button className="gap-4" variant="outline">
          I Want to See a Demo <PhoneCall className="w-4 h-4" />
          </Button>
          <Button className="gap-4">
            I want to play with it <MoveRight className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl">
          Experience how our AI-powered app transforms performance
          management—one real-time score at a time.
        </p>
      </div>
    </div>
  </div>
);
