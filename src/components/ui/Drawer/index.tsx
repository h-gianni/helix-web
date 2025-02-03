import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/Button"
import { X } from "lucide-react"

type Position = 'top' | 'right' | 'bottom' | 'left'
type Size = 'sm' | 'base' | 'lg' | 'xl'
type HeaderVariant = 'none' | 'base' | 'full'
type FooterVariant = 'none' | 'one-action' | 'two-actions'

interface ActionConfig extends Pick<ButtonProps, 'variant' | 'appearance' | 'isLoading'> {
  label: string
  onClick: () => void
}

interface FooterConfig {
  primaryAction?: ActionConfig
  secondaryAction?: ActionConfig
}

interface DrawerProps {
  position?: Position
  size?: Size
  header?: HeaderVariant
  withOverlay?: boolean
  footer?: FooterVariant
  footerConfig?: FooterConfig
  title?: string
  description?: string
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Drawer = ({
  position = 'right',
  // size = 'base',
  // header = 'base',
  // withOverlay = true,
  // footer = 'none',
  // footerConfig,
  // title,
  // description,
  children,
  ...props
}: DrawerProps) => (
  <DrawerPrimitive.Root 
    direction={position === 'top' ? 'top' : position === 'bottom' ? 'bottom' : position === 'left' ? 'left' : 'right'}
    {...props}
  >
    {children}
  </DrawerPrimitive.Root>
)

const DrawerTrigger = DrawerPrimitive.Trigger
const DrawerClose = DrawerPrimitive.Close
const DrawerPortal = DrawerPrimitive.Portal

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay> & {
    withOverlay?: boolean
  }
>(({ className, withOverlay = true, ...props }, ref) => {
  if (!withOverlay) return null;

  return (
    <DrawerPrimitive.Overlay
      ref={ref}
      className={cn("drawer-overlay", className)}
      {...props}
    />
  );
})
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

interface DrawerContentProps extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> {
  position?: Position
  size?: Size
  header?: HeaderVariant
  footer?: FooterVariant
  footerConfig?: FooterConfig
  title?: string
  description?: string
  withOverlay?: boolean
}

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  DrawerContentProps
>(({
  className,
  position = 'right',
  size = 'base',
  header = 'base',
  footer = 'none',
  footerConfig,
  title,
  description,
  withOverlay = true,
  children,
  ...props
}, ref) => (
  <DrawerPortal>
    <DrawerOverlay withOverlay={withOverlay} />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "drawer-content",
        // Remove default Vaul animations
        "!duration-300 !transition-transform",
        className
      )}
      data-position={position}
      data-size={size}
      style={{
        // Override Vaul's transform with our own based on position
        transform: undefined,
        transition: 'transform 300ms ease-in-out'
      }}
      {...props}
    >
      {position === 'bottom' && <div className="drawer-handle" />}
      
      {header !== 'none' && (
        <div className="drawer-header">
          <div className="space-y-1.5">
            {(header === 'base' || header === 'full') && title && (
              <h2 className="drawer-title">{title}</h2>
            )}
            {header === 'full' && description && (
              <p className="drawer-description">{description}</p>
            )}
          </div>
          <DrawerClose className="drawer-close">
            <X />
            <span className="sr-only">Close</span>
          </DrawerClose>
        </div>
      )}

      <div className="drawer-body">{children}</div>

      {footer !== 'none' && (
        <div className="drawer-footer">
          {footer === 'two-actions' && footerConfig?.secondaryAction && (
            <Button
              variant={footerConfig.secondaryAction.variant || 'neutral'}
              appearance={footerConfig.secondaryAction.appearance || 'text'}
              isLoading={footerConfig.secondaryAction.isLoading}
              onClick={footerConfig.secondaryAction.onClick}
            >
              {footerConfig.secondaryAction.label || 'Cancel'}
            </Button>
          )}
          {footerConfig?.primaryAction && (
            <Button
              variant={footerConfig.primaryAction.variant || 'primary'}
              appearance={footerConfig.primaryAction.appearance || 'strong'}
              isLoading={footerConfig.primaryAction.isLoading}
              onClick={footerConfig.primaryAction.onClick}
            >
              {footerConfig.primaryAction.label || 'Confirm'}
            </Button>
          )}
        </div>
      )}
    </DrawerPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = DrawerPrimitive.Content.displayName

export {
  type DrawerProps,
  type FooterConfig,
  type ActionConfig,
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
}