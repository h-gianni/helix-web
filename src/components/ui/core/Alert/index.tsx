import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const alertVariants = cva(
	'relative w-full rounded-lg border min-h-7 px-3.5 py-2.5 text-sm shadow-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-3.5 [&>svg]:top-3 [&>svg]:text-foreground [&>svg]:size-4 [&>svg~*]:pl-6',
	{
		variants: {
			variant: {
				default:
					'bg-background border-neutral-200 text-foreground border-border [&>svg]:text-neutral-foreground',
				primary:
					'bg-primary-50 border-primary-200 text-primary [&>svg]:text-primary-500',
				info: 'bg-info-50 border-info-200 text-info-foreground [&>svg]:text-info-foreground',
				destructive:
					'bg-destructive-50 border-destructive-200 text-destructive-foreground [&>svg]:text-destructive-foreground',
				warning:
					'bg-warning-50 border-warning-400 text-warning-800 [&>svg]:text-warning-700',
				success:
					'bg-success-50 border-success-400 text-success-800 [&>svg]:text-success-700',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
)

const Alert = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
	<div
		ref={ref}
		role="alert"
		className={cn(alertVariants({ variant }), className)}
		{...props}
	/>
))
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h5
		ref={ref}
		className={cn('font-bold leading-none tracking-tight py-1', className)}
		{...props}
	/>
))
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn('body-sm mt-1', className)} {...props} />
))
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
