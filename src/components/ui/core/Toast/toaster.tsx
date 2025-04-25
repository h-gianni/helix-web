"use client"

import * as React from "react"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  ToastIcon,
} from "./toast"
import { useToast, ToastContextProps } from "./use-toast"

export function Toaster() {
  const { toasts } = useToast()
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  // Only render on the client to avoid hydration issues
  if (!isMounted) {
    return null
  }

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, variant, onOpenChange, ...props }) => (
        <Toast 
          key={id} 
          variant={variant} 
          onOpenChange={onOpenChange}
          {...props}
        >
          <div className="flex items-center gap-2">
            <ToastIcon variant={variant} />
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}