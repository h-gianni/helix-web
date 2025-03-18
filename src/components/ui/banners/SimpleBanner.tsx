import React from "react";
import { Badge } from "@/components/ui/core/Badge";
import { Button } from "@/components/ui/core/Button";

const SimpleBanner = ({
  badgeText = "New Feature",
  title = "Introducing Analytics Dashboard",
  description = "Get deeper insights into your customer behavior with our new analytics tools.",
  primaryCta = "Get Started",
  secondaryCta = "Learn More",
  onPrimaryClick = () => {},
  onSecondaryClick = () => {},
}) => {
  return (
    <div className="w-full bg-gradient-to-r from-[var(--primary-base)] to-[var(--primary-darkest)] rounded-[var(--radius-lg)] p-6 md:p-8 shadow-md">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-4">
          <Badge
            variant="outline"
            className="bg-white/20 text-white border-transparent"
          >
            {badgeText}
          </Badge>
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-semibold text-white">
              {title}
            </h3>
            <p className="text-white/80 text-sm md:text-base max-w-md">
              {description}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button
            onClick={onSecondaryClick}
            className="bg-white text-[var(--primary-base)] hover:bg-white/90"
          >
            {secondaryCta}
          </Button>
          <Button
            variant="accent"
            onClick={onPrimaryClick}
          >
            {primaryCta}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimpleBanner;
