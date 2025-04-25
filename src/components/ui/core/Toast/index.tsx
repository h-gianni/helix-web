"use client";

// Re-export with proper handling of types
import { 
  ToastProps, 
  ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastIcon
} from "./toast";

import { useToast, ToastContextProps } from "./use-toast";
import { Toaster } from "./toaster";

// Export everything with their proper names
export {
  type ToastProps,
  type ToastActionElement,
  type ToastContextProps,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastIcon,
  useToast,
  Toaster
};