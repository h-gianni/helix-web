import { Badge } from "@/components/ui/core/Badge";

// Features data array for clean separation of content
const features = [
  {
    title: "AI-Driven Analytics",
    feature:
      "Our platform’s AI instantly interprets each scored action to highlight performance patterns and potential red flags.",
    benefit:
      "You don’t have to wait until it’s too late—gain early insights so you can celebrate strengths and address areas of improvement right away.",
    reverse: false,
  },
  {
    title: "Real-Time Team Dashboards",
    feature:
      "Live dashboards give you a bird’s-eye view of everyone’s progress in one place.",
    benefit:
      "Eliminate guesswork with data you can act on at a glance, keeping your entire team aligned and focused.",
    reverse: true,
  },
  {
    title: "Seamless Feedback Loop",
    feature:
      "Built-in notifications and prompts help you share immediate feedback that resonates.",
    benefit:
      "Keep motivation high and course-correct quickly—no more waiting until the next lengthy review cycle.",
    reverse: false,
  },
  {
    title: "Unified Scoring Framework",
    feature:
      "Everyone on the team is measured against the same clear, consistent criteria.",
    benefit:
      "Create a fair, transparent environment that your team trusts and respects.",
    reverse: true,
  },
  {
    title: "Simple, Modern, Fun Interface",
    feature:
      "A user-friendly, gamified design makes performance tracking feel less like a chore and more like a rewarding process.",
    benefit:
      "Minimize resistance to new tools—your managers and teams will adopt and stick with it right away.",
    reverse: false,
  },
  {
    title: "Role & Goal Alignment",
    feature:
      "Tie each person’s daily actions back to key seats and overall business objectives.",
    benefit:
      "See exactly how individual contributions propel the company forward, boosting engagement and accountability.",
    reverse: true,
  },
];

export const Features = () => (
  <section id="features" className="bg-white">
    <div className="section-container">
      <div className="section-header-centered">
        <div>
          <Badge>What you get</Badge>
        </div>
        <h2 className="marketing-h1">Key Features and Benefits</h2>
        <p className="marketing-body-lg">
          You’re expected to keep everyone motivated, aligned with business
          goals, and constantly improving—all without reliable, real-time
          insights. Sound familiar? Here are the most common challenges team
          leaders face, and how our app helps you tackle them head-on.
        </p>
      </div>

      {features.map((feature, index) => (
        <div
          key={index}
          className={`flex flex-col lg:pt-8 ${
            feature.reverse ? "lg:flex-row" : "lg:flex-row-reverse"
          } gap-10 items-center`}
        >
          {/* Image Placeholder */}
          <div className="bg-muted rounded-md w-full aspect-video h-full flex-1">
            
          </div>

          {/* Feature Content */}
          <div className="flex flex-col justify-center gap-6 flex-1 max-w-md px-8 mx-auto">
            <h3 className="marketing-h3">{feature.title}</h3>
              <div className="grid grid-cols-1 gap-4 max-w-xs">
                <div className="space-y-1">
                  <h4 className="marketing-h5">Feature</h4>
                  <p className="marketing-body"> {feature.feature} </p>
                </div>
                <div className="space-y-1">
                  <h4 className="marketing-h5">Benefit</h4>
                  <p className="marketing-body"> {feature.benefit} </p>
                </div>
              </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);
