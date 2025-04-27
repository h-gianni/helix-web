import React, { useState } from 'react';
import { Badge } from '@/components/ui/core/Badge';
import { Button } from '@/components/ui/core/Button';
import { X } from 'lucide-react';

const AnnouncementBanner = ({
  badgeText = "Announcement",
  title = "Join our upcoming webinar",
  description = "Learn how to maximize your productivity with our platform. Live Q&A with our product team included.",
  primaryCta = "Register Now",
  neutralCta = "Add to Calendar",
  onPrimaryClick = () => {},
  onneutralClick = () => {},
  onDismiss = () => {},
  color = "primary", // Options: primary, warning, success, destructive, accent, info
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Color variants mapping based on theme.css
  const colorVariants: Record<string, string> = {
    primary: "bg-[var(--primary-50)] border-[var(--primary-100)] [&_h3]:text-[var(--primary-900)] [&_p]:text-[var(--primary-800)] [&_.badge]:bg-[var(--primary-100)] [&_.badge]:text-[var(--primary-900)] [&_.primary-btn]:bg-[var(--primary-base)] [&_.primary-btn]:hover:bg-[var(--primary-700)] [&_.primary-btn]:text-white [&_.neutral-btn]:text-[var(--primary-900)] [&_.neutral-btn]:border-[var(--primary-200)] [&_.neutral-btn]:hover:bg-[var(--primary-100)]",
    warning: "bg-[var(--warning-50)] border-[var(--warning-100)] [&_h3]:text-[var(--warning-900)] [&_p]:text-[var(--warning-800)] [&_.badge]:bg-[var(--warning-100)] [&_.badge]:text-[var(--warning-900)] [&_.primary-btn]:bg-[var(--warning-base)] [&_.primary-btn]:hover:bg-[var(--warning-700)] [&_.primary-btn]:text-white [&_.neutral-btn]:text-[var(--warning-900)] [&_.neutral-btn]:border-[var(--warning-200)] [&_.neutral-btn]:hover:bg-[var(--warning-100)]",
    success: "bg-[var(--success-50)] border-[var(--success-100)] [&_h3]:text-[var(--success-900)] [&_p]:text-[var(--success-800)] [&_.badge]:bg-[var(--success-100)] [&_.badge]:text-[var(--success-900)] [&_.primary-btn]:bg-[var(--success-base)] [&_.primary-btn]:hover:bg-[var(--success-700)] [&_.primary-btn]:text-white [&_.neutral-btn]:text-[var(--success-900)] [&_.neutral-btn]:border-[var(--success-200)] [&_.neutral-btn]:hover:bg-[var(--success-100)]",
    destructive: "bg-[var(--destructive-50)] border-[var(--destructive-100)] [&_h3]:text-[var(--destructive-900)] [&_p]:text-[var(--destructive-800)] [&_.badge]:bg-[var(--destructive-100)] [&_.badge]:text-[var(--destructive-900)] [&_.primary-btn]:bg-[var(--destructive-base)] [&_.primary-btn]:hover:bg-[var(--destructive-700)] [&_.primary-btn]:text-white [&_.neutral-btn]:text-[var(--destructive-900)] [&_.neutral-btn]:border-[var(--destructive-200)] [&_.neutral-btn]:hover:bg-[var(--destructive-100)]",
    accent: "bg-[var(--accent-50)] border-[var(--accent-100)] [&_h3]:text-[var(--accent-900)] [&_p]:text-[var(--accent-800)] [&_.badge]:bg-[var(--accent-100)] [&_.badge]:text-[var(--accent-900)] [&_.primary-btn]:bg-[var(--accent-base)] [&_.primary-btn]:hover:bg-[var(--accent-700)] [&_.primary-btn]:text-white [&_.neutral-btn]:text-[var(--accent-900)] [&_.neutral-btn]:border-[var(--accent-200)] [&_.neutral-btn]:hover:bg-[var(--accent-100)]",
    info: "bg-[var(--info-50)] border-[var(--info-100)] [&_h3]:text-[var(--info-900)] [&_p]:text-[var(--info-800)] [&_.badge]:bg-[var(--info-100)] [&_.badge]:text-[var(--info-900)] [&_.primary-btn]:bg-[var(--info-base)] [&_.primary-btn]:hover:bg-[var(--info-700)] [&_.primary-btn]:text-white [&_.neutral-btn]:text-[var(--info-900)] [&_.neutral-btn]:border-[var(--info-200)] [&_.neutral-btn]:hover:bg-[var(--info-100)]",
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
            onClick={onneutralClick}
            className="neutral-btn w-full sm:w-auto"
          >
            {neutralCta}
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          icon
          onClick={handleDismiss}
          className="absolute right-2 top-2 md:relative md:right-0 md:top-0 text-[var(--neutral-700)] hover:bg-[var(--neutral-100)]"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;