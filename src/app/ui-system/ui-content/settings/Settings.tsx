"use client";

import React, { useState } from "react";
import {
  Users,
  Award,
  Target,
  BarChart3,
  CheckSquare,
  AlertCircle,
  PenSquare,
  FileText,
  User,
  Mail,
  Briefcase,
  Building,
  ClipboardCheck,
  Pen,
  ChevronRight,
  Heart,
  Bell,
  Settings,
} from "lucide-react";

// Core UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/core/Card";
import { Separator } from "@/components/ui/core/Separator";
import { Button } from "@/components/ui/core/Button";
import { Badge } from "@/components/ui/core/Badge";
import { Switch } from "@/components/ui/core/Switch";
import { Avatar, AvatarFallback } from "@/components/ui/core/Avatar";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { Label } from "@/components/ui/core/Label";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/core/Table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/core/Accordion";
import { HeroBadge } from "@/components/ui/core/HeroBadge";

// Profile Components
import { ProfileCard } from "@/components/ui/composite/ProfileCard";

const SettingsShowcase = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailDigestEnabled, setEmailDigestEnabled] = useState(true);
  const [activityAlertsEnabled, setActivityAlertsEnabled] = useState(true);
  const [reviewNotificationsEnabled, setReviewNotificationsEnabled] =
    useState(true);

  // Sample data for teams
  const teams = [
    {
      id: "team-1",
      name: "Engineering Team",
      function: "Engineering",
      memberCount: 12,
    },
    {
      id: "team-2",
      name: "Marketing Team",
      function: "Marketing",
      memberCount: 8,
    },
    { id: "team-3", name: "Design Team", function: "Design", memberCount: 6 },
  ];

  // Sample data for action categories
  const actionCategories = [
    {
      id: "cat-1",
      name: "Developer Experience",
      selected: 3,
      actions: [
        {
          id: "act-1",
          name: "Code Reviews",
          isFavorite: true,
          isSelected: true,
        },
        {
          id: "act-2",
          name: "Technical Documentation",
          isFavorite: false,
          isSelected: true,
        },
        {
          id: "act-3",
          name: "Developer Onboarding",
          isFavorite: false,
          isSelected: true,
        },
        {
          id: "act-4",
          name: "Technical Debt Management",
          isFavorite: false,
          isSelected: false,
        },
      ],
    },
    {
      id: "cat-2",
      name: "Collaboration",
      selected: 4,
      actions: [
        {
          id: "act-5",
          name: "Cross-team Cooperation",
          isFavorite: true,
          isSelected: true,
        },
        {
          id: "act-6",
          name: "Meeting Effectiveness",
          isFavorite: false,
          isSelected: true,
        },
        {
          id: "act-7",
          name: "Knowledge Sharing",
          isFavorite: true,
          isSelected: true,
        },
        {
          id: "act-8",
          name: "Constructive Feedback",
          isFavorite: false,
          isSelected: true,
        },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <ProfileCard
        align="horizontal"
        imageUrl="/api/placeholder/96/96"
        fields={[
          {
            label: "Full Name",
            value: "John Doe",
            variant: "title",
          },
          {
            label: "Email (account ID)",
            value: "john.doe@example.com",
            variant: "strong",
          },
          {
            label: "Job Title",
            value: "Senior Developer",
          },
        ]}
        onEdit={() => console.log("Edit profile clicked")}
        editButtonPosition="topRight"
        editButtonText="Edit"
      />

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <CardTitle>
            <div className="flex-shrink-0 mb-2 mt-1">
              <HeroBadge icon={Users} />
            </div>
            My Teams
          </CardTitle>
          <Button
            variant="ghost"
            onClick={() => console.log("Edit teams clicked")}
          >
            <Pen />
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team name</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Function</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-semibold">{team.name}</TableCell>
                  <TableCell>
                    <span className="text-foreground-weak">
                      {team.memberCount} members
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="info-light">{team.function}</Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <CardTitle>
            <div className="flex-shrink-0 mb-2 mt-1">
              <HeroBadge icon={CheckSquare} />
            </div>
            Actions
          </CardTitle>
          <Button
            variant="ghost"
            onClick={() => console.log("Edit actions clicked")}
          >
            <Pen />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Function actions */}
              <div className="lg:w-1/2 space-y-4">
                <div>
                  <h4 className="heading-4">Functions</h4>
                  <p className="body-sm">
                    Select your function and the actions that you expect your
                    team to perform. You can mix actions from different
                    functions.
                  </p>
                </div>
                <Accordion
                  type="multiple"
                  className="w-full bg-white shadow-sm rounded-md"
                  defaultValue={["cat-1"]}
                >
                  {actionCategories.map((category) => (
                    <AccordionItem key={category.id} value={category.id}>
                      <AccordionTrigger className="px-4 lg:h-12 cursor-pointer decoration-current">
                        <div className="flex justify-between items-center w-full">
                          <span>{category.name}</span>
                          {category.selected > 0 && (
                            <Badge variant="default" className="mr-2">
                              {category.selected}
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 pb-2">
                            <Switch checked={category.selected > 0} />
                            <span className="text-sm text-foreground-weak">
                              Select all
                            </span>
                          </div>
                          <div className="w-full -space-y-px">
                            {category.actions.map((action) => (
                              <div
                                key={action.id}
                                className={`flex items-center gap-4 bg-white border px-4 py-3 cursor-pointer hover:bg-background ${
                                  action.isSelected
                                    ? "border-border bg-primary/10 text-foreground"
                                    : "border-border"
                                }`}
                              >
                                <div className="size-4">
                                  {action.isSelected ? (
                                    <CheckSquare className="text-primary size-4" />
                                  ) : (
                                    <div className="border border-border-weak size-4 rounded-sm"></div>
                                  )}
                                </div>
                                <span className="text-base flex-1">
                                  {action.name}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`p-1 h-7 w-7 ${
                                    action.isFavorite
                                      ? "text-primary hover:text-primary/80"
                                      : "text-neutral-200 hover:text-neutral-300"
                                  }`}
                                >
                                  <Heart
                                    className={`size-4 ${
                                      action.isFavorite ? "fill-current" : ""
                                    }`}
                                  />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
              <div className="lg:w-1/2 space-y-4">
                <div>
                  <h4 className="heading-4">Global</h4>
                  <p className="body-sm">
                    Measure the performance of your team against what is
                    valuable in your organisation, beyond your function.{" "}
                    <span className="text-warning-darker">
                      At least 3 actions per category must be selected.
                    </span>
                  </p>
                </div>
                <Accordion
                  type="multiple"
                  className="w-full bg-white shadow-sm rounded-md"
                  defaultValue={["cat-2"]}
                >
                  {actionCategories.map((category) => (
                    <AccordionItem
                      key={`global-${category.id}`}
                      value={category.id}
                    >
                      <AccordionTrigger className="px-4 lg:h-12 cursor-pointer decoration-current">
                        <div className="flex justify-between items-center w-full">
                          <span>{category.name}</span>
                          {category.selected > 0 && (
                            <Badge variant="default" className="mr-2">
                              {category.selected}
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 pb-2">
                            <Switch checked={category.selected > 0} />
                            <span className="text-sm text-foreground-weak">
                              Select all
                            </span>
                          </div>
                          <div className="w-full -space-y-px">
                            {category.actions.map((action) => (
                              <div
                                key={`global-${action.id}`}
                                className={`flex items-center gap-4 bg-white border border-border px-4 py-3 cursor-pointer hover:bg-background ${
                                  action.isSelected
                                    ? "bg-primary/10 text-foreground"
                                    : "border-border"
                                }`}
                              >
                                <div className="size-4">
                                  {action.isSelected ? (
                                    <CheckSquare className="text-primary size-4" />
                                  ) : (
                                    <div className="border border-border-weak size-4 rounded-sm"></div>
                                  )}
                                </div>
                                <span className="text-base flex-1">
                                  {action.name}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`p-1 h-7 w-7 ${
                                    action.isFavorite
                                      ? "text-primary hover:text-primary/80"
                                      : "text-neutral-200 hover:text-neutral-300"
                                  }`}
                                >
                                  <Heart
                                    className={`size-4 ${
                                      action.isFavorite ? "fill-current" : ""
                                    }`}
                                  />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex-shrink-0 mb-2 mt-1">
              <HeroBadge icon={Bell} />
            </div>
            Notifications
          </CardTitle>
          <CardDescription>
            Control how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="body-sm text-foreground-weak">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Email Digest</Label>
                <p className="body-sm text-foreground-weak">
                  Receive a weekly summary of all team activities
                </p>
              </div>
              <Switch
                checked={emailDigestEnabled}
                onCheckedChange={setEmailDigestEnabled}
              />
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Business Action Alerts</Label>
                <p className="body-sm text-foreground-weak">
                  Get notified when team actions are updated or completed
                </p>
              </div>
              <Switch
                checked={activityAlertsEnabled}
                onCheckedChange={setActivityAlertsEnabled}
              />
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Performance Review Notifications</Label>
                <p className="body-sm text-foreground-weak">
                  Get notifications about upcoming and completed reviews
                </p>
              </div>
              <Switch
                checked={reviewNotificationsEnabled}
                onCheckedChange={setReviewNotificationsEnabled}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex-shrink-0 mb-2 mt-1">
              <HeroBadge icon={Settings} />
            </div>
            Account Settings
          </CardTitle>
          <CardDescription>
            Manage your account settings and subscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="heading-4">Subscription</h3>
              <div className="flex items-center justify-between bg-neutral-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm font-medium">
                    Current Plan: <span className="text-primary">Premium</span>
                  </p>
                  <p className="text-xs text-foreground-weak">
                    Next billing date: May 15, 2025
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Manage Plan
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="heading-4">Connected Services</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HeroBadge icon={FileText} size="sm" />
                    <div>
                      <p className="text-sm font-medium">Google Workspace</p>
                      <p className="text-xs text-foreground-weak">
                        Connected on April 2, 2025
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Disconnect
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HeroBadge icon={FileText} size="sm" />
                    <div>
                      <p className="text-sm font-medium">Microsoft Teams</p>
                      <p className="text-xs text-foreground-weak">
                        Connected on April 5, 2025
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Disconnect
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="heading-4">Danger Zone</h3>
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>
                  Deleting your account will remove all data associated with
                  your profile. This action cannot be undone.
                </AlertDescription>
              </Alert>
              <div className="pt-2">
                <Button variant="destructive">Delete Account</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsShowcase;
