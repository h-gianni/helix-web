import React, { useState } from 'react';
import { Badge } from '@/components/ui/core/Badge';
import { Button } from '@/components/ui/core/Button';
import { X } from 'lucide-react';

const AnnouncementBanner = ({
  badgeText = "Announcement",
  title = "Join our upcoming webinar",
  description = "Learn how to maximize your productivity with our platform. Live Q&A with our product team included.",
  primaryCta = "Register Now",
  secondaryCta = "Add to Calendar",
  onPrimaryClick = () => {},
  onSecondaryClick = () => {},
  onDismiss = () => {},
  color = "primary", // Options: primary, warning, success, destructive, accent, info
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Color variants mapping based on theme.css
  const colorVariants: Record<string, string> = {
    primary: "bg-[var(--primary-lightest)] border-[var(--primary-lighter)] [&_h3]:text-[var(--primary-darkest)] [&_p]:text-[var(--primary-darker)] [&_.badge]:bg-[var(--primary-lighter)] [&_.badge]:text-[var(--primary-darkest)] [&_.primary-btn]:bg-[var(--primary-base)] [&_.primary-btn]:hover:bg-[var(--primary-dark)] [&_.primary-btn]:text-white [&_.secondary-btn]:text-[var(--primary-darkest)] [&_.secondary-btn]:border-[var(--primary-light)] [&_.secondary-btn]:hover:bg-[var(--primary-lighter)]",
    warning: "bg-[var(--warning-lightest)] border-[var(--warning-lighter)] [&_h3]:text-[var(--warning-darkest)] [&_p]:text-[var(--warning-darker)] [&_.badge]:bg-[var(--warning-lighter)] [&_.badge]:text-[var(--warning-darkest)] [&_.primary-btn]:bg-[var(--warning-base)] [&_.primary-btn]:hover:bg-[var(--warning-dark)] [&_.primary-btn]:text-white [&_.secondary-btn]:text-[var(--warning-darkest)] [&_.secondary-btn]:border-[var(--warning-light)] [&_.secondary-btn]:hover:bg-[var(--warning-lighter)]",
    success: "bg-[var(--success-lightest)] border-[var(--success-lighter)] [&_h3]:text-[var(--success-darkest)] [&_p]:text-[var(--success-darker)] [&_.badge]:bg-[var(--success-lighter)] [&_.badge]:text-[var(--success-darkest)] [&_.primary-btn]:bg-[var(--success-base)] [&_.primary-btn]:hover:bg-[var(--success-dark)] [&_.primary-btn]:text-white [&_.secondary-btn]:text-[var(--success-darkest)] [&_.secondary-btn]:border-[var(--success-light)] [&_.secondary-btn]:hover:bg-[var(--success-lighter)]",
    destructive: "bg-[var(--destructive-lightest)] border-[var(--destructive-lighter)] [&_h3]:text-[var(--destructive-darkest)] [&_p]:text-[var(--destructive-darker)] [&_.badge]:bg-[var(--destructive-lighter)] [&_.badge]:text-[var(--destructive-darkest)] [&_.primary-btn]:bg-[var(--destructive-base)] [&_.primary-btn]:hover:bg-[var(--destructive-dark)] [&_.primary-btn]:text-white [&_.secondary-btn]:text-[var(--destructive-darkest)] [&_.secondary-btn]:border-[var(--destructive-light)] [&_.secondary-btn]:hover:bg-[var(--destructive-lighter)]",
    accent: "bg-[var(--accent-lightest)] border-[var(--accent-lighter)] [&_h3]:text-[var(--accent-darkest)] [&_p]:text-[var(--accent-darker)] [&_.badge]:bg-[var(--accent-lighter)] [&_.badge]:text-[var(--accent-darkest)] [&_.primary-btn]:bg-[var(--accent-base)] [&_.primary-btn]:hover:bg-[var(--accent-dark)] [&_.primary-btn]:text-white [&_.secondary-btn]:text-[var(--accent-darkest)] [&_.secondary-btn]:border-[var(--accent-light)] [&_.secondary-btn]:hover:bg-[var(--accent-lighter)]",
    info: "bg-[var(--info-lightest)] border-[var(--info-lighter)] [&_h3]:text-[var(--info-darkest)] [&_p]:text-[var(--info-darker)] [&_.badge]:bg-[var(--info-lighter)] [&_.badge]:text-[var(--info-darkest)] [&_.primary-btn]:bg-[var(--info-base)] [&_.primary-btn]:hover:bg-[var(--info-dark)] [&_.primary-btn]:text-white [&_.secondary-btn]:text-[var(--info-darkest)] [&_.secondary-btn]:border-[var(--info-light)] [&_.secondary-btn]:hover:bg-[var(--info-lighter)]",
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };

  if (!isVisible) return null;

  return (
    <div className={`w-full border rounded-[var(--radius)] p-4 md:p-6 shadow-[var(--shadow-sm)] ${colorVariants[color] || colorVariants.primary}`}>
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="space-y-2 flex-grow">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="badge font-medium text-xs px-2 py-0.5">
              {badgeText}
            </Badge>
            <h3 className="text-lg md:text-xl font-semibold">{title}</h3>
          </div>
          <p className="text-sm md:text-base">{description}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button 
            onClick={onPrimaryClick}
            className="primary-btn w-full sm:w-auto"
          >
            {primaryCta}
          </Button>
          <Button 
            variant="outline" 
            onClick={onSecondaryClick}
            className="secondary-btn w-full sm:w-auto"
          >
            {secondaryCta}
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          icon
          onClick={handleDismiss}
          className="absolute right-2 top-2 md:relative md:right-0 md:top-0 text-[var(--neutral-dark)] hover:bg-[var(--neutral-lighter)]"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;