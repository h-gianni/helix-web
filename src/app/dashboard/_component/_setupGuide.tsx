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
import { Building2, Users, Target, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/core/Dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/core/Select";
import TeamActivitiesConfig from "@/app/dashboard/settings/teams/_components/_teamActivitiesConfig";

interface SetupGuideProps {
  onCreateTeam: () => void;
}

export function SetupGuide({ onCreateTeam }: SetupGuideProps) {
  const router = useRouter();
  const { data: teams = [] } = useTeams();
  const [isTeamActivitiesModalOpen, setIsTeamActivitiesModalOpen] =
    useState(false);
  const {
    currentStep,
    steps,
    isActivityModalOpen,
    toggleActivityModal,
    completeStep,
    completeSetup,
  } = useSetupStore();

  const setupSteps = [
    {
      icon: Building2,
      activeTitle: "1. Configure your Org",
      completedTitle: "Org configured",
      description:
        "These are activites that are important and relevant to your organisation.",
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
        "Create your team and adding team members to it. You can create more than one team.",
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
        "You might have more than one team with different activites because of different responsabilities.",
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

      <Dialog open={isActivityModalOpen} onOpenChange={toggleActivityModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Configure your Organisation</DialogTitle>
          </DialogHeader>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="org-name">Organisation name</Label>
            <Input type="text" id="org-name" placeholder="Name" />
          </div>

          <Select>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select an organization category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Technology</SelectLabel>
                <SelectItem value="software">Software & SaaS</SelectItem>
                <SelectItem value="hardware">Hardware & Electronics</SelectItem>
                <SelectItem value="it-services">
                  IT Services & Consulting
                </SelectItem>
                <SelectItem value="telecom">Telecommunications</SelectItem>
                <SelectItem value="ai-ml">AI & Machine Learning</SelectItem>
              </SelectGroup>

              <SelectGroup>
                <SelectLabel>Healthcare & Life Sciences</SelectLabel>
                <SelectItem value="hospitals">
                  Hospitals & Healthcare Systems
                </SelectItem>
                <SelectItem value="pharmaceuticals">Pharmaceuticals</SelectItem>
                <SelectItem value="biotech">Biotechnology</SelectItem>
                <SelectItem value="medical-devices">Medical Devices</SelectItem>
                <SelectItem value="mental-health">
                  Mental Health & Wellness
                </SelectItem>
              </SelectGroup>

              <SelectGroup>
                <SelectLabel>Financial Services</SelectLabel>
                <SelectItem value="banking">
                  Banking & Financial Institutions
                </SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="fintech">FinTech</SelectItem>
                <SelectItem value="accounting">
                  Accounting & Audit Firms
                </SelectItem>
                <SelectItem value="investment">
                  Investment & Asset Management
                </SelectItem>
              </SelectGroup>

              <SelectGroup>
                <SelectLabel>Education & Research</SelectLabel>
                <SelectItem value="schools">
                  Schools & Educational Institutions
                </SelectItem>
                <SelectItem value="universities">
                  Universities & Colleges
                </SelectItem>
                <SelectItem value="edtech">EdTech Platforms</SelectItem>
                <SelectItem value="research">Research Institutions</SelectItem>
              </SelectGroup>

              <SelectGroup>
                <SelectLabel>Consumer Goods & Retail</SelectLabel>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                <SelectItem value="home-goods">
                  Home Goods & Appliances
                </SelectItem>
              </SelectGroup>

              <SelectGroup>
                <SelectLabel>Manufacturing & Industrial</SelectLabel>
                <SelectItem value="automotive">Automotive</SelectItem>
                <SelectItem value="aerospace">Aerospace & Defense</SelectItem>
                <SelectItem value="construction">
                  Construction & Engineering
                </SelectItem>
                <SelectItem value="energy">Energy & Utilities</SelectItem>
                <SelectItem value="mining">Mining & Metals</SelectItem>
              </SelectGroup>

              <SelectGroup>
                <SelectLabel>Media & Entertainment</SelectLabel>
                <SelectItem value="broadcasting">
                  Broadcasting & Media
                </SelectItem>
                <SelectItem value="gaming">Gaming & Esports</SelectItem>
                <SelectItem value="music">Music & Audio</SelectItem>
                <SelectItem value="publishing">
                  Publishing & Print Media
                </SelectItem>
              </SelectGroup>

              <SelectGroup>
                <SelectLabel>Nonprofit & Government</SelectLabel>
                <SelectItem value="government">Government Agencies</SelectItem>
                <SelectItem value="nonprofit">
                  Nonprofit Organizations
                </SelectItem>
                <SelectItem value="international">
                  International Organizations
                </SelectItem>
                <SelectItem value="advocacy">Advocacy Groups</SelectItem>
              </SelectGroup>

              <SelectGroup>
                <SelectLabel>Professional Services</SelectLabel>
                <SelectItem value="legal">Legal Services</SelectItem>
                <SelectItem value="consulting">Consulting Firms</SelectItem>
                <SelectItem value="recruitment">Recruitment & HR</SelectItem>
                <SelectItem value="real-estate">
                  Real Estate & Property Management
                </SelectItem>
              </SelectGroup>

              <SelectGroup>
                <SelectLabel>Travel, Hospitality & Leisure</SelectLabel>
                <SelectItem value="hotels">Hotels & Resorts</SelectItem>
                <SelectItem value="airlines">
                  Airlines & Transportation
                </SelectItem>
                <SelectItem value="tourism">
                  Tourism & Travel Agencies
                </SelectItem>
                <SelectItem value="sports">Sports & Recreation</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a department function" />
            </SelectTrigger>
            <SelectContent>
              {/* Engineering Department */}
              <SelectGroup>
                <SelectLabel>Engineering</SelectLabel>
                <SelectItem value="frontend">Frontend Development</SelectItem>
                <SelectItem value="backend">Backend Development</SelectItem>
                <SelectItem value="fullstack">
                  Full Stack Development
                </SelectItem>
                <SelectItem value="devops">DevOps & Infrastructure</SelectItem>
                <SelectItem value="qa">Quality Assurance (QA)</SelectItem>
                <SelectItem value="security">Security Engineering</SelectItem>
                <SelectItem value="mobile">Mobile Development</SelectItem>
                <SelectItem value="data">Data Engineering</SelectItem>
                <SelectItem value="ml-ai">Machine Learning / AI</SelectItem>
                <SelectItem value="platform">Platform Engineering</SelectItem>
              </SelectGroup>

              {/* Product & Design */}
              <SelectGroup>
                <SelectLabel>Product & Design</SelectLabel>
                <SelectItem value="product-management">
                  Product Management
                </SelectItem>
                <SelectItem value="ux-ui-design">UX/UI Design</SelectItem>
                <SelectItem value="research">User Research</SelectItem>
                <SelectItem value="design-systems">Design Systems</SelectItem>
                <SelectItem value="product-ops">Product Operations</SelectItem>
              </SelectGroup>

              {/* Sales & Marketing */}
              <SelectGroup>
                <SelectLabel>Sales & Marketing</SelectLabel>
                <SelectItem value="sales">
                  Sales & Business Development
                </SelectItem>
                <SelectItem value="sales-ops">Sales Operations</SelectItem>
                <SelectItem value="partner-sales">
                  Partner & Channel Sales
                </SelectItem>
                <SelectItem value="demand-gen">Demand Generation</SelectItem>
                <SelectItem value="content">Content Marketing</SelectItem>
                <SelectItem value="growth">Growth Marketing</SelectItem>
                <SelectItem value="seo-sem">SEO & SEM</SelectItem>
                <SelectItem value="product-marketing">
                  Product Marketing
                </SelectItem>
                <SelectItem value="brand">Brand & Communications</SelectItem>
              </SelectGroup>

              {/* Customer Success & Support */}
              <SelectGroup>
                <SelectLabel>Customer Success & Support</SelectLabel>
                <SelectItem value="customer-success">
                  Customer Success
                </SelectItem>
                <SelectItem value="account-management">
                  Account Management
                </SelectItem>
                <SelectItem value="support">Customer Support</SelectItem>
                <SelectItem value="implementation">
                  Implementation & Onboarding
                </SelectItem>
                <SelectItem value="training">Training & Enablement</SelectItem>
              </SelectGroup>

              {/* Operations & Finance */}
              <SelectGroup>
                <SelectLabel>Operations & Finance</SelectLabel>
                <SelectItem value="business-ops">
                  Business Operations
                </SelectItem>
                <SelectItem value="finance">Finance & Accounting</SelectItem>
                <SelectItem value="revops">Revenue Operations</SelectItem>
                <SelectItem value="legal">Legal & Compliance</SelectItem>
                <SelectItem value="procurement">Procurement</SelectItem>
              </SelectGroup>

              {/* Human Resources */}
              <SelectGroup>
                <SelectLabel>Human Resources</SelectLabel>
                <SelectItem value="recruiting">
                  Recruiting & Talent Acquisition
                </SelectItem>
                <SelectItem value="hr-ops">HR Operations</SelectItem>
                <SelectItem value="people-partner">
                  People Partner / HRBP
                </SelectItem>
                <SelectItem value="learning-development">
                  Learning & Development
                </SelectItem>
                <SelectItem value="employee-engagement">
                  Employee Engagement
                </SelectItem>
              </SelectGroup>

              {/* Leadership & Strategy */}
              <SelectGroup>
                <SelectLabel>Leadership & Strategy</SelectLabel>
                <SelectItem value="executive">Executive Leadership</SelectItem>
                <SelectItem value="strategy">Corporate Strategy</SelectItem>
                <SelectItem value="chief-of-staff">Chief of Staff</SelectItem>
                <SelectItem value="board-relations">
                  Board & Investor Relations
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="text-center py-6">
            <p className="text-foreground-muted">
              This is a temporary placeholder for adding organization
              activities.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={toggleActivityModal}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                completeStep("addActivities");
                toggleActivityModal();
              }}
            >
              Configure my Organisation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isTeamActivitiesModalOpen}
        onOpenChange={setIsTeamActivitiesModalOpen}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Configure Team Activities</DialogTitle>
          </DialogHeader>

          <TeamActivitiesConfig
            teamId={teams[0]?.id}
            onUpdate={async () => {
              // Additional updates if needed
            }}
          />

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
