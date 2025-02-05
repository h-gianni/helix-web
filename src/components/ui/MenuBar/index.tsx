"use client";

import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type RootElement = React.ElementRef<typeof MenubarPrimitive.Root>;
type RootProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>;

const Menubar = React.forwardRef<RootElement, RootProps>(
  ({ className, ...props }, ref) => (
    <MenubarPrimitive.Root
      ref={ref}
      className={cn("ui-menubar-root", className)}
      {...props}
    />
  )
);
Menubar.displayName = "Menubar";

const MenubarMenu = MenubarPrimitive.Menu;
const MenubarGroup = MenubarPrimitive.Group;
const MenubarPortal = MenubarPrimitive.Portal;
const MenubarSub = MenubarPrimitive.Sub;
const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

type TriggerElement = React.ElementRef<typeof MenubarPrimitive.Trigger>;
type TriggerProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>;

const MenubarTrigger = React.forwardRef<TriggerElement, TriggerProps>(
  ({ className, ...props }, ref) => (
    <MenubarPrimitive.Trigger
      ref={ref}
      className={cn("ui-menubar-trigger", className)}
      {...props}
    />
  )
);
MenubarTrigger.displayName = "MenubarTrigger";

type SubTriggerElement = React.ElementRef<typeof MenubarPrimitive.SubTrigger>;
type SubTriggerProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean;
};

const MenubarSubTrigger = React.forwardRef<SubTriggerElement, SubTriggerProps>(
  ({ className, inset, children, ...props }, ref) => (
    <MenubarPrimitive.SubTrigger
      ref={ref}
      className={cn("ui-menubar-item", className)}
      {...props}
    >
      {children}
      <ChevronRight className="icon-chevron-right" />
    </MenubarPrimitive.SubTrigger>
  )
);
MenubarSubTrigger.displayName = "MenubarSubTrigger";

type SubContentElement = React.ElementRef<typeof MenubarPrimitive.SubContent>;
type SubContentProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>;

const MenubarSubContent = React.forwardRef<SubContentElement, SubContentProps>(
  ({ className, ...props }, ref) => (
    <MenubarPrimitive.SubContent
      ref={ref}
      className={cn("ui-menubar-sub-content", className)}
      {...props}
    />
  )
);
MenubarSubContent.displayName = "MenubarSubContent";

type ContentElement = React.ElementRef<typeof MenubarPrimitive.Content>;
type ContentProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>;

const MenubarContent = React.forwardRef<ContentElement, ContentProps>(
  ({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }, ref) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn("ui-menubar-content-base", className)}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
);
MenubarContent.displayName = "MenubarContent";

type ItemElement = React.ElementRef<typeof MenubarPrimitive.Item>;
type ItemProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
  inset?: boolean;
};

const MenubarItem = React.forwardRef<ItemElement, ItemProps>(
  ({ className, inset, ...props }, ref) => (
    <MenubarPrimitive.Item
      ref={ref}
      className={cn("ui-menubar-item", className)}
      {...props}
    />
  )
);
MenubarItem.displayName = "MenubarItem";

type CheckboxItemElement = React.ElementRef<typeof MenubarPrimitive.CheckboxItem>;
type CheckboxItemProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>;

const MenubarCheckboxItem = React.forwardRef<CheckboxItemElement, CheckboxItemProps>(
  ({ className, children, checked, ...props }, ref) => (
    <MenubarPrimitive.CheckboxItem
      ref={ref}
      className={cn("ui-menubar-checkbox-item", className)}
      checked={checked}
      {...props}
    >
      <span className="ui-menubar-indicator">
        <MenubarPrimitive.ItemIndicator>
          <Check className="icon-checked" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  )
);
MenubarCheckboxItem.displayName = "MenubarCheckboxItem";

type RadioItemElement = React.ElementRef<typeof MenubarPrimitive.RadioItem>;
type RadioItemProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>;

const MenubarRadioItem = React.forwardRef<RadioItemElement, RadioItemProps>(
  ({ className, children, ...props }, ref) => (
    <MenubarPrimitive.RadioItem
      ref={ref}
      className={cn("ui-menubar-radio-item", className)}
      {...props}
    >
      <span className="ui-menubar-indicator">
        <MenubarPrimitive.ItemIndicator>
          <Circle className="icon-circle-selected" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  )
);
MenubarRadioItem.displayName = "MenubarRadioItem";

type LabelElement = React.ElementRef<typeof MenubarPrimitive.Label>;
type LabelProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
  inset?: boolean;
};

const MenubarLabel = React.forwardRef<LabelElement, LabelProps>(
  ({ className, inset, ...props }, ref) => (
    <MenubarPrimitive.Label
      ref={ref}
      className={cn("ui-menubar-group-title", className)}
      {...props}
    />
  )
);
MenubarLabel.displayName = "MenubarLabel";

type SeparatorElement = React.ElementRef<typeof MenubarPrimitive.Separator>;
type SeparatorProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>;

const MenubarSeparator = React.forwardRef<SeparatorElement, SeparatorProps>(
  ({ className, ...props }, ref) => (
    <MenubarPrimitive.Separator
      ref={ref}
      className={cn("ui-menubar-separator", className)}
      {...props}
    />
  )
);
MenubarSeparator.displayName = "MenubarSeparator";

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("ui-menubar-shortcut", className)} {...props} />
);
MenubarShortcut.displayName = "MenubarShortcut";

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
};
