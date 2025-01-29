import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export type CardSize = "sm" | "base" | "lg" | "xl";
export type CardShadow = "none" | "sm" | "base" | "lg" | "xl";
export type CardContentAlignment = "base" | "center";

type BaseProps = {
  asChild?: boolean;
  className?: string;
  size?: CardSize;
  shadow?: CardShadow;
  border?: boolean;
  background?: boolean;
  interactive?: boolean;
  contentAlignment?: CardContentAlignment;
};

type ButtonCardProps = BaseProps & {
  clickable: true;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps | 'onClick'>;

type DivCardProps = BaseProps & {
  clickable?: false;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
} & Omit<React.HTMLAttributes<HTMLDivElement>, keyof BaseProps | 'onClick'>;

export type CardProps = ButtonCardProps | DivCardProps;

// Create context for card size
type CardContextType = {
  size: CardSize;
};

const CardContext = React.createContext<CardContextType>({ size: "base" });

const useCardContext = () => {
  const context = React.useContext(CardContext);
  if (!context) {
    throw new Error("Card components must be used within a Card");
  }
  return context;
};

const Card = React.forwardRef<HTMLElement, CardProps>((props, ref) => {
  const {
    className,
    size = "base",
    shadow = "none",
    border = true,
    background = true,
    interactive = false,
    clickable = false,
    onClick,
    asChild = false,
    contentAlignment = "base",
    ...rest
  } = props;

  const cardContext = React.useMemo(() => ({ size }), [size]);
  
  const classes = cn(
    "card-base",
    `card-${size}`,
    shadow !== "none" && `card-shadow-${shadow}`,
    !border && "card-no-border",
    !background && "card-no-background",
    interactive && "card-interactive",
    clickable && "card-clickable",
    contentAlignment === "center" && "card-content-center",
    className
  );

  if (clickable) {
    const Comp = asChild ? Slot : "button";
    return (
      <CardContext.Provider value={cardContext}>
        <Comp
          ref={ref as React.Ref<HTMLButtonElement>}
          className={classes}
          onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
          role="button"
          tabIndex={0}
          {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        />
      </CardContext.Provider>
    );
  }

  const Comp = asChild ? Slot : "div";
  return (
    <CardContext.Provider value={cardContext}>
      <Comp
        ref={ref as React.Ref<HTMLDivElement>}
        className={classes}
        onClick={onClick as React.MouseEventHandler<HTMLDivElement>}
        {...(rest as React.HTMLAttributes<HTMLDivElement>)}
      />
    </CardContext.Provider>
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("card-header", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardHeaderWithActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("card-header-actions", className)}
    {...props}
  />
));
CardHeaderWithActions.displayName = "CardHeaderWithActions";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const { size } = useCardContext();
  return (
    <h3
      ref={ref}
      className={cn(
        "card-title",
        `card-title-${size}`,
        className
      )}
      {...props}
    />
  );
});
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("card-description", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("card-content", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, onClick, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("card-footer", className)}
    onClick={(e) => {
      e.stopPropagation();
      onClick?.(e);
    }}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardHeaderWithActions,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};