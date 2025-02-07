"use client";

import * as React from "react";
import type { DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/core/Dialog";

interface ListItemBaseProps {
  inset?: boolean;
  disabled?: boolean;
  selected?: boolean;
}

interface ListGroupProps {
  heading?: string;
}

// Base Components
type BaseItemProps = ListItemBaseProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect">;

const ListItem = React.forwardRef<HTMLDivElement, BaseItemProps>(
  ({ className, inset, disabled, selected, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("command-list", className)}
      data-disabled={disabled}
      data-selected={selected}
      {...props}
    />
  )
);

ListItem.displayName = "ListItem";

const ListGroup = React.forwardRef<
  HTMLDivElement,
  ListGroupProps & React.HTMLAttributes<HTMLDivElement>
>(({ className, heading, children, ...props }, ref) => (
  <div ref={ref} className={cn("popcard-list-group", className)} {...props}>
    {heading && <div className="popcard-list-group-title">{heading}</div>}
    {children}
  </div>
));

ListGroup.displayName = "ListGroup";

// Command Components
type CommandPrimitiveElement = React.ElementRef<typeof CommandPrimitive>;
type CommandPrimitiveProps = React.ComponentPropsWithoutRef<
  typeof CommandPrimitive
>;

const Command = React.forwardRef<
  CommandPrimitiveElement,
  CommandPrimitiveProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn("command-root", className)}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

const CommandDialog = ({ children, ...props }: DialogProps) => (
  <Dialog {...props}>
    <DialogContent className="command-dialog">
      <Command className="command-dialog-styles">{children}</Command>
    </DialogContent>
  </Dialog>
);

type InputElement = React.ElementRef<typeof CommandPrimitive.Input>;
type InputProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>;

const CommandInput = React.forwardRef<InputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <div className="command-input-wrapper" cmdk-input-wrapper="">
      <Search className="command-input-icon" />
      <CommandPrimitive.Input
        ref={ref}
        className={cn("command-input", className)}
        {...props}
      />
    </div>
  )
);
CommandInput.displayName = CommandPrimitive.Input.displayName;

type ListElement = React.ElementRef<typeof CommandPrimitive.List>;
type ListProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>;

const CommandList = React.forwardRef<ListElement, ListProps>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.List
      ref={ref}
      className={cn("command-list", className)}
      {...props}
    />
  )
);
CommandList.displayName = CommandPrimitive.List.displayName;

type EmptyElement = React.ElementRef<typeof CommandPrimitive.Empty>;
type EmptyProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>;

const CommandEmpty = React.forwardRef<EmptyElement, EmptyProps>(
  (props, ref) => (
    <CommandPrimitive.Empty ref={ref} className="command-empty" {...props} />
  )
);
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

type GroupElement = React.ElementRef<typeof CommandPrimitive.Group>;
type GroupProps = React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Group
> &
  ListGroupProps;

const CommandGroup = React.forwardRef<GroupElement, GroupProps>(
  ({ className, heading, ...props }, ref) => (
    <CommandPrimitive.Group
      ref={ref}
      className={cn("popcard-list-group", className)}
      {...props}
    >
      {heading && <div className="popcard-list-group-title">{heading}</div>}
      {props.children}
    </CommandPrimitive.Group>
  )
);
CommandGroup.displayName = CommandPrimitive.Group.displayName;

type SeparatorElement = React.ElementRef<typeof CommandPrimitive.Separator>;
type SeparatorProps = React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Separator
>;

const CommandSeparator = React.forwardRef<SeparatorElement, SeparatorProps>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.Separator
      ref={ref}
      className={cn("popcard-list-separator", className)}
      {...props}
    />
  )
);
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

type ItemElement = React.ElementRef<typeof CommandPrimitive.Item>;
type ItemProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>;

const CommandItem = React.forwardRef<ItemElement, ItemProps>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.Item
      ref={ref}
      className={cn("popcard-list-item", className)}
      {...props}
    />
  )
);
CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("popcard-list-shortcut", className)} {...props} />
);
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
