import { User } from "lucide-react";
import { Badge } from "@/components/ui/core/Badge";
import { Card } from "@/components/ui/core/Card";
import Image from "next/image";

// Scenarios data array for clean separation of content
const scenarios = [
  {
    title: "Annual Performance Review—No More Subjectivity",
    pain: "Reviews often rely on recent events or personal biases, making them feel unfair or incomplete.",
    solution:
      "Seamlessly track each team member’s behavior and impact throughout the year. Present undeniable, fact-based stats and analyses that highlight who excelled, who needs support, and how your team’s performance measures up across projects.",
    span: 1,
  },
  {
    title: "Addressing Underperformance Early",
    pain: "Leaders wait until official review time to tackle issues, creating stress and missed opportunities for growth.",
    solution:
      "Real-time scoring flags problems as they arise. You can step in with coaching or additional resources sooner—ensuring no one’s falling behind and everyone reaches the annual review better prepared.",
    span: 1,
  },
  // IMAGE INSERTION POINT
  {
    isImage: true,
    imageSrc: "/images/performance-tracking.png", // Update with actual image path
    alt: "Performance Tracking Dashboard",
  },
  {
    isImage: true,
    imageSrc: "/images/team-engagement.png", // Update with actual image path
    alt: "Team Engagement Metrics",
  },
  // CONTINUE WITH SCENARIOS
  {
    title: "Celebrating High Performers with Evidence",
    pain: "Top contributors can feel overlooked when praise is generic or delayed.",
    solution:
      "Showcase hard data and specific metrics that prove success. Recognize standout achievements using quantitative measures that boost morale and reinforce best practices company-wide.",
    span: 1,
  },
  {
    title: "Balanced, Empirical Conversations",
    pain: "Emotions run high during performance discussions; feedback can become personal or reactive.",
    solution:
      "Move from emotionally charged debates to constructive dialogues grounded in facts. Use objective metrics to highlight exact moments of excellence—or where things went off track.",
    span: 1,
  },
  {
    title: "Setting Clear Future Goals",
    pain: "After a review, teams often lack clear targets or measurable standards for the coming months.",
    solution:
      "Leverage historical data and trend lines to set realistic, quantifiable goals that align with your company’s vision. Establish a transparent benchmark for the next review cycle.",
    span: 1,
  },
  {
    title: "Making Data-Driven Layoff Decisions",
    pain: "During layoffs, leadership lacks clear insights on who to retain and who to let go, often leading to subjective or reactive decisions.",
    solution:
      "Gain a data-backed perspective on employee performance and impact. Identify the strongest contributors and ensure layoffs are based on objective insights rather than bias or guesswork, helping to maintain team morale and fairness.",
    span: 1,
  },
  {
    isImage: true,
    imageSrc: "/images/team-engagement.png", // Update with actual image path
    alt: "Team Engagement Metrics",
  },
];

export const Scenarios = () => (
  <section>
    <div className="section-container">
      <div className="section-header">
        <Badge>Where to get value</Badge>
        <div className="space-y-4">
          <h2 className="marketing-h1">
            Usage Scenarios: Transforming Performance Reviews
          </h2>
          <p className="marketing-body-lg">
            Picture this: You walk into your annual performance review meeting,
            and instead of sorting through vague recollections or scrambling to
            remember each team member’s wins and missteps, you open a clear,
            data-rich dashboard. Every score your team earned over the year is
            there—easy to reference, backed by real evidence of their actions
            and contributions.
          </p>
        </div>
      </div>

      {/* Scenarios Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
        {scenarios.map((scenario, index) =>
          scenario.isImage ? (
            // IMAGE DIVS AFTER SECOND SCENARIO
            <div key={index} className="hidden lg:block relative w-full rounded-md overflow-hidden bg-muted items-stretch">
              <Image
                src={scenario.imageSrc}
                alt={scenario.alt}
                layout="fill"
                objectFit="cover"
                className="rounded-md "
              />
            </div>
          ) : (
            // SCENARIO CARDS
            <Card
              key={index}
              className={`bg-white border-0 rounded-md p-4 pb-6 lg:pb-0 lg:p-6 lg:aspect-auto flex justify-between flex-col ${
                scenario.span === 2 ? "lg:col-span-2" : ""
              }`}
            >
              {/* <User className="w-8 h-8 stroke-1" /> */}
              <div>
                <Badge variant="secondary">Scenario {index + 1}</Badge>
              </div>

              <div className="flex flex-col gap-4 lg:gap-6 flex-1">
                <h3 className="marketing-h4">{scenario.title}</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <h4 className="marketing-h6 text-foreground">Pain</h4>
                    <p className="marketing-body-sm"> {scenario.pain} </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="marketing-h6 text-foreground">
                      With UpScore
                    </h4>
                    <p className="marketing-body-sm"> {scenario.solution} </p>
                  </div>
                </div>
              </div>
            </Card>
          )
        )}
      </div>
    </div>
  </section>
);
