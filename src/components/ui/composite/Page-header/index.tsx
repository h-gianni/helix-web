import * as React from "react";
import { Button } from "@/components/ui/core/Button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  caption?: string;
  actions?: React.ReactNode;
  backButton?: {
    onClick: () => void;
  };
  icon?: React.ReactNode;
  className?: string;
}

function PageHeader({
  title,
  caption,
  actions,
  backButton,
  icon,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div className={cn("page-header", className)} {...props}>
      <div className="page-header-container">
        <div className="page-header-content">
          {backButton && (
            <Button 
              data-slot="button"
              variant="ghost" 
              size="sm" 
              onClick={backButton.onClick}
            >
              <ArrowLeft />
            </Button>
          )}
          <div className="space-y-1.5">
            <h1 className="page-header-title">
              {title}
              {icon && icon}
            </h1>
            {caption && <p className="page-header-caption">{caption}</p>}
          </div>
        </div>
        {actions && <div className="page-header-actions">{actions}</div>}
      </div>
    </div>
  );
}

export { PageHeader };