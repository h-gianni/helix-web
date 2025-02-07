import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './index';
import { addDays } from "date-fns";
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

const meta = {
  title: 'Core/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A calendar component built on top of react-day-picker with custom styling.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof Calendar>;

// Single Selection
export const SingleSelect: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    
    return (
      <div className="rounded-md border">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
        />
      </div>
    );
  },
};

// Range Selection
export const RangeSelect: Story = {
  render: function Render() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(),
      to: addDays(new Date(), 7),
    });
    
    return (
      <div className="rounded-md border">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={2}
        />
      </div>
    );
  },
};

// With Default Selected Date
export const WithDefaultDate: Story = {
  render: function Render() {
    const defaultDate = new Date();
    const disabledDays = { before: defaultDate };
    
    return (
      <div className="rounded-md border">
        <Calendar
          mode="single"
          disabled={disabledDays}
          defaultMonth={defaultDate}
          selected={defaultDate}
        />
      </div>
    );
  },
};

// Multiple Months
export const MultipleMonths: Story = {
  render: () => (
    <div className="rounded-md border">
      <Calendar
        mode="single"
        numberOfMonths={2}
        defaultMonth={new Date()}
        className="p-0"
      />
    </div>
  ),
};

// Custom Styling
export const CustomStyling: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    
    return (
      <div className="rounded-md border">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          classNames={{
            day_selected: cn(
              "bg-blue-500 text-white hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white"
            ),
            day_today: cn(
              "bg-orange-100 text-orange-900"
            )
          }}
        />
      </div>
    );
  },
};

// Without Outside Days
export const WithoutOutsideDays: Story = {
  render: () => (
    <div className="rounded-md border">
      <Calendar
        mode="single"
        showOutsideDays={false}
      />
    </div>
  ),
};

// Date Range with Preview
export const DateRangeWithPreview: Story = {
  render: function Render() {
    const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({
      from: new Date(),
      to: undefined,
    });

    return (
      <div className="rounded-md border">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={selectedRange?.from || new Date()}
          selected={selectedRange}
          onSelect={setSelectedRange}
          numberOfMonths={2}
        />
      </div>
    );
  },
};

// With Disabled Dates
export const WithDisabledDates: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const disabledDates = [
      { from: addDays(new Date(), 5), to: addDays(new Date(), 10) },
    ];
    
    return (
      <div className="rounded-md border">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={disabledDates}
          initialFocus
        />
      </div>
    );
  },
};

// Week Starts on Monday
export const WeekStartsMonday: Story = {
  render: () => (
    <div className="rounded-md border">
      <Calendar
        mode="single"
        weekStartsOn={1}
        defaultMonth={new Date()}
      />
    </div>
  ),
};