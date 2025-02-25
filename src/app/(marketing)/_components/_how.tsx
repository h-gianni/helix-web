import { Badge } from "@/components/ui/core/Badge";

export const How = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex gap-4 flex-col items-start">
          <div>
            <Badge>Platform</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
              Your Secret Weapon for Building an A Team
            </h2>
            <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground  text-left">
              Managing performance isn’t just about annual reviews—it’s about
              continuous insight, coaching, and alignment with business goals.
              Our AI-powered app combines real-time scoring with instant
              analytics so you can pinpoint each team member’s strengths,
              address issues early, and drive results that truly stand out.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex flex-col gap-2">
            <div className="bg-muted rounded-md aspect-video mb-2"></div>
            <h3 className="text-xl tracking-tight">
              Set Up Your Team & Key Seats
            </h3>
            <p className="text-muted-foreground text-base">
              Map your team structure and identify the most critical roles—this
              lays the foundation for focused performance tracking.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="bg-muted rounded-md aspect-video mb-2"></div>
            <h3 className="text-xl tracking-tight">
              Score Actions & Behaviors in Real Time
            </h3>
            <p className="text-muted-foreground text-base">
              Capture everyday performance with quick scoring. Once entered, our
              AI analyzes these scores to generate data-driven insights that
              reveal trends, patterns, and opportunities for growth.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="bg-muted rounded-md aspect-video mb-2"></div>
            <h3 className="text-xl tracking-tight">
              Turn Insights into Action
            </h3>
            <p className="text-muted-foreground text-base">
              Leverage these AI-powered metrics to provide targeted feedback,
              address issues early, and align each person’s effort with your
              wider business goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
