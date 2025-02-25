import { Check } from "lucide-react";
import { Badge } from "@/components/ui/core/Badge";

export const Problems = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex gap-4 py-20 lg:py-40 flex-col items-start">
        <div>
          <Badge>Platform</Badge>
        </div>
        <div className="flex gap-2 flex-col">
          <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular">
            Managing a team today can feel like a juggling act.
          </h2>
          <p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-muted-foreground">
            You’re expected to keep everyone motivated, aligned with business
            goals, and constantly improving—all without reliable, real-time
            insights. Sound familiar? Here are the most common challenges team
            leaders face, and how our app helps you tackle them head-on.
          </p>
        </div>
        <div className="flex gap-10 pt-12 flex-col w-full">
          <div className="grid grid-cols-2 items-start lg:grid-cols-3 gap-10">
            <div className="flex flex-row gap-6 w-full items-start">
              <Check className="w-4 h-4 mt-2 text-primary" />
              <div className="flex flex-col gap-1">
                <p>Lack of Real-Time Visibility</p>
                <p className="text-muted-foreground text-sm">
                  Problem: Team leaders often rely on gut feelings or outdated
                  data to gauge performance.
                </p>
                <p className="text-muted-foreground text-sm">
                  Solution: Get instant, accurate insights on each team member’s
                  actions and behaviors through a simple real-time scoring
                  system.
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-6 items-start">
              <Check className="w-4 h-4 mt-2 text-primary" />
              <div className="flex flex-col gap-1">
                <p>Tedious, Inconsistent Reviews</p>
                <p className="text-muted-foreground text-sm">
                  Problem: Annual or half-year reviews can feel subjective,
                  time-consuming, and disconnected from day-to-day work.
                </p>
                <p className="text-muted-foreground text-sm">
                  Solution: Streamline performance tracking with quantitative
                  metrics that make evaluations consistent, fast, and
                  transparent.
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-6 items-start">
              <Check className="w-4 h-4 mt-2 text-primary" />
              <div className="flex flex-col gap-1">
                <p>Unclear Team Impact on Business Goals</p>
                <p className="text-muted-foreground text-sm">
                  Problem: Leaders struggle to link individual contributions to
                  overall company objectives.
                </p>
                <p className="text-muted-foreground text-sm">
                  Solution: Map every person’s performance data against key
                  business metrics to see exactly where your team drives impact.
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-6 w-full items-start">
              <Check className="w-4 h-4 mt-2 text-primary" />
              <div className="flex flex-col gap-1">
                <p>Feedback Delays and Surprises</p>
                <p className="text-muted-foreground text-sm">
                  Problem: Team members often receive feedback too late, leading
                  to misalignment and missed opportunities for improvement.
                </p>
                <p className="text-muted-foreground text-sm">
                  Solution: Provide timely, in-app notifications so everyone
                  knows where they stand—and how to improve—long before formal
                  reviews.
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-6 items-start">
              <Check className="w-4 h-4 mt-2 text-primary" />
              <div className="flex flex-col gap-1">
                <p>Hidden Strengths and Weaknesses</p>
                <p className="text-muted-foreground text-sm">
                  Problem: Without objective data, certain talents go unnoticed
                  while blind spots remain hidden.
                </p>
                <p className="text-muted-foreground text-sm">
                  Solution: Use data-driven dashboards to pinpoint each
                  individual’s strengths and weaknesses, helping you place the
                  right people in the right roles.
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-6 items-start">
              <Check className="w-4 h-4 mt-2 text-primary" />
              <div className="flex flex-col gap-1">
                <p>Lack of a Consistent Standard</p>
                <p className="text-muted-foreground text-sm">
                  Problem: Performance comparisons are skewed when leaders don’t
                  measure everyone against the same criteria.
                </p>
                <p className="text-muted-foreground text-sm">
                  Solution: Apply a unified scoring framework that evaluates
                  every team member on equal footing, ensuring fairness and
                  clarity for all.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
