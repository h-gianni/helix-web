// app/dashboard/onboarding/page.tsx
'use client'

import { Loader } from '@/components/ui/core/Loader'
import { useSetupStore } from '@/store/setup-store'
import { useRouter } from 'next/navigation'
import { useLayoutEffect } from 'react'

export default function OnboardingLandingPage() {
	const router = useRouter()
	const isSetupComplete = useSetupStore((state) => state.isSetupComplete)

	useLayoutEffect(() => {
		if (isSetupComplete()) {
			router.replace('/dashboard')
			return
		}

		router.replace('/dashboard/onboarding/intro')
	}, [router, isSetupComplete])

	return (
		<div className="flex flex-col items-center justify-center min-h-[50vh]">
			<Loader size="lg" />
			<p className="mt-4 text-foreground-weak">
				Preparing your onboarding experience...
			</p>
		</div>
	)
}
