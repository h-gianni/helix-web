import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectValue,
} from './index';
import { 
  User, 
  Home,
  Mail, 
  Settings, 
  MessageSquare,
  Apple,
  Banana,
  Citrus,
  Grape 
} from 'lucide-react';

interface IconItem {
  icon: React.ReactNode;
  label: string;
}

interface GroupedItems {
  fruits: Record<string, IconItem>;
  apps: Record<string, IconItem>;
}

const fruits: Record<string, IconItem> = {
  apple: { icon: <Apple className="size-4" />, label: 'Apple' },
  banana: { icon: <Banana className="size-4" />, label: 'Banana' },
  citrus: { icon: <Citrus className="size-4" />, label: 'Citrus' },
  grape: { icon: <Grape className="size-4" />, label: 'Grape' }
};

const sizes: Record<string, IconItem> = {
  xs: { icon: <User className="size-4" />, label: 'Extra Small' },
  s: { icon: <User className="size-4" />, label: 'Small' },
  m: { icon: <User className="size-4" />, label: 'Medium' },
  l: { icon: <User className="size-4" />, label: 'Large' },
  xl: { icon: <User className="size-4" />, label: 'Extra Large' },
};

const colors: Record<string, IconItem> = {
  black: { icon: <Settings className="size-4" />, label: 'Black' },
  white: { icon: <Settings className="size-4" />, label: 'White' },
  blue: { icon: <Settings className="size-4" />, label: 'Blue' },
  red: { icon: <Settings className="size-4" />, label: 'Red' },
};

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    size: 'base',
    width: 'inline',
    withLabel: true,
    withIcons: true,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
      defaultValue: 'base',
      description: 'Size of the select component',
    },
    width: {
      control: 'radio',
      options: ['inline', 'full'],
      defaultValue: 'inline',
      description: 'Width of the select component',
    },
    withLabel: {
      control: 'boolean',
      description: 'Whether to show a label above the select',
      defaultValue: true,
    },
    label: {
      control: 'text',
      description: 'Label text (requires withLabel to be true)',
    },
    withIcons: {
      control: 'boolean',
      description: 'Whether to show icons in the select options',
      defaultValue: true,
    },
    helperText: {
      control: 'text',
      description: 'Helper text below the select',
    },
    error: {
      control: 'boolean',
      description: 'Sets the error state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the select',
    },
    required: {
      control: 'boolean',
      description: 'Makes the select required',
    },
    triggerClassName: {
      control: 'text',
      description: 'Additional classes to apply to the trigger element',
    }
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('apple');
    
    return (
      <div className="min-w-[320px]">
        <Select 
          value={value} 
          onValueChange={setValue}
          withLabel={false}
        >
          <SelectTrigger icon={fruits[value]?.icon}>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.entries(fruits).map(([key, { icon, label }]) => (
                <SelectItem key={key} value={key} withIcon={icon}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  },
};

export const Configurator: Story = {
  args: {
    size: 'base',
    width: 'inline',
    withLabel: true,
    label: 'Select an option',
    withIcons: true,
    helperText: 'Choose from the available options',
    error: false,
    disabled: false,
    required: false,
    triggerClassName: '',
  },
  render: function Render(args) {
    const [value, setValue] = React.useState<string>('');
    
    return (
      <div className={args.width === 'full' ? 'w-[500px]' : 'min-w-[320px]'}>
        <Select 
          {...args}
          value={value} 
          onValueChange={setValue}
        >
          <SelectTrigger 
            error={args.error}
            size={args.size}
            className={args.triggerClassName}
          >
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.entries(fruits).map(([key, { icon, label }]) => (
                <SelectItem 
                  key={key} 
                  value={key}
                  withIcon={args.withIcons ? icon : undefined}
                  size={args.size}
                >
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  }
};

export const Widths: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="w-[500px] p-4 border rounded">
        <p className="mb-4 text-sm text-neutral-500">Inline width (default)</p>
        <Select
          withLabel
          label="Inline select"
          width="inline"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {[1, 2, 3].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  Option {num}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="w-[500px] p-4 border rounded">
        <p className="mb-4 text-sm text-neutral-500">Full width</p>
        <Select
          withLabel
          label="Full width select"
          width="full"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {[1, 2, 3].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  Option {num}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="w-[800px] p-4 border rounded">
        <p className="mb-4 text-sm text-neutral-500">Full width in larger container</p>
        <Select
          withLabel
          label="Full width select"
          width="full"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {[1, 2, 3].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  Option {num}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {['sm', 'base', 'lg'].map((size) => (
        <div key={size} className="min-w-[320px]">
          <Select
            withLabel
            label={`${size} size`}
            size={size as 'sm' | 'base' | 'lg'}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[1, 2, 3].map((num) => (
                  <SelectItem 
                    key={num} 
                    value={num.toString()} 
                    size={size as 'sm' | 'base' | 'lg'}
                    withIcon={<Settings className="size-4" />}
                  >
                    Option {num}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  ),
};

export const WithGroups: Story = {
  render: (args) => {
    const items: GroupedItems = {
      fruits: {
        apple: { icon: <Home className="size-4" />, label: 'Apple' },
        orange: { icon: <Mail className="size-4" />, label: 'Orange' },
      },
      apps: {
        settings: { icon: <Settings className="size-4" />, label: 'Settings' },
        messages: { icon: <MessageSquare className="size-4" />, label: 'Messages' },
      }
    };
    
    const [value, setValue] = useState('');
    
    const selectedIcon = value 
      ? [...Object.values(items.fruits), ...Object.values(items.apps)]
          .find((_, index) => Object.keys({...items.fruits, ...items.apps})[index] === value)?.icon
      : undefined;

    return (
      <div className="min-w-[320px]">
        <Select 
          {...args} 
          value={value} 
          onValueChange={setValue}
          withLabel
          label="Grouped items"
          helperText="Select from different categories"
        >
          <SelectTrigger icon={selectedIcon}>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel size={args.size}>Fruits</SelectLabel>
              {Object.entries(items.fruits).map(([key, { icon, label }]) => (
                <SelectItem key={key} value={key} withIcon={icon} size={args.size}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel size={args.size}>Applications</SelectLabel>
              {Object.entries(items.apps).map(([key, { icon, label }]) => (
                <SelectItem key={key} value={key} withIcon={icon} size={args.size}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  },
};

export const States: Story = {
  render: () => {
    const icons = {
      '1': <Settings className="size-4" />,
      '2': <Mail className="size-4" />,
      '3': <User className="size-4" />,
    };

    return (
      <div className="space-y-8">
        {[
          { id: 'normal', label: 'Normal state', error: false, disabled: false },
          { id: 'error', label: 'Error state', error: true, disabled: false },
          { id: 'disabled', label: 'Disabled state', error: false, disabled: true },
          { id: 'required', label: 'Required state', error: false, disabled: false, required: true },
        ].map((state) => (
          <div key={state.id} className="min-w-[320px]">
            <Select
              withLabel
              label={state.label}
              error={state.error}
              disabled={state.disabled}
              required={state.required}
              helperText={
                state.error ? "Please select an option" :
                state.disabled ? "This field is currently disabled" :
                state.required ? "This field is required" :
                undefined
              }
            >
              <SelectTrigger error={state.error}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.entries(icons).map(([value, icon]) => (
                    <SelectItem key={value} value={value} withIcon={icon}>
                      Option {value}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    );
  },
};

export const FormExample: Story = {
  render: (args) => {    
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');

    return (
      <form className="w-full max-w-sm space-y-6">
        <Select 
          value={size} 
          onValueChange={setSize}
          required
          withLabel
          label="T-shirt size"
          helperText="Select your preferred t-shirt size"
          width="full"
        >
          <SelectTrigger 
            size={args.size}
            icon={size ? sizes[size]?.icon : undefined}
          >
            <SelectValue placeholder="Select a size" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel size={args.size}>Available sizes</SelectLabel>
              {Object.entries(sizes).map(([key, { icon, label }]) => (
                <SelectItem key={key} value={key} withIcon={icon} size={args.size}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select 
          value={color} 
          onValueChange={setColor}
          withLabel
          label="Color preference"
          width="full"
        >
          <SelectTrigger 
            size={args.size}
            icon={color ? colors[color]?.icon : undefined}
          >
            <SelectValue placeholder="Select a color" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel size={args.size}>Colors</SelectLabel>
              {Object.entries(colors).map(([key, { icon, label }]) => (
                <SelectItem key={key} value={key} withIcon={icon} size={args.size}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </form>
    );
  },
};

export const LongList: Story = {
  render: (args) => {
    const [value, setValue] = React.useState('');
    return (
      <div className="min-w-[320px]">
        <Select 
          value={value} 
          onValueChange={setValue}
          withLabel
          label="Select country"
          helperText="Scroll through the list to find your country"
        >
          <SelectTrigger 
            size={args.size}
            icon={value ? <Settings className="size-4" /> : undefined}
          >
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            <SelectGroup>
              <SelectLabel size={args.size}>Countries</SelectLabel>
              {Array.from({ length: 50 }, (_, i) => {
                const countryValue = `country-${i + 1}`;
                return (
                  <SelectItem 
                    key={countryValue} 
                    value={countryValue} 
                    size={args.size}
                    withIcon={<Settings className="size-4" />}
                  >
                    Country {i + 1}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  },
};