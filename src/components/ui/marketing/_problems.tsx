import { Check } from "lucide-react";
import { Badge } from "@/components/ui/core/Badge";
import { Card } from "@/components/ui/core/Card";

// Problem data array for clean separation of content
const problemList = [
  {
    title: "Lack of Real-Time Visibility",
    problem:
      "Team leaders often rely on gut feelings or outdated data to gauge performance.",
    solution:
      "Get instant, accurate insights on each team member’s actions and behaviors through a simple real-time scoring system.",
  },
  {
    title: "Tedious, Inconsistent Reviews",
    problem:
      "Annual or half-year reviews can feel subjective, time-consuming, and disconnected from day-to-day work.",
    solution:
      "Streamline performance tracking with quantitative metrics that make evaluations consistent, fast, and transparent.",
  },
  {
    title: "Unclear Team Impact on Business Goals",
    problem:
      "Leaders struggle to link individual contributions to overall company objectives.",
    solution:
      "Map every person’s performance data against key business metrics to see exactly where your team drives impact.",
  },
  {
    title: "Feedback Delays and Surprises",
    problem:
      "Team members often receive feedback too late, leading to misalignment and missed opportunities for improvement.",
    solution:
      "Provide timely, in-app notifications so everyone knows where they stand—and how to improve—long before formal reviews.",
  },
  {
    title: "Hidden Strengths and Weaknesses",
    problem:
      "Without objective data, certain talents go unnoticed while blind spots remain hidden.",
    solution:
      "Use data-driven dashboards to pinpoint each individual’s strengths and weaknesses, helping you place the right people in the right roles.",
  },
  {
    title: "Lack of a Consistent Standard",
    problem:
      "Performance comparisons are skewed when leaders don’t measure everyone against the same criteria.",
    solution:
      "Apply a unified scoring framework that evaluates every team member on equal footing, ensuring fairness and clarity for all.",
  },
];

export const Problems = () => (
  <section>
    <div className="section-container">
      <div className="section-header">
        <div>
          <Badge>Every problem has a solution</Badge>
        </div>
        <h2 className="marketing-h1">
          Managing a team today can feel like a juggling act.
        </h2>
        <p className="marketing-body-lg">
          You’re expected to keep everyone motivated, aligned with business
          goals, and constantly improving—all without reliable, real-time
          insights. Sound familiar? Here are the most common challenges team
          leaders face, and how our app helps you tackle them head-on.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {problemList.map((item, index) => (
          <Card key={index} className="flex flex-col items-start p-8 border-0 space-y-6">
            <div className="flex-none bg-muted rounded-xl size-16">
              {/* <Check className="w-4 h-4 text-primary" /> */}
            </div>
            <div className="space-y-4">
              <h3 className="marketing-h4">{item.title}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="marketing-h6 text-foreground">Problem</h4>
                  <p className="marketing-body-sm"> {item.problem} </p>
                </div>
                <div className="space-y-1">
                  <h4 className="marketing-h6 text-foreground">Solution</h4>
                  <p className="marketing-body-sm"> {item.solution} </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </section>
);
