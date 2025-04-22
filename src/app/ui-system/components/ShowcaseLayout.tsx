"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ShowcaseLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

/**
 * ShowcaseLayout - A consistent layout wrapper for showcase pages
 * 
 * @param title - Main page title
 * @param description - Optional page description
 * @param children - Page content
 * @param className - Optional additional class names
 * @param showBackButton - Whether to show a back button
 * @param onBack - Callback for the back button
 */
export function ShowcaseLayout({
  title,
  description,
  children,
  className,
  showBackButton = false,
  onBack,
}: ShowcaseLayoutProps) {
  return (
    <div className={cn("space-y-4 container mx-auto px-4 pb-16", className)}>
      {/* Header section */}
      <header className="space-y-2 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="display-2">{title}</h1>
          {showBackButton && (
            <button
              onClick={onBack}
              className="text-foreground-weak hover:text-foreground transition-colors"
            >
              ← Back
            </button>
          )}
        </div>
        {description && (
          <p className="body-lg">{description}</p>
        )}
      </header>

      {/* Main content */}
      <main className="pb-16">
        {children}
      </main>

      {/* Footer with design system information */}
      <footer className="border-t border-border pt-8 text-center text-sm text-foreground-weak">
        <p>JustScore Design System Showcase</p>
      </footer>
    </div>
  );
}

export default ShowcaseLayout;