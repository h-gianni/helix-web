"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DayPickerProps } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/core/Button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("calendar-container", className)}
      classNames={{
        months: "calendar-months",
        month: "calendar-month",
        caption: "calendar-caption",
        caption_label: "calendar-caption-label",
        nav: "calendar-nav",
        nav_button: cn(
          "ui-button",
          {
            'data-variant': 'neutral-soft',
            'data-size': 'sm',
            'data-shape': 'rounded'
          },
          "calendar-nav-button"
        ),
        nav_button_previous: "calendar-nav-button-prev",
        nav_button_next: "calendar-nav-button-next",
        table: "calendar-table",
        head_row: "calendar-head-row",
        head_cell: "calendar-head-cell",
        row: "calendar-row",
        cell: cn(
          "calendar-cell",
          props.mode === "range" ? "calendar-cell-range" : ""
        ),
        day: cn(
          "ui-button",
          {
            'data-variant': 'neutral-soft',
            'data-size': 'sm',
            'data-shape': 'rounded'
          },
          "calendar-day"
        ),
        day_selected: "calendar-day-selected",
        day_today: "calendar-day-today",
        day_outside: "calendar-day-outside",
        day_disabled: "calendar-day-disabled",
        day_range_middle: "calendar-day-range-middle",
        day_hidden: "calendar-day-hidden",
        ...classNames,
      }}
      components={{
        IconLeft: () => (
          <ChevronLeft className="calendar-icon" />
        ),
        IconRight: () => (
          <ChevronRight className="calendar-icon" />
        ),
      } as DayPickerProps['components']}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };