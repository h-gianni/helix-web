import React from 'react';
import { cn } from '@/lib/utils';

export type CardSize = 'sm' | 'base' | 'lg' | 'xl';

// Card Types
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: CardSize;
  shadow?: 'none' | 'sm' | 'base' | 'lg' | 'xl';
  align?: 'left' | 'center';
  noBorder?: boolean;
  noBackground?: boolean;
  interactive?: boolean;
  clickable?: boolean;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  hasActions?: boolean;
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  size?: CardSize;
}

// Card Component
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, size = 'base', shadow = 'none', align = 'left', noBorder, noBackground, interactive, clickable, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('ui-card', className)}
        data-size={size}
        data-shadow={shadow}
        data-align={align}
        data-no-border={noBorder}
        data-no-background={noBackground}
        data-interactive={interactive}
        data-clickable={clickable}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

// Card Header Component
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, hasActions, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('ui-card-header', className)}
        data-has-actions={hasActions}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardHeader.displayName = 'CardHeader';

// Card Title Component
export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, size = 'base', children, ...props }, ref) => {
    // Map size to corresponding heading level
    const sizeToLevel: Record<CardSize, string> = {
      'sm': '5',
      'base': '4',
      'lg': '3',
      'xl': '2'
    };

    return (
      <h3
        ref={ref}
        className={cn('ui-card-title', className)}
        data-size={size}
        data-level={sizeToLevel[size]}
        {...props}
      >
        {children}
      </h3>
    );
  }
);
CardTitle.displayName = 'CardTitle';

// Card Description Component
export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('ui-card-description', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
CardDescription.displayName = 'CardDescription';

// Card Content Component
export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('ui-card-content', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardContent.displayName = 'CardContent';

// Card Footer Component
export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('ui-card-footer', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardFooter.displayName = 'CardFooter';

export default Object.assign(Card, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});