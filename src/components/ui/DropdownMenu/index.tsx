"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type DropdownMenuElement = React.ElementRef<typeof DropdownMenuPrimitive.Root>;
type DropdownMenuProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root> & {
  closeOnSelect?: boolean;
};

const DropdownMenu = React.forwardRef<DropdownMenuElement, DropdownMenuProps>(
  ({ closeOnSelect = true, ...props }, ref) => (
    <DropdownMenuPrimitive.Root {...props} />
  )
);

DropdownMenu.displayName = DropdownMenuPrimitive.Root.displayName;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

type SubTriggerElement = React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>;
type SubTriggerProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
};

const DropdownMenuSubTrigger = React.forwardRef<SubTriggerElement, SubTriggerProps>(
  ({ className, inset, children, ...props }, ref) => (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={cn("ui-dropdown-item", className)}
      {...props}
    >
      {children}
      <ChevronRight className="icon-chevron-right" />
    </DropdownMenuPrimitive.SubTrigger>
  )
);

DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

type SubContentElement = React.ElementRef<typeof DropdownMenuPrimitive.SubContent>;
type SubContentProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>;

const DropdownMenuSubContent = React.forwardRef<SubContentElement, SubContentProps>(
  ({ className, collisionPadding = 8, ...props }, ref) => (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      collisionPadding={collisionPadding}
      className={cn("ui-dropdown-sub-content", className)}
      {...props}
    />
  )
);

DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

type ContentElement = React.ElementRef<typeof DropdownMenuPrimitive.Content>;
type ContentProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>;

const DropdownMenuContent = React.forwardRef<ContentElement, ContentProps>(
  ({ className, sideOffset = 4, collisionPadding = 8, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn("ui-dropdown-content", className)}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
);

DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

type ItemElement = React.ElementRef<typeof DropdownMenuPrimitive.Item>;
type ItemProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  destructive?: boolean;
};

const DropdownMenuItem = React.forwardRef<ItemElement, ItemProps>(
  ({ className, inset, destructive, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        "ui-dropdown-item",
        destructive && "!ui-dropdown-item-destructive",
        className
      )}
      {...props}
    />
  )
);

DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

type CheckboxItemElement = React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>;
type CheckboxItemProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>;

const DropdownMenuCheckboxItem = React.forwardRef<CheckboxItemElement, CheckboxItemProps>(
  ({ className, children, checked, ...props }, ref) => (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn("ui-dropdown-checkbox", className)}
      checked={checked}
      {...props}
    >
      <span className="popcard-list-indicator">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="icon-checked" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
);

DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

type RadioItemElement = React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>;
type RadioItemProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>;

const DropdownMenuRadioItem = React.forwardRef<RadioItemElement, RadioItemProps>(
  ({ className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn("ui-dropdown-radio", className)}
      {...props}
    >
      <span className="popcard-list-indicator">
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle className="icon-circle-selected" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
);

DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

type LabelElement = React.ElementRef<typeof DropdownMenuPrimitive.Label>;
type LabelProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
};

const DropdownMenuLabel = React.forwardRef<LabelElement, LabelProps>(
  ({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={cn("ui-dropdown-group-title", className)}
      {...props}
    />
  )
);

DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

type SeparatorElement = React.ElementRef<typeof DropdownMenuPrimitive.Separator>;
type SeparatorProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>;

const DropdownMenuSeparator = React.forwardRef<SeparatorElement, SeparatorProps>(
  ({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={cn("ui-dropdown-separator", className)}
      {...props}
    />
  )
);

DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("ui-dropdown-shortcut", className)} {...props} />
);

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
