"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { Button } from "../Button";

type ModalSize = "sm" | "base" | "lg" | "full";

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-lg h-[60vh]",
  base: "max-w-2xl h-[75vh]",
  lg: "max-w-4xl h-[90vh]",
  full: "w-full h-full max-w-full",
};

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const ModalContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titleId?: string;
  descriptionId?: string;
  setTitleId?: (id: string) => void;
  setDescriptionId?: (id: string) => void;
}>({
  open: false,
  onOpenChange: () => {},
});

const Modal = ({ open, onOpenChange, children }: ModalProps) => {
  const [titleId, setTitleId] = React.useState<string | undefined>();
  const [descriptionId, setDescriptionId] = React.useState<
    string | undefined
  >();

  // Event handler for ESC key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onOpenChange]);

  // Set body overflow when modal is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <ModalContext.Provider
      value={{
        open,
        onOpenChange,
        titleId,
        descriptionId,
        setTitleId: (id) => setTitleId(id),
        setDescriptionId: (id) => setDescriptionId(id),
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ModalSize;
  fixed?: boolean;
}

const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  ({ children, size = "base", fixed = false, className, ...props }, ref) => {
    const { open, onOpenChange, titleId, descriptionId } =
      React.useContext(ModalContext);
    const [isMounted, setIsMounted] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(false);

    // Handle client-side rendering
    React.useEffect(() => {
      setIsMounted(true);

      const checkMobile = () => {
        setIsMobile(window.innerWidth < 640);
      };

      checkMobile();
      window.addEventListener("resize", checkMobile);

      return () => {
        window.removeEventListener("resize", checkMobile);
      };
    }, []);

    // On mobile, always use full size and fixed layout
    const modalSize = isMobile ? "full" : size;
    const isFixed = isMobile ? true : fixed;

    // Close when clicking the overlay
    const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onOpenChange(false);
      }
    };

    if (!isMounted || !open) return null;

    return createPortal(
      <div
        role="dialog"
        aria-modal={true}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={handleOverlayClick}
      >
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/80 transition-opacity animate-in fade-in-0"
          aria-hidden="true"
        />

        {/* Modal */}
        <div
          ref={ref}
          className={cn(
            "relative bg-white shadow-lg z-50 transition-all",
            "animate-in fade-in-0 zoom-in-95",
            modalSize === "full" || isMobile ? "fixed inset-0" : "w-full my-4",
            !isMobile && modalSize !== "full" && "rounded-xl",
            sizeClasses[modalSize],
            isFixed && "flex flex-col",
            className
          )}
          {...props}
        >
          {/* Close button - always visible */}
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            icon
            aria-label="Close"
            className="absolute right-2 top-2 z-30"
          >
            <X />
          </Button>

          {isFixed ? (
            <>
              {/* Header with frosted glass effect */}
              <div className="sticky top-0 z-10 p-4 border-b-0">
                {React.Children.toArray(children).find(
                  (child) =>
                    React.isValidElement(child) && child.type === ModalHeader
                )}
              </div>

              <div className="overflow-y-auto flex-1 relative">
                <div className="p-4">
                  {React.Children.toArray(children).filter(
                    (child) =>
                      React.isValidElement(child) &&
                      child.type !== ModalHeader &&
                      child.type !== ModalFooter
                  )}
                </div>
              </div>

              {/* Footer with frosted glass effect */}
              <div className="sticky bottom-0 z-10 bg-white/50 backdrop-blur-md border-t-0 p-0">
                {React.Children.toArray(children).find(
                  (child) =>
                    React.isValidElement(child) && child.type === ModalFooter
                )}
              </div>
            </>
          ) : (
            <div className="h-full overflow-y-auto p-6">{children}</div>
          )}
        </div>
      </div>,
      document.body
    );
  }
);
ModalContent.displayName = "ModalContent";

const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
));
ModalHeader.displayName = "ModalHeader";

const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex gap-4 justify-end", className)}
    {...props}
  />
));
ModalFooter.displayName = "ModalFooter";

const ModalTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const { setTitleId } = React.useContext(ModalContext);
  const id = React.useId();

  const idRef = React.useRef<string | undefined>(undefined);

  React.useEffect(() => {
    if (!idRef.current) {
      idRef.current = id;
      setTitleId?.(id);
    }

    return () => {
      if (idRef.current === id) {
        setTitleId?.("");
      }
    };
  }, [id, setTitleId]);

  return (
    <h2 ref={ref} id={id} className={cn("heading-2", className)} {...props} />
  );
});
ModalTitle.displayName = "ModalTitle";

const ModalDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { setDescriptionId } = React.useContext(ModalContext);
  const id = React.useId();

  const idRef = React.useRef<string | undefined>(undefined);

  React.useEffect(() => {
    if (!idRef.current) {
      idRef.current = id;
      setDescriptionId?.(id);
    }

    return () => {
      if (idRef.current === id) {
        setDescriptionId?.("");
      }
    };
  }, [id, setDescriptionId]);

  return (
    <p ref={ref} id={id} className={cn("body-base", className)} {...props} />
  );
});
ModalDescription.displayName = "ModalDescription";

export {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  type ModalSize,
};
