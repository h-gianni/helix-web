import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, CircleHelp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/Label";

type SelectSize = "sm" | "base" | "lg";
type SelectWidth = "inline" | "full";

interface SelectProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
  error?: boolean;
  size?: SelectSize;
  withLabel?: boolean;
  withIcons?: boolean;
  label?: string;
  helperText?: string;
  required?: boolean;
  width?: SelectWidth;
  triggerClassName?: string;
}

interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  error?: boolean;
  size?: SelectSize;
  icon?: React.ReactNode;
  withIcon?: boolean;
}

interface SelectItemProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  size?: SelectSize;
  withIcon?: React.ReactNode;
}

interface SelectContentElement extends React.ReactElement<any> {
  type: typeof SelectContent;
  props: {
    children: React.ReactNode;
  };
}

interface SelectItemElement extends React.ReactElement<SelectItemProps> {
  type: typeof SelectItem;
}

interface SelectGroupElement extends React.ReactElement<any> {
  type: typeof SelectGroup;
  props: {
    children: React.ReactNode;
  };
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
  position?: "item-aligned" | "popper";
}

interface SelectGroupProps {
  children: React.ReactNode;
}

const findIconByValue = (value: string, children: React.ReactNode): React.ReactNode => {
  let icon: React.ReactNode = null;
  
  const processSelectItem = (child: React.ReactElement<SelectItemProps>): void => {
    if (child.type === SelectItem && child.props.value === value) {
      icon = child.props.withIcon;
    }
  };

  const processChildren = (child: React.ReactElement<SelectContentProps>): void => {
    if (child.type === SelectContent && child.props.children) {
      React.Children.forEach(child.props.children, (contentChild) => {
        if (!React.isValidElement(contentChild)) return;

        if (contentChild.type === SelectItem) {
          processSelectItem(contentChild as React.ReactElement<SelectItemProps>);
        } else if (contentChild.type === SelectGroup) {
          const groupChild = contentChild as React.ReactElement<SelectGroupProps>;
          if (groupChild.props.children) {
            React.Children.forEach(groupChild.props.children, (groupItem) => {
              if (React.isValidElement(groupItem) && groupItem.type === SelectItem) {
                processSelectItem(groupItem as React.ReactElement<SelectItemProps>);
              }
            });
          }
        }
      });
    }
  };

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      processChildren(child as React.ReactElement<SelectContentProps>);
    }
  });

  return icon;
};

const Select = ({
  error,
  size = "base",
  withLabel = false,
  label,
  helperText,
  required,
  disabled,
  width = "inline",
  triggerClassName,
  withIcons = true,
  children,
  ...props
}: SelectProps) => {
  const [focused, setFocused] = React.useState(false);
  const [selectedIcon, setSelectedIcon] = React.useState<React.ReactNode>(() => 
    props.value ? findIconByValue(props.value, children) : null
  );
  const selectId = React.useId();

  React.useEffect(() => {
    if (props.value) {
      setSelectedIcon(findIconByValue(props.value, children));
    }
  }, [props.value, children]);

  const handleValueChange = (value: string) => {
    if (props.onValueChange) {
      props.onValueChange(value);
    }
    setSelectedIcon(findIconByValue(value, children));
  };

  const renderContent = (
    <div className="form-layout-field">
      <div className="select-container" data-width={width}>
        <SelectPrimitive.Root
          disabled={disabled}
          required={required}
          onValueChange={handleValueChange}
          {...props}
        >
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return child;

            if (child.type === SelectTrigger) {
              const triggerChild = child as React.ReactElement<SelectTriggerProps>;
              return React.cloneElement(triggerChild, {
                ...triggerChild.props,
                size,
                error,
                className: cn(triggerChild.props.className, triggerClassName),
                icon: withIcons ? selectedIcon : undefined,
                withIcon: withIcons,
                onFocus: () => setFocused(true),
                onBlur: () => setFocused(false),
                "aria-describedby": helperText ? `${selectId}-helper` : undefined,
                id: selectId,
              });
            }

            if (child.type === SelectContent) {
              const contentChild = child as React.ReactElement<any>;
              return React.cloneElement(contentChild, {
                ...contentChild.props,
                className: cn("select-content", `select-content-${size}`, contentChild.props.className),
                children: React.Children.map(
                  contentChild.props.children,
                  (groupChild) => {
                    if (!React.isValidElement(groupChild)) return groupChild;

                    if (groupChild.type === SelectGroup) {
                      const groupElement = groupChild as React.ReactElement<any>;
                      return React.cloneElement(groupElement, {
                        ...groupElement.props,
                        children: React.Children.map(
                          groupElement.props.children,
                          (itemChild) => {
                            if (!React.isValidElement(itemChild))
                              return itemChild;

                            if (itemChild.type === SelectItem) {
                              const itemElement =
                                itemChild as React.ReactElement<SelectItemProps>;
                              return React.cloneElement(itemElement, {
                                ...itemElement.props,
                                size,
                                withIcon: withIcons
                                  ? itemElement.props.withIcon
                                  : undefined,
                              });
                            }
                            return itemChild;
                          }
                        ),
                      });
                    }
                    return groupChild;
                  }
                ),
              });
            }
            return child;
          })}
        </SelectPrimitive.Root>
      </div>
      {helperText && (
        <p
          id={`${selectId}-helper`}
          className="form-layout-helper"
          data-error={error}
        >
          {helperText}
        </p>
      )}
    </div>
  );

  if (!withLabel || !label) return renderContent;

  return (
    <div className="form-layout">
      <div className="form-layout-label">
        <Label
          htmlFor={selectId}
          data-error={error}
          data-focused={focused}
          data-disabled={disabled}
          required={required}
        >
          {label}
        </Label>
        {renderContent}
      </div>
    </div>
  );
};
Select.displayName = "Select";

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(
  (
    {
      className,
      children,
      error,
      size = "base",
      icon,
      withIcon = false,
      ...props
    },
    ref
  ) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "select-trigger",
        `select-trigger-${size}`,
        error && "select-trigger-error",
        withIcon && "select-trigger-with-icon",
        className
      )}
      {...props}
    >
      {withIcon && (
        <div className="form-layout-icon" data-size={size} data-error={error}>
          {icon || <CircleHelp />}
        </div>
      )}
      <span className="select-value" data-size={size} data-with-icon={withIcon}>
        {children}
      </span>
      <SelectPrimitive.Icon className="select-chevron">
        <ChevronDown />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
);
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn("select-content", className)}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className="select-viewport">
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, children, withIcon, size = "base", ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn("select-item", `select-item-${size}`, className)}
    {...props}
  >
    <div className="flex items-center min-w-0 gap-2">
      {withIcon && (
        <span className="form-layout-icon" data-size={size}>
          {withIcon}
        </span>
      )}
      <SelectPrimitive.ItemText asChild>
        <span 
          className="select-item-text"
          data-with-icon={!!withIcon}
          data-size={size}
        >
          {children}
        </span>
      </SelectPrimitive.ItemText>
    </div>
    <SelectPrimitive.ItemIndicator className={cn("select-indicator", `select-indicator-${size}`)}>
      <Check className="form-layout-icon" data-size={size} />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
));
SelectItem.displayName = "SelectItem";

const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;
const SelectLabel = SelectPrimitive.Label;
const SelectSeparator = SelectPrimitive.Separator;

export {
  type SelectProps,
  type SelectTriggerProps,
  type SelectItemProps,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectValue,
  SelectLabel,
  SelectSeparator,
};