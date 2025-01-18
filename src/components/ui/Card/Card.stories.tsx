import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardHeaderWithActions,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  type CardProps,
  type CardSize,
} from './index';
import React from 'react';

// Define story-specific args type
type StoryProps = {
  showTitle?: boolean;
  showDescription?: boolean;
  showFooter?: boolean;
  showHeaderActions?: boolean;
};

type CombinedProps = CardProps & StoryProps;

const meta: Meta<CombinedProps> = {
  title: 'Components/Card',
  component: Card as any,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    size: 'default',
    shadow: 'default',
    border: true,
    background: true,
    interactive: false,
    clickable: false,
    contentAlignment: 'default',
    showTitle: true,
    showDescription: false,
    showFooter: false,
    showHeaderActions: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'xl'],
      description: 'Size of the card padding and title',
      table: {
        category: 'Component',
        defaultValue: { summary: 'default' },
      },
    },
    shadow: {
      control: 'select',
      options: ['none', 'sm', 'default', 'lg', 'xl'],
      description: 'Shadow depth of the card',
      table: {
        category: 'Component',
      },
    },
    border: {
      control: 'boolean',
      description: 'Whether to show the card border',
      table: {
        category: 'Component',
      },
    },
    background: {
      control: 'boolean',
      description: 'Whether to show the card background',
      table: {
        category: 'Component',
      },
    },
    interactive: {
      control: 'boolean',
      description: 'Whether the card should have hover and active states',
      table: {
        category: 'Component',
      },
    },
    clickable: {
      control: 'boolean',
      description: 'Whether the card should be clickable (renders as a button)',
      table: {
        category: 'Component',
      },
    },
    contentAlignment: {
      control: 'radio',
      options: ['default', 'center'],
      description: 'Alignment of card content',
      table: {
        category: 'Component',
      },
    },
    showHeaderActions: {
      control: 'boolean',
      description: 'Show actions in card header',
      table: {
        category: 'Story Controls',
      },
    },
    showTitle: {
      control: 'boolean',
      description: 'Show card title (title size matches card size)',
      table: {
        category: 'Story Controls',
      },
    },
    showDescription: {
      control: 'boolean',
      description: 'Show card description',
      table: {
        category: 'Story Controls',
      },
    },
    showFooter: {
      control: 'boolean',
      description: 'Show card footer',
      table: {
        category: 'Story Controls',
      },
    },
  },
};

export default meta;

type Story = StoryObj<CombinedProps>;

const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
  console.log('Card clicked');
};

export const Default: Story = {
  render: function render(args: CombinedProps) {
    const { 
      showTitle, 
      showDescription, 
      showFooter, 
      showHeaderActions,
      clickable,
      size,
      shadow,
      border,
      background,
      interactive,
      contentAlignment
    } = args;
    
    const hasHeader = showTitle || showDescription;
    
    const renderHeader = () => {
      if (!hasHeader) return null;
      
      if (showHeaderActions) {
        return (
          <CardHeaderWithActions>
            <div className="flex justify-between items-start gap-[var(--space-xl)]">
              <div className='space-y-[var(--space-xs)]'>
                {showTitle && <CardTitle>Card Title ({size})</CardTitle>}
                {showDescription && <CardDescription>Card Description goes here</CardDescription>}
              </div>
              <div className="flex items-center justify-end">
                <div className="flex items-center gap-[var(--space)]">
                  Action
                </div>
              </div>
            </div>
          </CardHeaderWithActions>
        );
      }
      
      return (
        <CardHeader>
          {showTitle && <CardTitle>Card Title</CardTitle>}
          {showDescription && <CardDescription>Card Description goes here</CardDescription>}
        </CardHeader>
      );
    };
    
    const cardContent = (
      <>
        {renderHeader()}
        <CardContent>
          This is the main content area of the card. You can put any content here.
        </CardContent>
        {showFooter && (
          <CardFooter>
            <p className="text-muted">Footer actions</p>
          </CardFooter>
        )}
      </>
    );

    if (clickable) {
      return (
        <Card 
          className="w-full max-w-md"
          size={size}
          shadow={shadow}
          border={border}
          background={background}
          interactive={interactive}
          contentAlignment={contentAlignment}
          clickable={true}
          onClick={handleClick}
        >
          {cardContent}
        </Card>
      );
    }

    return (
      <Card 
        className="w-full max-w-md"
        size={size}
        shadow={shadow}
        border={border}
        background={background}
        interactive={interactive}
        contentAlignment={contentAlignment}
        clickable={false}
      >
        {cardContent}
      </Card>
    );
  },
};

export const AllSizes: Story = {
  render: function render(args: CombinedProps) {
    const sizes: CardSize[] = ['sm', 'default', 'lg', 'xl'];
    const { 
      showDescription, 
      showFooter, 
      clickable,
      shadow,
      border,
      background,
      interactive,
      contentAlignment
    } = args;
    
    return (
      <div className="space-y-4">
        {sizes.map((size) => {
          const cardContent = (
            <>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                {showDescription && (
                  <CardDescription>Description for {size} size card</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                Content for {size} size card
              </CardContent>
              {showFooter && (
                <CardFooter>
                  <p className="text-muted">Footer for {size} size card</p>
                </CardFooter>
              )}
            </>
          );

          if (clickable) {
            return (
              <Card
                key={size}
                className="w-full max-w-md"
                size={size}
                shadow={shadow}
                border={border}
                background={background}
                interactive={interactive}
                contentAlignment={contentAlignment}
                clickable={true}
                onClick={handleClick}
              >
                {cardContent}
              </Card>
            );
          }

          return (
            <Card
              key={size}
              className="w-full max-w-md"
              size={size}
              shadow={shadow}
              border={border}
              background={background}
              interactive={interactive}
              contentAlignment={contentAlignment}
              clickable={false}
            >
              {cardContent}
            </Card>
          );
        })}
      </div>
    );
  },
};