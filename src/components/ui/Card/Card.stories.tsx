import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './index';
import React from 'react';

// Define story-specific args type
type StoryProps = {
  showTitle?: boolean;
  showDescription?: boolean;
  showFooter?: boolean;
  showHeaderActions?: boolean;
};

type CardSize = 'sm' | 'base' | 'lg' | 'xl';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: CardSize;
  shadow?: 'none' | 'sm' | 'base' | 'lg' | 'xl';
  noBorder?: boolean;
  noBackground?: boolean;
  interactive?: boolean;
  clickable?: boolean;
  align?: 'left' | 'center';
}

type CombinedProps = CardProps & StoryProps;

const meta: Meta<CombinedProps> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    size: 'base',
    shadow: 'base',
    noBorder: false,
    noBackground: false,
    interactive: false,
    clickable: false,
    align: 'left',
    showTitle: true,
    showDescription: false,
    showFooter: false,
    showHeaderActions: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg', 'xl'],
      description: 'Size of the card padding and title',
      table: {
        category: 'Component',
        defaultValue: { summary: 'base' },
      },
    },
    shadow: {
      control: 'select',
      options: ['none', 'sm', 'base', 'lg', 'xl'],
      description: 'Shadow depth of the card',
      table: {
        category: 'Component',
      },
    },
    noBorder: {
      control: 'boolean',
      description: 'Remove card border',
      table: {
        category: 'Component',
      },
    },
    noBackground: {
      control: 'boolean',
      description: 'Remove card background',
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
    align: {
      control: 'radio',
      options: ['left', 'center'],
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

const handleClick = () => {
  console.log('Card clicked');
};

export const Default: Story = {
  render: function render(args: CombinedProps) {
    const { 
      showTitle, 
      showDescription, 
      showFooter, 
      showHeaderActions,
      size,
      ...cardProps
    } = args;
    
    const hasHeader = showTitle || showDescription;
    
    const renderHeader = () => {
      if (!hasHeader) return null;
      
      return (
        <CardHeader data-has-actions={showHeaderActions}>
          <div className={showHeaderActions ? "flex justify-between items-start gap-xl" : undefined}>
            <div className={showHeaderActions ? "flex flex-col gap-xs" : undefined}>
              {showTitle && <CardTitle data-size={size}>Card Title ({size})</CardTitle>}
              {showDescription && (
                <CardDescription data-variant="helper">
                  Card Description goes here
                </CardDescription>
              )}
            </div>
            {showHeaderActions && (
              <div className="flex items-center gap-base">
                Action
              </div>
            )}
          </div>
        </CardHeader>
      );
    };
    
    const cardContent = (
      <>
        {renderHeader()}
        <CardContent data-variant="base">
          This is the main content area of the card. You can put any content here.
        </CardContent>
        {showFooter && (
          <CardFooter data-color="neutral-weak">
            <p className="ui-text" data-color="muted">Footer actions</p>
          </CardFooter>
        )}
      </>
    );

    return (
      <Card 
        className="w-full max-w-md"
        {...cardProps}
        data-size={size}
        onClick={cardProps.clickable ? handleClick : undefined}
      >
        {cardContent}
      </Card>
    );
  },
};

export const AllSizes: Story = {
  render: function render(args: CombinedProps) {
    const sizes: CardSize[] = ['sm', 'base', 'lg', 'xl'];
    const { 
      showDescription, 
      showFooter,
      ...cardProps
    } = args;
    
    return (
      <div className="space-y-base">
        {sizes.map((size) => (
          <Card
            key={size}
            className="w-full max-w-md"
            {...cardProps}
            data-size={size}
            onClick={cardProps.clickable ? handleClick : undefined}
          >
            <CardHeader>
              <CardTitle data-size={size}>Card Title</CardTitle>
              {showDescription && (
                <CardDescription data-variant="helper">
                  Description for {size} size card
                </CardDescription>
              )}
            </CardHeader>
            <CardContent data-variant={size === 'sm' ? 'small' : 'base'}>
              Content for {size} size card
            </CardContent>
            {showFooter && (
              <CardFooter data-color="neutral-weak">
                <p className="ui-text" data-color="muted">
                  Footer for {size} size card
                </p>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    );
  },
};