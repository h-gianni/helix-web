import { Badge } from "@/components/ui/core/Badge";

export const Features = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <h2 className="display-1">Key features and benefits</h2>
      {/* Block 1 */}
      <div className="flex flex-col-reverse lg:flex-row gap-10 lg:items-center">
        <div className="bg-muted rounded-md w-full aspect-video h-full flex-1">
          Screenshot
        </div>
        <div className="flex gap-4 pl-0 lg:pl-20 flex-col  flex-1">
          <div>
            <Badge>Platform</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-xl md:text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
              AI-Driven Analytics
            </h2>
            <p className="text-lg max-w-xl lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground text-left">
              Feature: Our platform’s AI instantly interprets each scored action
              to highlight performance patterns and potential red flags.
              Benefit: You don’t have to wait until it’s too late—gain early
              insights so you can celebrate strengths and address areas of
              improvement right away.
            </p>
          </div>
        </div>
      </div>
      {/* Block 2 */}
      <div className="flex flex-col lg:flex-row gap-10 lg:items-center">
        <div className="flex gap-4 flex-col flex-1">
          <div>
            <Badge>Platform</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-xl md:text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
              Real-Time Team Dashboards
            </h2>
            <p className="text-lg max-w-xl lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground text-left">
              Feature: Live dashboards give you a bird’s-eye view of everyone’s
              progress in one place. Benefit: Eliminate guesswork with data you
              can act on at a glance, keeping your entire team aligned and
              focused.
            </p>
          </div>
        </div>
        <div className="bg-muted rounded-md w-full aspect-video h-full flex-1"></div>
      </div>
      {/* Block 3 */}
      <div className="flex flex-col-reverse lg:flex-row gap-10 lg:items-center">
        <div className="bg-muted rounded-md w-full aspect-video h-full flex-1">
          Screenshot
        </div>
        <div className="flex gap-4 pl-0 lg:pl-20 flex-col  flex-1">
          <div>
            <Badge>Platform</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-xl md:text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
              Seamless Feedback Loop
            </h2>
            <p className="text-lg max-w-xl lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground text-left">
              Feature: Built-in notifications and prompts help you share
              immediate feedback that resonates. Benefit: Keep motivation high
              and course-correct quickly—no more waiting until the next lengthy
              review cycle.
            </p>
          </div>
        </div>
      </div>
      {/* Block 4 */}
      <div className="flex flex-col lg:flex-row gap-10 lg:items-center">
        <div className="flex gap-4 flex-col flex-1">
          <div>
            <Badge>Platform</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-xl md:text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
              Unified Scoring Framework
            </h2>
            <p className="text-lg max-w-xl lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground text-left">
              Feature: Everyone on the team is measured against the same clear,
              consistent criteria. Benefit: Create a fair, transparent
              environment that your team trusts and respects.
            </p>
          </div>
        </div>
        <div className="bg-muted rounded-md w-full aspect-video h-full flex-1"></div>
      </div>
      {/* Block 5 */}
      <div className="flex flex-col-reverse lg:flex-row gap-10 lg:items-center">
        <div className="bg-muted rounded-md w-full aspect-video h-full flex-1">
          Screenshot
        </div>
        <div className="flex gap-4 pl-0 lg:pl-20 flex-col  flex-1">
          <div>
            <Badge>Platform</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-xl md:text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
              Simple, Modern, Fun Interface
            </h2>
            <p className="text-lg max-w-xl lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground text-left">
              Feature: A user-friendly, gamified design makes performance
              tracking feel less like a chore and more like a rewarding process.
              Benefit: Minimize resistance to new tools—your managers and teams
              will adopt and stick with it right away.
            </p>
          </div>
        </div>
      </div>
      {/* Block 6 */}
      <div className="flex flex-col lg:flex-row gap-10 lg:items-center">
        <div className="flex gap-4 flex-col flex-1">
          <div>
            <Badge>Platform</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-xl md:text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
              Role & Goal Alignment
            </h2>
            <p className="text-lg max-w-xl lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground text-left">
              Feature: Tie each person’s daily actions back to key seats and
              overall business objectives. Benefit: See exactly how individual
              contributions propel the company forward, boosting engagement and
              accountability.
            </p>
          </div>
        </div>
        <div className="bg-muted rounded-md w-full aspect-video h-full flex-1"></div>
      </div>
    </div>
  </div>
);
