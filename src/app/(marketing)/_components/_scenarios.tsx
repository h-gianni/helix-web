import { User } from "lucide-react";
import { Badge } from "@/components/ui/core/Badge";

export const Scenarios = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex gap-4 flex-col items-start">
          <div>
            <Badge>Platform</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
              Usage Scenarios: Transforming Performance Reviews
            </h2>
            <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground  text-left">
              Picture this: You walk into your annual performance review
              meeting, and instead of sorting through vague recollections or
              scrambling to remember each team member’s wins and missteps, you
              open a clear, data-rich dashboard. Every score your team earned
              over the year is there—easy to reference, backed by real evidence
              of their actions and contributions.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-muted rounded-md h-full lg:col-span-2 p-6 aspect-square lg:aspect-auto flex justify-between flex-col">
            <User className="w-8 h-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">
                Scenario 1: Annual Performance Review—No More Subjectivity
              </h3>
              <p className="text-muted-foreground max-w-xs text-base">
                Traditional Pain: Reviews often rely on recent events or
                personal biases, making them feel unfair or incomplete. With Our
                App: Seamlessly track each team member’s behavior and impact
                throughout the year. Present undeniable, fact-based stats and
                analyses that highlight who excelled, who needs support, and how
                your team’s performance measures up across projects.
              </p>
            </div>
          </div>
          <div className="bg-muted rounded-md  aspect-square p-6 flex justify-between flex-col">
            <User className="w-8 h-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">
                Scenario 2: Addressing Underperformance Earlys
              </h3>
              <p className="text-muted-foreground max-w-xs text-base">
                Traditional Pain: Leaders wait until official review time to
                tackle issues, creating stress and missed opportunities for
                growth. With Our App: Real-time scoring flags problems as they
                arise. You can step in with coaching or additional resources
                sooner—ensuring no one’s falling behind and everyone reaches the
                annual review better prepared.
              </p>
            </div>
          </div>

          <div className="bg-muted rounded-md aspect-square p-6 flex justify-between flex-col">
            <User className="w-8 h-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">
                Scenario 3: Celebrating High Performers with Evidence
              </h3>
              <p className="text-muted-foreground max-w-xs text-base">
                Traditional Pain: Top contributors can feel overlooked when
                praise is generic or delayed. With Our App: Showcase hard data
                and specific metrics that prove success. Recognize standout
                achievements using quantitative measures that boost morale and
                reinforce best practices company-wide.
              </p>
            </div>
          </div>
          <div className="bg-muted rounded-md h-full lg:col-span-2 p-6 aspect-square lg:aspect-auto flex justify-between flex-col">
            <User className="w-8 h-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">
                Scenario 4: Balanced, Empirical Conversations
              </h3>
              <p className="text-muted-foreground max-w-xs text-base">
                Traditional Pain: Emotions run high during performance
                discussions; feedback can become personal or reactive. With Our
                App: Move from emotionally charged debates to constructive
                dialogues grounded in facts. Use objective metrics to highlight
                exact moments of excellence—or where things went off track.
              </p>
            </div>
          </div>
          <div className="bg-muted rounded-md h-full lg:col-span-2 p-6 aspect-square lg:aspect-auto flex justify-between flex-col">
            <User className="w-8 h-8 stroke-1" />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">
                Scenario 5: Setting Clear Future Goals
              </h3>
              <p className="text-muted-foreground max-w-xs text-base">
                Traditional Pain: After a review, teams often lack clear targets
                or measurable standards for the coming months. With Our App:
                Leverage historical data and trend lines to set realistic,
                quantifiable goals that align with your company’s vision.
                Establish a transparent benchmark for the next review cycle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
