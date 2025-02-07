import type { Meta, StoryObj } from '@storybook/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './index';
import { Button } from '@/components/ui/core/Button';
import { Info, HelpCircle, Settings, Plus } from 'lucide-react';

const meta = {
  title: 'Core/Tooltip',
  component: TooltipProvider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    delayDuration: 0,
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof TooltipProvider>;

export default meta;
type Story = StoryObj<typeof TooltipProvider>;

// Basic tooltip
export const Basic: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button iconOnly leadingIcon={<Info />} aria-label="Info" />
      </TooltipTrigger>
      <TooltipContent>
        Helpful information
      </TooltipContent>
    </Tooltip>
  ),
};

// Tooltip positions
export const Positions: Story = {
  render: () => (
    <div className="flex gap-4 items-center justify-center">
      {(['top', 'right', 'bottom', 'left'] as const).map((position) => (
        <Tooltip key={position}>
          <TooltipTrigger asChild>
            <Button iconOnly leadingIcon={<HelpCircle />} aria-label={`Help ${position}`} />
          </TooltipTrigger>
          <TooltipContent side={position} align="center">
            Tooltip on {position}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

// Tooltip with different alignments
export const Alignments: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['start', 'center', 'end'] as const).map((alignment) => (
        <Tooltip key={alignment}>
          <TooltipTrigger asChild>
            <Button>Align {alignment}</Button>
          </TooltipTrigger>
          <TooltipContent side="right" align={alignment}>
            Aligned to {alignment}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

// Tooltip with different content styles
export const ContentStyles: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button iconOnly leadingIcon={<Settings />} aria-label="Settings" />
        </TooltipTrigger>
        <TooltipContent>
          Basic tooltip
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button iconOnly leadingIcon={<Plus />} aria-label="Add" />
        </TooltipTrigger>
        <TooltipContent className="bg-primary text-primary-foreground">
          Custom styled tooltip
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button iconOnly leadingIcon={<Info />} aria-label="Info" />
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>With icon</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// Tooltip with different triggers
export const DifferentTriggers: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          Button tooltip
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-sm underline cursor-help">
            Help text
          </span>
        </TooltipTrigger>
        <TooltipContent>
          Helpful information about this text
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="p-2 border rounded cursor-help">
            Custom element
          </div>
        </TooltipTrigger>
        <TooltipContent>
          Tooltip for custom element
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// Tooltip with delay duration
export const WithDelay: Story = {
  render: () => (
    <TooltipProvider delayDuration={500}>
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Delayed tooltip</Button>
          </TooltipTrigger>
          <TooltipContent>
            Shows after 500ms
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};