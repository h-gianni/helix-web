import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup, RadioGroupItem } from "./index";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    error: {
      control: "boolean",
      description: "Sets the error state of the radio group",
    },
    disabled: {
      control: "boolean",
      description: "Disables the entire radio group",
    },
    orientation: {
      control: "radio",
      options: ["vertical", "horizontal"],
      description: "Layout orientation of the radio group",
      defaultValue: "vertical",
    },
    variant: {
      control: "radio",
      options: ["default", "blocks", "compact"],
      description: "Visual style variant of the radio group",
      defaultValue: "default",
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof RadioGroup>;

const options = [
  {
    value: "option-1",
    label: "Default option",
    description: "Perfect for individuals and small projects",
  },
  {
    value: "option-2",
    label: "Alternative choice",
    description: "Advanced features for professionals",
  },
  {
    value: "option-3",
    label: "Third selection",
    description: "Custom solutions for large organizations",
  },
];

// Default example with all controls
export const Default: Story = {
  args: {
    variant: "default",
    orientation: "vertical",
    error: false,
    disabled: false,
  },
  render: (args) => {
    const getContainerStyles = () => {
      if (args.orientation === "horizontal") {
        if (args.variant === "default") {
          return "w-auto";
        }
        return "w-auto min-w-[800px]";
      }
      return "w-[320px]";
    };

    const getRadioGroupStyles = () => {
      if (args.orientation === "horizontal") {
        switch (args.variant) {
          case "default":
            return "radio-group-base";
          case "blocks":
            return "radio-group-blocks-horizontal";
          case "compact":
            return "radio-group-compact-horizontal";
          default:
            return "";
        }
      }
      return "";
    };

    const getItemStyles = () => {
      if (
        args.orientation === "horizontal" &&
        (args.variant === "blocks" || args.variant === "compact")
      ) {
        return "";
      }
      return "";
    };

    return (
      <div className={getContainerStyles()}>
        <RadioGroup
          defaultValue="option-1"
          className={getRadioGroupStyles()}
          {...args}
        >
          {options.map((option) =>
            args.variant === "default" ? (
              <RadioGroupItem
                key={option.value}
                value={option.value}
                id={`default-${option.value}`}
                aria-invalid={args.error}
                label={option.label}
              />
            ) : (
              <div key={option.value} className={getItemStyles()}>
                <RadioGroupItem
                  variant={args.variant}
                  value={option.value}
                  id={`default-${option.value}`}
                  label={option.label}
                  description={option.description}
                  aria-invalid={args.error}
                  className={cn(
                    args.variant === "compact" &&
                      args.orientation === "horizontal" && [
                        "radio-label-wrapper-compact-horizontal",
                      ]
                  )}
                />
              </div>
            )
          )}
        </RadioGroup>
      </div>
    );
  },
};

// Different states example
export const States: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-heading-4">Default State</h3>
        <RadioGroup defaultValue="option-1">
          {options.map((option) => (
            <RadioGroupItem
              key={option.value}
              value={option.value}
              id={`states-default-${option.value}`}
              label={option.label}
            />
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <h3 className="text-heading-4">Error State</h3>
        <RadioGroup defaultValue="option-1" error>
          {options.map((option) => (
            <RadioGroupItem
              key={option.value}
              value={option.value}
              id={`states-error-${option.value}`}
              label={option.label}
              aria-invalid
            />
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <h3 className="text-heading-4">Disabled State</h3>
        <RadioGroup defaultValue="option-1" disabled>
          {options.map((option) => (
            <RadioGroupItem
              key={option.value}
              value={option.value}
              id={`states-disabled-${option.value}`}
              label={option.label}
              disabled
            />
          ))}
        </RadioGroup>
      </div>
    </div>
  ),
};

// Variants example
export const Variants: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-heading-4">Default Variant</h3>
        <RadioGroup defaultValue="option-1" variant="default">
          {options.map((option) => (
            <RadioGroupItem
              key={option.value}
              value={option.value}
              id={`variants-default-${option.value}`}
              label={option.label}
            />
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <h3 className="text-heading-4">Blocks Variant</h3>
        <RadioGroup defaultValue="option-1" variant="blocks">
          {options.map((option) => (
            <RadioGroupItem
              key={option.value}
              value={option.value}
              id={`variants-blocks-${option.value}`}
              variant="blocks"
              label={option.label}
              description={option.description}
            />
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <h3 className="text-heading-4">Compact Variant</h3>
        <RadioGroup defaultValue="option-1" variant="compact">
          {options.map((option) => (
            <RadioGroupItem
              key={option.value}
              value={option.value}
              id={`variants-compact-${option.value}`}
              variant="compact"
              label={option.label}
              description={option.description}
            />
          ))}
        </RadioGroup>
      </div>
    </div>
  ),
};

const pricingPlans = [
  {
    id: "startup",
    title: "Startup",
    price: "$29",
    period: "per month",
    features: ["Up to 5 users", "Basic support", "10GB storage"],
  },
  {
    id: "business",
    title: "Business",
    price: "$99",
    period: "per month",
    features: ["Up to 20 users", "Priority support", "50GB storage"],
  },
  {
    id: "enterprise",
    title: "Enterprise",
    price: "Custom",
    period: "pricing",
    features: ["Unlimited users", "24/7 support", "Custom storage"],
  },
];

export const WithPricing: Story = {
  args: {
    variant: "blocks",
    orientation: "vertical",
    error: false,
    disabled: false,
  },
  render: (args) => {
    const getContainerStyles = () => {
      if (args.orientation === "horizontal") {
        return "w-auto min-w-[900px]";
      }
      return "w-[400px]";
    };

    const getRadioGroupStyles = () => {
      if (args.orientation === "horizontal") {
        switch (args.variant) {
          case "blocks":
            return "radio-group-blocks-horizontal";
          case "compact":
            return "radio-group-compact-horizontal";
          default:
            return "";
        }
      }
      return "";
    };

    return (
      <div className={getContainerStyles()}>
        <RadioGroup
          defaultValue="startup"
          className={getRadioGroupStyles()}
          {...args}
        >
          {pricingPlans.map((plan) => (
            <div key={plan.id} className="">
              <RadioGroupItem
                variant={args.variant}
                value={plan.id}
                id={`pricing-${plan.id}`}
                aria-invalid={args.error}
                className={cn(
                  args.variant === "compact" &&
                    args.orientation === "horizontal" && [
                      "radio-label-wrapper-compact-horizontal",
                    ]
                )}
                label={
                  <div className="flex gap-md justify-between items-start mt-0.5">
                    <div className="flex flex-col">
                      <div>{plan.title}</div>
                      <ul className="mt-2 list-disc list-small text-foreground">
                        {plan.features.map((feature, index) => (
                          <li
                            key={index}
                          >
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col justify-end">
                      <span className="text-lg font-semibold leading-none text-right text-primary">
                        {plan.price}
                      </span>
                      <span className="text-sm font-normal text-right text-weak">
                        {" "}
                        {plan.period}
                      </span>
                    </div>
                  </div>
                }
              ></RadioGroupItem>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  },
};

// Horizontal layout example
export const HorizontalLayout: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-heading-4">Default Horizontal</h3>
        <RadioGroup defaultValue="option-1" orientation="horizontal">
          {options.map((option) => (
            <RadioGroupItem
              key={option.value}
              value={option.value}
              id={`horizontal-default-${option.value}`}
              label={option.label}
            />
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <h3 className="text-heading-3">Blocks Horizontal</h3>
        <RadioGroup
          defaultValue="option-1"
          variant="blocks"
          orientation="horizontal"
          className="radio-group-blocks-horizontal"
        >
          {options.map((option) => (
            <RadioGroupItem
              key={option.value}
              value={option.value}
              id={`horizontal-blocks-${option.value}`}
              variant="blocks"
              label={option.label}
              description={option.description}
            />
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <h3 className="text-heading-3">Compact Horizontal</h3>
        <RadioGroup
          defaultValue="option-1"
          variant="compact"
          orientation="horizontal"
        >
          {options.map((option) => (
            <RadioGroupItem
              key={option.value}
              value={option.value}
              id={`horizontal-compact-${option.value}`}
              variant="compact"
              label={option.label}
              description={option.description}
            />
          ))}
        </RadioGroup>
      </div>
    </div>
  ),
};

// Required state example
export const Required: Story = {
  render: () => (
    <div className="w-[320px]">
      <RadioGroup defaultValue="option-1">
        {options.map((option) => (
          <RadioGroupItem
            key={option.value}
            value={option.value}
            id={`required-${option.value}`}
            label={option.label}
            required
          />
        ))}
      </RadioGroup>
    </div>
  ),
};
