"use client";

import { useState } from "react";
import { useTeams } from "@/store/team-store";
import { useRouter } from "next/navigation";
import { useSetupStore } from "@/store/setup-store";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/core/Card";
import { Button } from "@/components/ui/core/Button";
import { Input } from "@/components/ui/core/Input";
import { Label } from "@/components/ui/core/Label";
import { Badge } from "@/components/ui/core/Badge";
import {
  Building2,
  Users,
  Target,
  Check,
  SquareCheckBig,
  Square,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/core/Dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/core/Radio-group";
import { Separator } from "@/components/ui/core/Separator";
import { Switch } from "@/components/ui/core/Switch";

interface SetupGuideProps {
  onCreateTeam: () => void;
}

const activityCategories = {
  general: [
    { key: "leadership", label: "Leadership" },
    { key: "teamwork", label: "Teamwork" },
    { key: "team-management", label: "Team Management" },
    { key: "cultural-behaviours", label: "Cultural Behaviours & Values" },
  ],
  core: [
    { key: "engineering", label: "Engineering" },
    { key: "product", label: "Product" },
    { key: "design", label: "Design & UX" },
    { key: "marketing", label: "Marketing" },
    { key: "data-analytics", label: "Data & Analytics" },
    { key: "customer-success", label: "Customer Success & Support" },
    { key: "finance", label: "Finance" },
    { key: "human-resources", label: "Human Resources" },
    { key: "it-security", label: "IT & Security" },
    { key: "research", label: "Research" },
  ],
};

// Activity data by category
const activityData: Record<string, string[]> = {
  engineering: [
    "Wrote clean, scalable, and maintainable code that met project requirements.",
    "Reviewed pull requests for code quality, adherence to standards, and functionality.",
    "Troubleshot and resolved bugs, ensuring minimal disruption to users.",
    "Participated in daily standups and sprint planning meetings.",
    "Mentored junior developers and facilitated knowledge sharing.",
    "Managed CI/CD pipelines and deployment workflows.",
    "Documented technical designs and project implementations.",
    "Collaborated with product and design teams to deliver features.",
    "Conducted code refactoring to improve performance and readability.",
    "Addressed security vulnerabilities through regular code reviews.",
  ],

  product: [
    "Defined and prioritized product features based on customer needs.",
    "Collaborated with design and engineering teams to deliver product requirements.",
    "Conducted user interviews and collected feedback for improvements.",
    "Created and managed product roadmaps and timelines.",
    "Monitored product performance using KPIs and analytics.",
    "Facilitated cross-functional alignment through product workshops.",
    "Conducted competitor analysis to identify market opportunities.",
    "Wrote user stories and acceptance criteria for engineering teams.",
    "Handled stakeholder communication and product updates.",
    "Launched product features and monitored post-launch performance.",
  ],

  design: [
    "Created user-centered designs for web and mobile applications.",
    "Developed wireframes, mockups, and interactive prototypes.",
    "Conducted user research and usability testing.",
    "Collaborated with product managers to define design requirements.",
    "Ensured consistency across design systems and components.",
    "Presented design concepts to stakeholders for feedback.",
    "Delivered design assets to developers with clear documentation.",
    "Analyzed user behavior to inform design decisions.",
    "Ensured designs met accessibility standards (WCAG).",
    "Reviewed post-launch designs for improvements.",
  ],

  marketing: [
    "Created and executed marketing campaigns across digital channels.",
    "Managed SEO and SEM strategies to drive organic traffic.",
    "Analyzed campaign performance and optimized for ROI.",
    "Collaborated with designers for creative content development.",
    "Generated marketing reports and presented findings to stakeholders.",
    "Managed social media calendars and content schedules.",
    "Monitored brand mentions and audience sentiment.",
    "Developed email marketing workflows for lead nurturing.",
    "Created content for blogs, whitepapers, and case studies.",
    "Coordinated with sales teams for lead handoff and follow-ups.",
  ],

  "data-analytics": [
    "Collected, cleaned, and analyzed datasets for insights.",
    "Created dashboards and reports for business stakeholders.",
    "Conducted A/B testing and interpreted results.",
    "Monitored data pipelines and ensured data integrity.",
    "Prepared presentations summarizing key findings and recommendations.",
    "Automated recurring reports using business intelligence tools.",
    "Performed cohort and retention analysis for product insights.",
    "Built predictive models to forecast business trends.",
    "Collaborated with teams to define data requirements.",
    "Ensured data privacy and compliance with regulations.",
  ],

  leadership: [
    "Set clear goals and expectations for team members.",
    "Led cross-functional meetings and strategic planning sessions.",
    "Monitored progress toward company OKRs and adjusted plans as needed.",
    "Provided regular performance feedback to team members.",
    "Represented the company in external meetings and industry events.",
    "Championed diversity, equity, and inclusion initiatives.",
    "Addressed team conflicts with empathy and professionalism.",
    "Promoted employee well-being and work-life balance.",
    "Evaluated team performance and recommended promotions.",
    "Made data-driven decisions to guide business direction.",
  ],

  "customer-success": [
    "Onboarded new customers and guided them through product setup.",
    "Conducted regular check-ins to ensure customer satisfaction.",
    "Responded to customer inquiries through tickets, chat, and email.",
    "Troubleshot product issues and escalated when necessary.",
    "Documented common solutions in the knowledge base.",
    "Monitored customer health scores and engagement metrics.",
    "Advocated for customers by sharing feedback with product teams.",
    "Managed renewals and identified upsell opportunities.",
    "Conducted product training and webinars for users.",
    "Tracked customer satisfaction scores (NPS, CSAT).",
  ],

  finance: [
    "Tracked company expenses and revenue daily.",
    "Prepared and distributed financial reports.",
    "Processed invoices, payments, and reimbursements.",
    "Conducted budget variance analysis.",
    "Managed payroll and benefits disbursement.",
    "Updated forecasts and financial models.",
    "Ensured tax filings and regulatory compliance.",
    "Reconciled bank transactions regularly.",
    "Collaborated with RevOps for revenue tracking.",
    "Supported audits and internal controls.",
  ],

  "human-resources": [
    "Posted job openings and managed applicant pipelines.",
    "Screened resumes and conducted initial interviews.",
    "Coordinated onboarding for new hires.",
    "Managed payroll, benefits, and compensation.",
    "Handled employee relations and conflict resolution.",
    "Ran performance review cycles.",
    "Organized training and development programs.",
    "Tracked employee engagement and retention.",
    "Ensured compliance with labor laws and policies.",
    "Facilitated exit interviews and offboarding processes.",
  ],

  "it-security": [
    "Provided IT support for employees and systems.",
    "Monitored cybersecurity threats and alerts.",
    "Implemented security updates and patches.",
    "Ensured network uptime and reliability.",
    "Managed system access and user permissions.",
    "Conducted regular vulnerability scans and risk assessments.",
    "Maintained IT documentation and policies.",
    "Responded to technical issues and troubleshooting requests.",
    "Managed hardware and software inventory.",
    "Ensured compliance with data privacy regulations.",
  ],

  research: [
    "Planned and conducted user interviews and surveys.",
    "Wrote discussion guides and research plans.",
    "Ran usability testing and analyzed findings.",
    "Collected and synthesized customer feedback.",
    "Conducted competitive analysis and benchmarking.",
    "Prepared research reports and summaries.",
    "Organized findings in research repositories.",
    "Collaborated with product and design teams.",
    "Conducted field studies and diary studies.",
    "Validated new product ideas through user testing.",
  ],

  "team-management": [
    "Set clear expectations and goals for team members.",
    "Conducted regular one-on-one meetings.",
    "Provided ongoing coaching and mentorship.",
    "Monitored individual and team performance metrics.",
    "Delivered timely, constructive feedback.",
    "Facilitated team-building activities and collaboration.",
    "Ensured fair workload distribution and task delegation.",
    "Addressed team conflicts with empathy and professionalism.",
    "Supported career development and growth opportunities.",
    "Conducted performance reviews and appraisals.",
  ],

  "cultural-behaviours": [
    "Demonstrated integrity and ethical decision-making.",
    "Upheld company values in daily interactions.",
    "Fostered an inclusive and respectful workplace.",
    "Encouraged collaboration and teamwork across departments.",
    "Promoted a growth mindset and continuous improvement.",
    "Provided constructive feedback and accepted it gracefully.",
    "Addressed conflicts openly and professionally.",
    "Advocated for diversity, equity, and inclusion initiatives.",
    "Celebrated team successes and individual contributions.",
    "Promoted positive workplace behaviors and practices.",
  ],

  teamwork: [
    "Collaborated effectively with cross-functional teams to achieve project goals.",
    "Contributed to team brainstorming sessions and shared innovative ideas.",
    "Supported team members in completing tasks and overcoming challenges.",
    "Communicated clearly and respectfully within the team.",
    "Promoted knowledge sharing through documentation and presentations.",
    "Fostered a positive and inclusive team culture.",
    "Provided constructive feedback to peers and accepted feedback gracefully.",
    "Assisted with onboarding new team members.",
    "Facilitated team meetings and project check-ins.",
    "Adapted to changing team priorities and supported shifting workloads.",
  ],
};

const OrganizationCategories = ({
  onSelect,
  selectedActivities,
}: {
  onSelect: (category: string) => void;
  selectedActivities: string[];
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "engineering"
  );

  const handleSelect = (key: string) => {
    setSelectedCategory(key);
    onSelect(key);
  };

  // Count selected activities per category
  const getSelectedCount = (categoryKey: string) => {
    return selectedActivities.filter((activity) =>
      activityData[categoryKey]?.includes(activity)
    ).length;
  };

  const CategoryItem = ({
    categoryKey,
    label,
  }: {
    categoryKey: string;
    label: string;
  }) => {
    const count = getSelectedCount(categoryKey);

    return (
      <li
        className={`text-base border-l border-border cursor-pointer px-3 py-2 hover:bg-muted flex justify-between items-center ${
          selectedCategory === categoryKey ? "bg-primary/10" : ""
        }`}
        onClick={() => handleSelect(categoryKey)}
      >
        <span>{label}</span>
        {count > 0 && (
          <Badge variant="default" className="flex items-center gap-1">
            <Check className="h-3 w-3" />
            <span>{count}</span>
          </Badge>
        )}
      </li>
    );
  };

  return (
    <div className="space-y-4">
      {/* Leadership & Values Categories */}
      <div>
        <h3 className="text-sm font-semibold text-foreground-muted mb-2">
          Leadership & Values
        </h3>
        <ul className="space-y-0">
          {activityCategories.general.map(({ key, label }) => (
            <CategoryItem key={key} categoryKey={key} label={label} />
          ))}
        </ul>
      </div>

      {/* Core Categories */}
      <div>
        <h3 className="text-sm font-semibold text-foreground-muted mb-2">
          Core Functions
        </h3>
        <ul className="space-y-0">
          {activityCategories.core.map(({ key, label }) => (
            <CategoryItem key={key} categoryKey={key} label={label} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export function SetupGuide({ onCreateTeam }: SetupGuideProps) {
  const router = useRouter();
  const { data: teams = [] } = useTeams();
  const [isTeamActivitiesModalOpen, setIsTeamActivitiesModalOpen] =
    useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("engineering");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const {
    currentStep,
    steps,
    isActivityModalOpen,
    toggleActivityModal,
    completeStep,
    completeSetup,
  } = useSetupStore();

  const toggleActivity = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((item) => item !== activity)
        : [...prev, activity]
    );
  };

  const setupSteps = [
    {
      icon: Building2,
      activeTitle: "1. Configure your Org",
      completedTitle: "Org configured",
      description:
        "These are activities that are important and relevant to your organisation.",
      time: "Est. 1-5 min",
      activeAction: "Configure your Org",
      completedAction: "Org settings",
      onClick: () => toggleActivityModal(),
      completedClick: () =>
        router.push("/dashboard/settings/business-activities"),
      isActive: currentStep === 1,
      isCompleted: steps.addActivities,
    },
    {
      icon: Users,
      activeTitle: "2. Create a Team",
      completedTitle: "Team added",
      description:
        "Create your team and add team members to it. You can create more than one team.",
      time: "Est. 15 sec",
      activeAction: "Create a team",
      completedAction: "Go to Teams",
      onClick: onCreateTeam,
      completedClick: () => router.push("/dashboard/teams"),
      isActive: currentStep === 2,
      isCompleted: steps.createTeam,
    },
    {
      icon: Target,
      activeTitle: "3. Configure your team",
      completedTitle: "Team configured",
      description:
        "You might have more than one team with different activities because of different responsibilities.",
      time: "Est. 10 to 45 sec",
      activeAction: "Configure your team",
      completedAction: "Go to Team settings",
      onClick: () => setIsTeamActivitiesModalOpen(true),
      completedClick: () => router.push("/dashboard/settings/teams"),
      isActive: currentStep === 3,
      isCompleted: steps.configureTeamActivities,
    },
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {setupSteps.map((step) => (
          <Card
            key={step.activeTitle}
            className={cn(step.isActive && "ring-2 ring-primary shadow-lg")}
          >
            <CardContent>
              <div className="flex flex-col h-full gap-4 p-4">
                <div className="flex justify-between items-start gap-8">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      step.isCompleted ? "bg-success" : "bg-primary/10"
                    )}
                  >
                    {step.isCompleted ? (
                      <Check className="h-5 w-5 text-success-foreground" />
                    ) : (
                      <step.icon className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <Badge
                    variant="secondary"
                    className={step.isCompleted ? "opacity-50" : "opacity-100"}
                  >
                    {step.isCompleted ? "Completed" : step.time}
                  </Badge>
                </div>

                <div className="flex-1 text-left space-y-1.5">
                  <h3 className="heading-3">
                    {step.isCompleted ? step.completedTitle : step.activeTitle}
                  </h3>
                  <p className="body-sm text-foreground-weak">
                    {step.description}
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <Button
                    variant={step.isCompleted ? "outline" : "default"}
                    onClick={
                      step.isCompleted ? step.completedClick : step.onClick
                    }
                    disabled={!step.isActive && !step.isCompleted}
                    className="w-full"
                  >
                    {step.isCompleted
                      ? step.completedAction
                      : step.activeAction}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Organization Configuration Dialog */}
      <Dialog open={isActivityModalOpen} onOpenChange={toggleActivityModal}>
        <DialogContent className="max-w-4xl" scrollable>
          <DialogHeader className="p-6 border-b">
            <DialogTitle>
              <span className="heading-2">Configure your Organisation</span>
            </DialogTitle>
          </DialogHeader>

          <DialogBody className="space-y-8">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="org-name">Organisation name</Label>
              <Input type="text" id="org-name" placeholder="Name" />
            </div>

            <div className="space-y-1">
              <h3 className="heading-3">
                Build your organisation activities list
              </h3>
              <p className="caption">
                Select the activities that you will score your team's
                performance against.
              </p>
            </div>

            <div className="flex items-start gap-12">
              {/* Category Selection */}
              <div className="min-w-56 space-y-4">
                <h4 className="heading-5">Categories</h4>
                <OrganizationCategories
                  onSelect={setSelectedCategory}
                  selectedActivities={selectedActivities}
                />
              </div>

              {/* Activities Display */}
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="heading-5">Activities</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground-muted">
                      Select all
                    </span>
                    <Switch
                      checked={
                        activityData[selectedCategory]?.length > 0 &&
                        activityData[selectedCategory]?.every((activity) =>
                          selectedActivities.includes(activity)
                        )
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          // Add all activities from this category
                          const activitiesToAdd =
                            activityData[selectedCategory]?.filter(
                              (activity) =>
                                !selectedActivities.includes(activity)
                            ) || [];
                          setSelectedActivities((prev) => [
                            ...prev,
                            ...activitiesToAdd,
                          ]);
                        } else {
                          // Remove all activities from this category
                          setSelectedActivities((prev) =>
                            prev.filter(
                              (activity) =>
                                !activityData[selectedCategory]?.includes(
                                  activity
                                )
                            )
                          );
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="w-full -space-y-px">
                  {activityData[selectedCategory]?.map((activity) => (
                    <div
                      key={activity}
                      className={cn(
                        "flex items-center gap-4 bg-white border px-4 py-3 cursor-pointer hover:border-border-strong hover:bg-background",
                        selectedActivities.includes(activity)
                          ? "bg-primary/10 text-foreground-strong"
                          : "border-border"
                      )}
                      onClick={() => toggleActivity(activity)}
                    >
                      <div className="size-4">
                        {selectedActivities.includes(activity) ? (
                          <SquareCheckBig className="text-primary w-4 h-4" />
                        ) : (
                          <Square className="text-foreground/25 w-4 h-4" />
                        )}
                      </div>
                      <span className="text-base text-foreground-weak">
                        {activity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogBody>

          <DialogFooter className="p-6 border-t">
            <Button variant="outline" onClick={toggleActivityModal}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                console.log("Selected Activities:", selectedActivities);
                completeStep("addActivities");
                toggleActivityModal();
              }}
            >
              Configure my Organisation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Team Activities Configuration Dialog */}
      <Dialog
        open={isTeamActivitiesModalOpen}
        onOpenChange={setIsTeamActivitiesModalOpen}
      >
        <DialogContent className="max-w-4xl" scrollable>
          <DialogHeader className="p-6 border-b">
            <DialogTitle>Configure Team Activities</DialogTitle>
          </DialogHeader>

          <DialogBody className="space-y-4">
            <h3 className="heading-3">Select activities for your team:</h3>
            {selectedActivities.map((activity) => (
              <div
                key={activity}
                className="flex items-center gap-4 border px-4 py-2 rounded"
              >
                <span>{activity}</span>
                <Check className="text-success w-4 h-4" />
              </div>
            ))}
          </DialogBody>

          <DialogFooter className="p-6 border-t">
            <Button
              variant="outline"
              onClick={() => setIsTeamActivitiesModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                completeStep("configureTeamActivities");
                completeSetup();
                setIsTeamActivitiesModalOpen(false);
              }}
            >
              Update team settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Team Activities Configuration Dialog */}
      <Dialog
        open={isTeamActivitiesModalOpen}
        onOpenChange={setIsTeamActivitiesModalOpen}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Configure Team Activities</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <h3 className="heading-3">Select activities for your team:</h3>
            {selectedActivities.map((activity) => (
              <div
                key={activity}
                className="flex items-center gap-4 border px-4 py-2 rounded"
              >
                <span>{activity}</span>
                <Check className="text-success w-4 h-4" />
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTeamActivitiesModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                completeStep("configureTeamActivities");
                completeSetup();
                setIsTeamActivitiesModalOpen(false);
              }}
            >
              Update team settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
