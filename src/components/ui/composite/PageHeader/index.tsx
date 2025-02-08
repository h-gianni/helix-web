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

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  (
    {
      title,
      caption,
      actions,
      backButton,
      icon,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("page-header", className)}
        {...props}
      >
        <div className="page-header-container">
          <div className="page-header-content">
            {backButton && (
              <Button
                variant="neutral"
                iconOnly
                size="sm"
                onClick={backButton.onClick}
                leadingIcon={<ArrowLeft />}
              />
            )}
            <div>
              <h1 className="page-header-title">
                {title}
                {icon && icon}
              </h1>
              {caption && <p className="page-header-caption">{caption}</p>}
            </div>
          </div>
          {actions && (
            <div className="page-header-actions">
              {actions}
            </div>
          )}
        </div>
      </div>
    );
  }
);

PageHeader.displayName = "PageHeader";

export { PageHeader };