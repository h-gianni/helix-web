import React from "react";
import { Badge } from "@/components/ui/core/Badge";
import { Button } from "@/components/ui/core/Button";

const SplitBanner = ({
  badgeText = "Featured",
  title = "Work together, transparently",
  description = "You can now customize and share your team member performance reports with ease and in real-time.",
  bulletPoints = [
    "Show them what they need to know",
    "Keep them updated on their performance",
    "Build a professional rapport of trust",
  ],
  primaryCta = "Upgrade to Pro",
  secondaryCta = "Watch Demo",
  onPrimaryClick = () => {},
  onSecondaryClick = () => {},
  imagePath = "/api/placeholder/600/400",
  imageAlt = "Collaboration platform screenshot",
  imagePosition = "right", // Options: 'right' or 'left'
}) => {
  const Content = () => (
    <div className="flex flex-col justify-center space-y-4 p-6 md:p-8">
      <Badge variant="accent" className="w-fit">
        {badgeText}
      </Badge>
      <div className="space-y-2">
        <h2 className="display-1">{title}</h2>

        <p className="text-[var(--neutral-darker)] text-sm md:text-base">
          {description}
        </p>
      </div>

      {bulletPoints.length > 0 && (
        <ul className="space-y-2">
          {bulletPoints.map((point, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="size-4 text-[var(--primary-darker)] mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-[var(--neutral-darker)]">{point}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button variant="accent" onClick={onPrimaryClick}>
          {primaryCta}
        </Button>
        <Button variant="outline" onClick={onSecondaryClick}>
          {secondaryCta}
        </Button>
      </div>
    </div>
  );

  const Image = () => (
    <div className="w-full h-full min-h-64">
      <img
        src={imagePath}
        alt={imageAlt}
        className="w-full h-full object-cover"
      />
    </div>
  );

  return (
    <div className="w-full overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] bg-[var(--white)] border border-[var(--neutral-light)]">
      <div className="flex flex-col md:flex-row">
        {imagePosition === "left" ? (
          <>
            <div className="md:w-1/2 order-2 md:order-1">
              <Image />
            </div>
            <div className="md:w-1/2 order-1 md:order-2">
              <Content />
            </div>
          </>
        ) : (
          <>
            <div className="md:w-1/2">
              <Content />
            </div>
            <div className="md:w-1/2">
              <Image />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SplitBanner;
