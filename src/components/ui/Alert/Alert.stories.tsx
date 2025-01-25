import type { Meta, StoryObj } from '@storybook/react';
import {
  Alert,
  AlertIconContainer,
  AlertContent,
  AlertTitle,
  AlertDescription,
} from './index';
import {
  AlertCircle,
  Bell,
  TriangleAlert,
  XOctagon,
  HelpCircle,
  CheckCircle,
  CircleCheckBig,
} from 'lucide-react';

const iconMap = {
  AlertCircle,
  Bell,
  TriangleAlert,
  OctagonX: XOctagon,
  CircleHelp: HelpCircle,
  CircleCheck: CheckCircle,
  CircleCheckBig: CircleCheckBig,
} as const;

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'danger', 'warning', 'success'],
      defaultValue: 'default',
      description: 'The visual style of the alert',
    },
    size: {
      control: 'select',
      options: ['sm', 'base'],
      defaultValue: 'base',
      description: 'The size of the alert',
    },
    fullWidth: {
      control: 'boolean',
      defaultValue: false,
      description: 'Whether the alert should take full width of its container',
    },
    icon: {
      options: Object.keys(iconMap),
      control: { type: 'select' },
      defaultValue: 'AlertCircle',
      description: 'The icon to display in the alert',
    },
    withTitle: {
      control: 'boolean',
      defaultValue: true,
      description: 'Whether to show the title',
    },
    withDescription: {
      control: 'boolean',
      defaultValue: true,
      description: 'Whether to show the description',
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof Alert>;

export const Configurator: Story = {
  render: ({ variant = 'default', size = 'base', fullWidth = false, icon = 'AlertCircle', withTitle = true, withDescription = true }) => {
    const IconComponent = iconMap[icon as keyof typeof iconMap];
    
    return (
      <div className="w-[800px] p-4 rounded">
        <Alert 
          variant={variant} 
          size={size}
          fullWidth={fullWidth}
        >
          <AlertIconContainer>
            <IconComponent />
          </AlertIconContainer>
          <AlertContent>
            <div>
              {withTitle && (
                <AlertTitle>
                  {variant.charAt(0).toUpperCase() + variant.slice(1)} Alert
                </AlertTitle>
              )}
              {withDescription && (
                <AlertDescription>
                  {fullWidth ? 'This alert takes full width of its container.' : 'This alert width fits its content.'}
                  {' '}{size === 'sm' ? 'Small size.' : 'Base size.'} Using {icon} icon.
                </AlertDescription>
              )}
            </div>
          </AlertContent>
        </Alert>
      </div>
    );
  }
};

export const WidthExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[800px] p-4 rounded">
      <Alert fullWidth={true}>
        <AlertIconContainer>
          <AlertCircle />
        </AlertIconContainer>
        <AlertContent>
          <div>
            <AlertTitle>Full Width Alert</AlertTitle>
            <AlertDescription>
              This alert takes up the full width of its container.
            </AlertDescription>
          </div>
        </AlertContent>
      </Alert>

      <Alert fullWidth={false}>
        <AlertIconContainer>
          <AlertCircle />
        </AlertIconContainer>
        <AlertContent>
          <div>
            <AlertTitle>Fit Content Width Alert</AlertTitle>
            <AlertDescription>
              This alert width fits its content.
            </AlertDescription>
          </div>
        </AlertContent>
      </Alert>
    </div>
  ),
};

export const VariantExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[800px]">
      {(['default', 'primary', 'danger', 'warning', 'success'] as const).map((variant) => (
        <Alert key={variant} variant={variant} fullWidth={true}>
          <AlertIconContainer>
            <AlertCircle />
          </AlertIconContainer>
          <AlertContent>
            <div>
              <AlertTitle>{variant.charAt(0).toUpperCase() + variant.slice(1)} Alert</AlertTitle>
              <AlertDescription>
                This is a {variant} alert example.
              </AlertDescription>
            </div>
          </AlertContent>
        </Alert>
      ))}
    </div>
  ),
};

export const SizeExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[800px]">
      {(['base', 'sm'] as const).map((size) => (
        <Alert key={size} size={size} fullWidth={false}>
          <AlertIconContainer>
            <AlertCircle />
          </AlertIconContainer>
          <AlertContent>
            <div>
              <AlertTitle>{size.toUpperCase()} Size Alert</AlertTitle>
              <AlertDescription>
                This is a {size} size alert example with fit content width.
              </AlertDescription>
            </div>
          </AlertContent>
        </Alert>
      ))}
    </div>
  ),
};