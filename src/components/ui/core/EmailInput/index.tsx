import * as React from "react";
import { Input } from "@/components/ui/core/Input";
import { Toggle } from "@/components/ui/core/Toggle";
import { Label } from "@/components/ui/core/Label";
import { cn } from "@/lib/utils";

export interface EmailInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  defaultDomain: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  inputSize?: "sm" | "base" | "lg" | "xl";
}

const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
  (
    {
      id,
      name,
      value = "",
      defaultDomain,
      onChange,
      placeholder = "Enter username",
      className = "",
      error,
      inputSize = "base",
      ...props
    },
    ref
  ) => {
    const [useCustomEmail, setUseCustomEmail] = React.useState(false);
    const [username, setUsername] = React.useState("");

    // Helper to check if email uses default domain
    const isDefaultDomainEmail = (email: string): boolean => {
      if (!email || !email.includes("@")) return true;
      const domainPart = email.split("@")[1];
      return domainPart.toLowerCase() === defaultDomain.toLowerCase();
    };

    // Helper to extract username from email
    const extractUsername = (email: string): string => {
      if (!email || !email.includes("@")) return email || "";
      return email.split("@")[0];
    };

    // Initialize component state from props
    React.useEffect(() => {
      const emailValue = value || "";

      // Clear internal state when value becomes empty
      if (!emailValue) {
        setUsername("");
        setUseCustomEmail(false);
        return;
      }

      if (typeof emailValue === "string") {
        if (emailValue.includes("@")) {
          const isDefaultDomain = isDefaultDomainEmail(emailValue);
          setUseCustomEmail(!isDefaultDomain);

          // Extract username if default domain, otherwise keep full value
          if (isDefaultDomain) {
            setUsername(extractUsername(emailValue));
          }
        } else {
          // No @ symbol, treat as username
          setUsername(emailValue);
          setUseCustomEmail(false);
        }
      }
    }, [value, defaultDomain]);

    // Handle toggling between custom email and username + domain
    const handleToggleCustomEmail = (pressed: boolean) => {
      setUseCustomEmail((prev) => {
        const newValue = pressed;
        const currentValue = value || "";

        if (newValue) {
          // When switching to custom, pre-populate with current username + domain
          const customEvent = {
            target: {
              name,
              value: username ? `${username}@${defaultDomain}` : "",
            },
          } as React.ChangeEvent<HTMLInputElement>;

          onChange(customEvent);
        } else {
          // When switching to domain mode, extract username
          const extractedUsername = extractUsername(
            typeof currentValue === "string" ? currentValue : ""
          );
          setUsername(extractedUsername);

          const newEvent = {
            target: {
              name,
              value: `${extractedUsername}@${defaultDomain}`,
            },
          } as React.ChangeEvent<HTMLInputElement>;

          onChange(newEvent);
        }

        return newValue;
      });
    };

    // Handle user input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (useCustomEmail) {
        // Pass through the full email value
        onChange(e);
      } else {
        // Store username locally and send combined value to parent
        const newUsername = e.target.value;
        setUsername(newUsername);

        const customEvent = {
          target: {
            name: e.target.name,
            value: `${newUsername}@${defaultDomain}`,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(customEvent);
      }
    };

    return (
      <div className="space-y-3">
        <div className="relative">
          {!useCustomEmail ? (
            <div className="relative">
              <Input
                id={id}
                name={name}
                value={username}
                onChange={handleInputChange}
                placeholder={placeholder}
                inputSize={inputSize}
                className={cn(
                  "pr-[calc(1rem+var(--domain-width))]",
                  error && "border-destructive focus-visible:ring-destructive",
                  className
                )}
                aria-invalid={!!error}
                ref={ref}
                {...props}
                style={
                  {
                    "--domain-width": `${defaultDomain.length * 0.6 + 1}rem`,
                  } as React.CSSProperties
                }
              />
              <span className="absolute right-3 text-muted-foreground pointer-events-none top-1/2 -translate-y-1/2">
                @{defaultDomain}
              </span>
            </div>
          ) : (
            <Input
              id={id}
              name={name}
              type="email"
              value={value}
              onChange={handleInputChange}
              placeholder="Enter full email address"
              className={cn(
                error && "border-destructive focus-visible:ring-destructive",
                className
              )}
              aria-invalid={!!error}
              ref={ref}
              inputSize={inputSize}
              {...props}
            />
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Toggle
            id={`${id}-toggle-custom`}
            pressed={useCustomEmail}
            onPressedChange={handleToggleCustomEmail}
            size="sm"
            variant="outline"
            className={cn(
              "bg-transparent",
              useCustomEmail && "text-primary border-primary"
            )}
            aria-label={
              useCustomEmail ? "Use default domain" : "Use custom email"
            }
          >
            {useCustomEmail ? "Custom" : "Default"}
          </Toggle>
          <Label
            htmlFor={`${id}-toggle-custom`}
            className="text-xs text-muted-foreground"
          >
            {useCustomEmail
              ? "Using custom email"
              : `Using ${defaultDomain} domain`}
          </Label>
        </div>
      </div>
    );
  }
);

EmailInput.displayName = "EmailInput";

export { EmailInput };
