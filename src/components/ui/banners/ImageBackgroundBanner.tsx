import React from "react";
import { Badge } from "@/components/ui/core/Badge";
import { Button } from "@/components/ui/core/Button";

const ImageBackgroundBanner = ({
  badgeText = "Limited Time",
  title = "50% Off All Premium Plans",
  description = "Upgrade now and save with our biggest discount of the year. Offer ends soon.",
  primaryCta = "Upgrade Now",
  secondaryCta = "View Plans",
  onPrimaryClick = () => {},
  onSecondaryClick = () => {},
  imagePath = "", 
}) => {
  return (
    <div className="w-full rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-md)] relative">
      {/* Background image container */}
      <div className="absolute inset-0">
        <img
          src={imagePath}
          alt="Banner background"
          className="w-full h-full object-cover"
        />
        {/* White gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 lg:p-10">
        <div className="max-w-3xl space-y-4">
          <Badge variant="accent-light">{badgeText}</Badge>
          <div className="space-y-1 pb-4">
            <h2 className="display-1">
              {title}
            </h2>
            <p className="text-foreground text-base md:text-lg max-w-xl">
              {description}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="accent" size="lg" onClick={onPrimaryClick}>
              {primaryCta}
            </Button>
            <Button variant="outline" size="lg" onClick={onSecondaryClick}>
              {secondaryCta}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageBackgroundBanner;
