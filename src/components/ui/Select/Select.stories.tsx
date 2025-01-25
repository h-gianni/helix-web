import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { cn } from "@/lib/utils"
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

interface ItemsRecord {
  [key: string]: IconItem;
}

const fruits: ItemsRecord = {
  apple: { icon: <Apple />, label: 'Apple' },
  banana: { icon: <Banana />, label: 'Banana' },
  citrus: { icon: <Citrus />, label: 'Citrus' },
  grape: { icon: <Grape />, label: 'Grape' }
};

const sizes: ItemsRecord = {
  xs: { icon: <User />, label: 'Extra Small' },
  s: { icon: <User />, label: 'Small' },
  m: { icon: <User />, label: 'Medium' },
  l: { icon: <User />, label: 'Large' },
  xl: { icon: <User />, label: 'Extra Large' },
};

const colors: ItemsRecord = {
  black: { icon: <Settings />, label: 'Black' },
  white: { icon: <Settings />, label: 'White' },
  blue: { icon: <Settings />, label: 'Blue' },
  red: { icon: <Settings />, label: 'Red' },
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
    },
    width: {
      control: 'radio',
      options: ['inline', 'full'],
      defaultValue: 'inline',
    },
    withLabel: {
      control: 'boolean',
      defaultValue: true,
    },
    label: {
      control: 'text',
    },
    withIcons: {
      control: 'boolean',
      defaultValue: true,
    },
    helperText: {
      control: 'text',
    },
    error: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
  },
  decorators: [
    (Story) => (
      <div className="min-w-[320px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Fruit Selection',
    helperText: 'Choose your favorite fruit',
    withLabel: true,
  },
  render: (args) => {
    const [value, setValue] = useState('apple');
    
    return (
      <Select 
        {...args}
        value={value} 
        onValueChange={setValue}
      >
        <SelectTrigger 
          withIcon={args.withIcons}
          icon={args.withIcons ? fruits[value]?.icon : undefined}
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
              >
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  },
};

// In StandaloneSelects story
export const StandaloneSelects: Story = {
  render: (args) => {
    const [values, setValues] = useState<Record<string, string>>({});
    
    return (
      <div className="flex flex-col space-y-4">
        {[
          { id: 'default', label: 'Default Select', error: false, disabled: false },
          { id: 'required', label: 'Required Select', error: false, disabled: false, required: true },
          { id: 'error', label: 'Error Select', error: true, disabled: false },
          { id: 'disabled', label: 'Disabled Select', error: false, disabled: true },
        ].map((config) => (
          <Select
            key={config.id}
            {...args}
            {...config}
            value={values[config.id] || ''}
            onValueChange={(value) => setValues(prev => ({ ...prev, [config.id]: value }))}
          >
            <SelectTrigger 
              withIcon={args.withIcons}
              icon={args.withIcons && values[config.id] ? fruits[values[config.id]]?.icon : undefined}
            >
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(fruits).map(([key, { icon, label }]) => (
                  <SelectItem 
                    key={key} 
                    value={key} 
                    withIcon={args.withIcons ? icon : undefined}
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ))}
      </div>
    );
  },
};

// In Sizes story
export const Sizes: Story = {
  render: (args) => {
    const [values, setValues] = useState<Record<string, string>>({});
    
    return (
      <div className="flex flex-col gap-4">
        {['sm', 'base', 'lg'].map((size) => (
          <Select
            key={size}
            {...args}
            size={size as 'sm' | 'base' | 'lg'}
            label={`${size} size select`}
            value={values[size] || ''}
            onValueChange={(value) => setValues(prev => ({ ...prev, [size]: value }))}
          >
            <SelectTrigger 
              withIcon={args.withIcons}
              icon={args.withIcons && values[size] ? fruits[values[size]]?.icon : undefined}
            >
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(fruits).map(([key, { icon, label }]) => (
                  <SelectItem 
                    key={key} 
                    value={key} 
                    withIcon={args.withIcons ? icon : undefined}
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ))}
      </div>
    );
  },
};

// In WithHelperText story
export const WithHelperText: Story = {
  render: (args) => {
    const [values, setValues] = useState<Record<string, string>>({
      default: '',
      error: '',
      required: ''
    });

    return (
      <div className="space-y-4">
        {[
          { id: 'default', label: 'Default Select', helperText: 'This is a helper text' },
          { id: 'error', label: 'Error Select', error: true, helperText: 'This field contains an error' },
          { id: 'required', label: 'Required Select', required: true, helperText: 'This field is required' }
        ].map((config) => (
          <Select
            key={config.id}
            {...args}
            {...config}
            value={values[config.id]}
            onValueChange={(value) => setValues(prev => ({ ...prev, [config.id]: value }))}
          >
            <SelectTrigger 
              withIcon={args.withIcons}
              icon={args.withIcons && values[config.id] ? fruits[values[config.id]]?.icon : undefined}
            >
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(fruits).map(([key, { icon, label }]) => (
                  <SelectItem 
                    key={key} 
                    value={key} 
                    withIcon={args.withIcons ? icon : undefined}
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ))}
      </div>
    );
  },
};

export const WithGroups: Story = {
  render: (args) => {
    const items = {
      fruits: {
        apple: { icon: <Home />, label: 'Apple' },
        orange: { icon: <Mail />, label: 'Orange' },
      },
      apps: {
        settings: { icon: <Settings />, label: 'Settings' },
        messages: { icon: <MessageSquare />, label: 'Messages' },
      }
    };
    
    const [value, setValue] = useState('');
    
    const selectedIcon = value 
      ? [...Object.values(items.fruits), ...Object.values(items.apps)]
          .find((_, index) => Object.keys({...items.fruits, ...items.apps})[index] === value)?.icon
      : undefined;

    return (
      <Select 
        {...args}
        value={value} 
        onValueChange={setValue}
        label="Grouped items"
        helperText="Select from different categories"
      >
        <SelectTrigger withIcon={args.withIcons} icon={args.withIcons ? selectedIcon : undefined}>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            {Object.entries(items.fruits).map(([key, { icon, label }]) => (
              <SelectItem 
                key={key} 
                value={key} 
                withIcon={args.withIcons ? icon : undefined}
              >
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Applications</SelectLabel>
            {Object.entries(items.apps).map(([key, { icon, label }]) => (
              <SelectItem 
                key={key} 
                value={key} 
                withIcon={args.withIcons ? icon : undefined}
              >
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  },
};

export const FormExample: Story = {
  render: (args) => {    
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');

    return (
      <form className="w-full max-w-sm space-y-4">
        <Select 
          {...args}
          value={size} 
          onValueChange={setSize}
          required
          label="T-shirt size"
          helperText="Select your preferred t-shirt size"
          width="full"
        >
          <SelectTrigger 
            withIcon={args.withIcons}
            icon={args.withIcons && size ? sizes[size]?.icon : undefined}
          >
            <SelectValue placeholder="Select a size" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Available sizes</SelectLabel>
              {Object.entries(sizes).map(([key, { icon, label }]) => (
                <SelectItem 
                  key={key} 
                  value={key} 
                  withIcon={args.withIcons ? icon : undefined}
                >
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select 
          {...args}
          value={color} 
          onValueChange={setColor}
          label="Color preference"
          width="full"
        >
          <SelectTrigger 
            withIcon={args.withIcons}
            icon={args.withIcons && color ? colors[color]?.icon : undefined}
          >
            <SelectValue placeholder="Select a color" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Colors</SelectLabel>
              {Object.entries(colors).map(([key, { icon, label }]) => (
                <SelectItem 
                  key={key} 
                  value={key} 
                  withIcon={args.withIcons ? icon : undefined}
                >
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