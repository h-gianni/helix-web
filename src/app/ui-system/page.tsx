"use client";

import React from "react";
import Link from "next/link";
import ShowcaseLayout from "@/app/ui-system/components/ShowcaseLayout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/core/Card";
import { Button } from "@/components/ui/core/Button";
import { Badge } from "@/components/ui/core/Badge";
import { HeroBadge } from "@/components/ui/core/HeroBadge";
import {
  Palette,
  Grid3X3,
  Users,
  LayoutDashboard,
  Settings,
  BarChart3,
  Component,
} from "lucide-react";
import Image from "next/image";
import CardImage from "@/assets/shared/img01.png";

export default function ShowcaseHomePage() {
  const showcasePages = [
    {
      title: "Design Tokens",
      description: "Colors, typography, spacing, and shadows",
      icon: Palette,
      href: "/ui-system/ui-content/tokens",
      badge: "Foundation",
    },
    {
      title: "Core Components",
      description: "Buttons, inputs, cards, and other basic elements",
      icon: Grid3X3,
      href: "/ui-system/ui-content/core",
      badge: "Foundation",
    },
    {
      title: "Team & Members",
      description: "Components for team and member management",
      icon: Users,
      href: "/ui-system/ui-content/team-and-members",
      badge: "Page Components",
    },
    {
      title: "Dashboard",
      description: "Performance metrics and data visualization",
      icon: LayoutDashboard,
      href: "/ui-system/ui-content/dashboard",
      badge: "Page Components",
    },
    {
      title: "Settings",
      description: "User preferences and account configuration",
      icon: Settings,
      href: "/ui-system/ui-content/settings",
      badge: "Page Components",
    },
  ];

  return (
    <ShowcaseLayout
      title="Design System"
      description="A comprehensive collection of design tokens, components, and patterns for building JustScore interfaces"
    >
      <div className="space-y-12">
        {/* Introduction Section */}
        <section className="prose max-w-none">
          <p className="body-base">
            This design system provides a unified set of components and
            guidelines for creating consistent, accessible, and visually
            appealing interfaces for the JustScore application. Browse through
            the various sections to explore components and see them in action.
          </p>
        </section>

        {/* Component Categories Grid */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {showcasePages.map((page) => (
              <Link key={page.href} href={page.href} className="block">
                <Card>
                  <Image src={CardImage} alt="" className="w-full border-4 border-b-0 border-white rounded-t-xl" />
                  <CardHeader data-slot="card-header">
                    <div className="relative pt-1.5">
                      <div className="space-y-2">
                        <HeroBadge icon={page.icon} />
                        <div>
                          <h3 className="heading-3">{page.title}</h3>
                          <p className="text-sm text-foreground-weak flex-grow">
                            {page.description}
                          </p>
                        </div>
                      </div>
                      <div className="absolute top-1 right-0 flex flex-wrap gap-1">
                        <Badge variant="info-light">{page.badge}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <div className="pt-4 mt-auto w-full">
                      <Button variant="outline" className="w-full">
                        Explore {page.title}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Design Resources Section */}
        <section className="space-y-4">
          <h2 className="heading-2">Design Resources</h2>
          <Card className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-6">
            <HeroBadge icon={Component} size="xl" />
              <div className="flex-grow space-y-4">
                <h3 className="heading-3">Component Documentation</h3>
                <p>
                  Comprehensive documentation for all components, including
                  usage guidelines, code examples, and best practices for
                  implementation.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline">View Documentation</Button>
                  <Button variant="ghost">Download Figma Assets</Button>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </ShowcaseLayout>
  );
}
