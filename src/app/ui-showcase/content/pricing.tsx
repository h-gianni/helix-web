"use client";

import React, { useState } from "react";
import { Check, Calendar as CalendarIcon } from "lucide-react";

// Core UI Components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/core/Accordion";
import { Badge } from "@/components/ui/core/Badge";
import { Button } from "@/components/ui/core/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/Card";
import { Separator } from "@/components/ui/core/Separator";

const PricingExample = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const priorityColors = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const statusColors = {
    todo: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    "in-progress":
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    done: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  };

  return (
    <div className="mt-8 space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="display-1">Simple, Transparent Pricing</h2>
        <p className="body-lg text-muted-foreground mt-4">
          Choose the plan that&apos;s right for you and start building amazing
          projects
        </p>
      </div>

      <div className="flex justify-center flex-wrap gap-4 py-6">
        <Button
          variant={activeTab === "monthly" ? "default" : "outline"}
          onClick={() => setActiveTab("monthly")}
        >
          Monthly
        </Button>
        <Button
          variant={activeTab === "annual" ? "default" : "outline"}
          onClick={() => setActiveTab("annual")}
        >
          Annual{" "}
          <Badge variant="secondary" className="ml-2">
            Save 20%
          </Badge>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>
              For individuals just getting started
            </CardDescription>
            <div className="mt-4">
              <span className="display-2">$0</span>
              <span className="text-foreground ml-1">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" variant="outline">
              Get Started
            </Button>
            <Separator />
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>Up to 3 projects</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>Basic analytics</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>48-hour support response time</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>Community access</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="border-primary relative">
          <div className="absolute top-0 right-0 translate-x-2 -translate-y-2">
            <Badge>Popular</Badge>
          </div>
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <CardDescription>For professionals and small teams</CardDescription>
            <div className="mt-4">
              <span className="display-2">
                ${activeTab === "monthly" ? "29" : "23"}
              </span>
              <span className="text-foreground ml-1">/month</span>
              {activeTab === "annual" && (
                <p className="text-xs text-primary mt-1">
                  Billed annually (${23 * 12}/year)
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">Get Started</Button>
            <Separator />
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>Unlimited projects</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>12-hour support response time</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>API access</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>Custom integrations</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Enterprise Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Enterprise</CardTitle>
            <CardDescription>For large organizations and teams</CardDescription>
            <div className="mt-4">
              <span className="display-2">
                ${activeTab === "monthly" ? "99" : "79"}
              </span>
              <span className="text-foreground ml-1">/month</span>
              {activeTab === "annual" && (
                <p className="text-xs text-primary mt-1">
                  Billed annually (${79 * 12}/year)
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" variant="outline">
              Contact Sales
            </Button>
            <Separator />
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>Dedicated support</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>1-hour support response time</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>SSO authentication</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                <span>Custom contract</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Can I change plans later?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can upgrade or downgrade your plan at any time. When
                  upgrading, you&apos;ll be charged a prorated amount for the
                  remainder of your billing cycle. When downgrading, your new
                  plan will take effect at the beginning of your next billing
                  cycle.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  What payment methods do you accept?
                </AccordionTrigger>
                <AccordionContent>
                  We accept all major credit cards, including Visa, Mastercard,
                  and American Express. We also accept PayPal for payment.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Is there a free trial available?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, we offer a 14-day free trial for our Pro plan. No credit
                  card is required to sign up for the trial.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  How do I cancel my subscription?
                </AccordionTrigger>
                <AccordionContent>
                  You can cancel your subscription at any time from your account
                  settings. When you cancel, you&apos;ll still have access to your
                  plan until the end of your current billing cycle.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PricingExample;
