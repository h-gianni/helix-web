import React, { useState } from "react";
import { Button } from "@/components/ui/core/Button";
import { Trash, Users, User, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/core/Popover";

interface ListItem {
  id: string;
  name: string;
  subtitle?: string | React.ReactNode;
  icon?: "user" | "users";
}

interface TeamListProps<T extends ListItem> {
  items: T[];
  selectedItemId: string | null;
  title: string;
  onSelectItem: (item: T) => void;
  onRemoveItem?: (itemId: string) => void;
  showRemoveButton?: boolean;
}

export default function TeamList<T extends ListItem>({
  items,
  selectedItemId,
  title,
  onSelectItem,
  onRemoveItem,
  showRemoveButton = false,
}: TeamListProps<T>) {
  const [popoverOpenId, setPopoverOpenId] = useState<string | null>(null);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full border-l border-border-weak h-full">
      <div className="py-8 space-y-4">
        <h3 className="heading-3 px-8">{title}</h3>
        <div>
          <ul className="divide-y divide-border-weak">
            {items.map((item) => {
              const isSelected = selectedItemId === item.id;

              return (
                <li
                  key={item.id}
                  className={cn(
                    "-ml-px py-3 pl-8 pr-4 flex items-center justify-between cursor-pointer border-l-1 border-border-weak hover:bg-neutral-lightest group",
                    isSelected && "bg-neutral-lightest border-l-primary"
                  )}
                  onClick={() => onSelectItem(item)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex justify-center items-center size-12 rounded-full",
                        isSelected
                          ? "bg-white text-primary"
                          : "bg-neutral-lightest text-neutral-darker"
                      )}
                    >
                      {item.icon === "user" ? (
                        <User className="size-5" />
                      ) : (
                        <Users className="size-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground-strong">
                        {item.name}
                      </div>
                      {item.subtitle && (
                        <div className="text-sm text-foreground-weak">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    {/* Edit button shown on hover when not selected */}
                    {!isSelected && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectItem(item);
                        }}
                        aria-label="Edit item"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Pencil className="size-4 text-foreground-weak" />
                      </Button>
                    )}

                    {/* Show remove button only when item is selected (in edit mode) */}
                    {isSelected && showRemoveButton && onRemoveItem && (
                      <Popover
                        open={popoverOpenId === item.id}
                        onOpenChange={(open) => {
                          if (open) {
                            setPopoverOpenId(item.id);
                          } else {
                            setPopoverOpenId(null);
                          }
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            aria-label="Remove item"
                          >
                            <Trash className="size-4 text-destructive" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">Confirm Deletion</h4>
                            <p className="text-sm">
                              Are you sure you want to delete this item?
                            </p>
                            <div className="flex justify-end gap-2 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPopoverOpenId(null);
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPopoverOpenId(null);
                                  onRemoveItem(item.id);
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
