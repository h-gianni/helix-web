'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth/auth-store'
import { useSignIn, useSignUp } from '@clerk/nextjs'

// Core UI Components
import { Button } from '@/components/ui/core/Button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/core/Card'
import { Checkbox } from '@/components/ui/core/Checkbox'
import { Input } from '@/components/ui/core/Input'
import { Label } from '@/components/ui/core/Label'
import { Separator } from '@/components/ui/core/Separator'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/components/ui/core/Tabs'
import { Badge } from '@/components/ui/core/Badge'
import { Alert, AlertDescription } from '@/components/ui/core/Alert'

// Icons
import {
	Eye,
	EyeOff,
	Mail,
	Lock,
	User,
	Fingerprint,
	ShieldCheck,
	ArrowRight,
	AlertTriangle,
	Loader2,
} from 'lucide-react'

interface AuthenticationFormProps {
	activeTab?: 'signin' | 'signup'
}

// Custom Email Input Component
interface EmailInputProps {
	id: string
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	required?: boolean
	placeholder?: string
	label?: string
}

const EmailInput = ({
	id,
	value,
	onChange,
	required = true,
	placeholder = 'name@example.com',
	label = 'Email',
}: EmailInputProps) => {
	return (
		<div className="space-y-1.5">
			<div className="relative">
				<div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-dark">
					<Mail size={18} />
				</div>
				<Input
					id={id}
					type="email"
					className="pl-10"
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					required={required}
				/>
			</div>
		</div>
	)
}

// Custom Password Input Component
interface PasswordInputProps {
	id: string
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	required?: boolean
	placeholder?: string
	label?: string
	showStrengthIndicator?: boolean
	onStrengthChange?: (strength: number, feedback: string) => void
}

const PasswordInput = ({
	id,
	value,
	onChange,
	required = true,
	placeholder = '••••••••',
	label = 'Password',
	showStrengthIndicator = false,
	onStrengthChange,
}: PasswordInputProps) => {
	const [showPassword, setShowPassword] = useState(false)
	const [passwordStrength, setPasswordStrength] = useState(0)
	const [passwordFeedback, setPasswordFeedback] = useState('')

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const password = e.target.value
		onChange(e)

		if (showStrengthIndicator) {
			checkPasswordStrength(password)
		}
	}

	// Password strength checker
	const checkPasswordStrength = (password: string): void => {
		if (!password) {
			setPasswordStrength(0)
			setPasswordFeedback('')
			if (onStrengthChange) onStrengthChange(0, '')
			return
		}

		let strength = 0

		// Length check
		if (password.length >= 8) strength += 1

		// Character variety checks
		if (/[A-Z]/.test(password)) strength += 1
		if (/[a-z]/.test(password)) strength += 1
		if (/[0-9]/.test(password)) strength += 1
		if (/[^A-Za-z0-9]/.test(password)) strength += 1

		setPasswordStrength(strength)

		let feedback = ''
		// Feedback based on strength
		if (strength <= 2) {
			feedback = 'Weak password'
		} else if (strength <= 4) {
			feedback = 'Medium strength'
		} else {
			feedback = 'Strong password'
		}

		setPasswordFeedback(feedback)
		if (onStrengthChange) onStrengthChange(strength, feedback)
	}

	// Password strength indicator component
	const StrengthIndicator = () => {
		const getColor = (level: number): string => {
			if (passwordStrength >= level) {
				if (passwordStrength <= 2) return 'bg-destructive-base'
				if (passwordStrength <= 4) return 'bg-warning-base'
				return 'bg-success-base'
			}
			return 'bg-neutral-lighter'
		}

		return (
			<div className="space-y-1">
				<div className="flex gap-1">
					{[1, 2, 3, 4, 5].map((level) => (
						<div
							key={level}
							className={`h-1 w-full rounded-full transition-colors ${getColor(
								level
							)}`}
						/>
					))}
				</div>
				{passwordFeedback && (
					<p
						className={`text-xs ${
							passwordStrength <= 2
								? 'text-destructive-base'
								: passwordStrength <= 4
								? 'text-warning-base'
								: 'text-success-base'
						}`}
					>
						{passwordFeedback}
					</p>
				)}
			</div>
		)
	}

	return (
		<div className="space-y-1.5">
			<div className="relative">
				<div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-dark">
					<Lock size={18} />
				</div>
				<Input
					id={id}
					type={showPassword ? 'text' : 'password'}
					className="pl-10"
					placeholder={placeholder}
					value={value}
					onChange={handlePasswordChange}
					required={required}
				/>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
					onClick={() => setShowPassword(!showPassword)}
				>
					{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
				</Button>
			</div>
			{showStrengthIndicator && <StrengthIndicator />}
		</div>
	)
}

const AuthenticationForm = ({
	activeTab = 'signin',
}: AuthenticationFormProps) => {
	const router = useRouter()
	const { loading, error, isAuthenticated, setAuthError } = useAuthStore()
	const {
		isLoaded: isSignInLoaded,
		signIn,
		setActive: setActiveSignIn,
	} = useSignIn()
	const {
		isLoaded: isSignUpLoaded,
		signUp,
		setActive: setActiveSignUp,
	} = useSignUp()

	// State management
	const [passwordStrength, setPasswordStrength] = useState(0)
	const [passwordFeedback, setPasswordFeedback] = useState('')
	const [authMethod, setAuthMethod] = useState('password') // "password" or "passwordless"
	const [activeTabState, setActiveTabState] = useState<string>(activeTab)
	const [isLoading, setIsLoading] = useState(false)
	const [authError, setLocalAuthError] = useState<string | null>(null)
	const [verificationStep, setVerificationStep] = useState<'email' | 'code'>(
		'email'
	)
	const [verificationCode, setVerificationCode] = useState('')

	// Form fields
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [rememberMe, setRememberMe] = useState(false)
	const [agreeToTerms, setAgreeToTerms] = useState(false)

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			router.push('/dashboard')
		}
	}, [isAuthenticated, router])

	// Clear errors when switching tabs
	useEffect(() => {
		setLocalAuthError(null)
		setAuthError(null)
	}, [activeTabState, authMethod, setAuthError])

	// Handle password strength updates from the PasswordInput component
	const handlePasswordStrengthChange = (strength: number, feedback: string) => {
		setPasswordStrength(strength)
		setPasswordFeedback(feedback)
	}

	// Handle form submissions
	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!isSignInLoaded) return

		try {
			setIsLoading(true)
			setLocalAuthError(null)

			const result = await signIn.create({
				identifier: email,
				password,
			})

			if (result.status === 'complete') {
				await setActiveSignIn({ session: result.createdSessionId })
				router.push('/dashboard')
			} else {
				// Handle 2FA or other continuation requirements if needed
				setLocalAuthError('Additional verification needed')
			}
		} catch (err: any) {
			setLocalAuthError(
				err.errors?.[0]?.message || 'Failed to sign in. Please try again.'
			)
		} finally {
			setIsLoading(false)
		}
	}

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!isSignUpLoaded) return

		if (!agreeToTerms) {
			setLocalAuthError(
				'Please agree to the Terms of Service and Privacy Policy'
			)
			return
		}

		try {
			setIsLoading(true)
			setLocalAuthError(null)

			const result = await signUp.create({
				emailAddress: email,
				password,
				firstName,
				lastName,
			})

			if (result.status === 'complete') {
				await setActiveSignUp({ session: result.createdSessionId })
				router.push('/dashboard')
			} else {
				// Handle email verification or other continuation requirements if needed
				setLocalAuthError('Please check your email to verify your account')
			}
		} catch (err: any) {
			setLocalAuthError(
				err.errors?.[0]?.message ||
					'Failed to create account. Please try again.'
			)
		} finally {
			setIsLoading(false)
		}
	}

	const handlePasswordlessSignIn = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!isSignInLoaded) return

		try {
			setIsLoading(true)
			setLocalAuthError(null)

			const result = await signIn.create({
				strategy: 'email_code',
				identifier: email,
			})

			if (result.status === 'needs_first_factor') {
				setVerificationStep('code')
				setLocalAuthError(
					'Verification code sent! Check your email for the code'
				)
			} else {
				setLocalAuthError('Something went wrong. Please try again.')
			}
		} catch (err: any) {
			setLocalAuthError(
				err.errors?.[0]?.message ||
					'Failed to send verification code. Please try again.'
			)
		} finally {
			setIsLoading(false)
		}
	}

	const handleGoogleSignIn = async () => {
		if (!isSignInLoaded) return

		try {
			setIsLoading(true)
			setLocalAuthError(null)

			const result = await signIn.authenticateWithRedirect({
				strategy: 'oauth_google',
				redirectUrl: '/auth/callback',
				redirectUrlComplete: '/dashboard',
			})
		} catch (err: any) {
			setLocalAuthError(
				err.errors?.[0]?.message ||
					'Failed to sign in with Google. Please try again.'
			)
			setIsLoading(false)
		}
	}

	const handleGoogleSignUp = async () => {
		if (!isSignUpLoaded) return

		try {
			setIsLoading(true)
			setLocalAuthError(null)

			const result = await signUp.authenticateWithRedirect({
				strategy: 'oauth_google',
				redirectUrl: '/auth/callback',
				redirectUrlComplete: '/dashboard',
			})
		} catch (err: any) {
			setLocalAuthError(
				err.errors?.[0]?.message ||
					'Failed to sign up with Google. Please try again.'
			)
			setIsLoading(false)
		}
	}

	// Input with icon component
	interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
		icon: React.ElementType
	}

	const IconInput = ({ icon: Icon, ...props }: IconInputProps) => (
		<div className="relative">
			<div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-dark">
				<Icon size={18} />
			</div>
			<Input className="pl-10" {...props} />
		</div>
	)

	// Social login buttons
	const SocialLogins = () => (
		<div className="space-y-6">
			<h2 className="heading-3 text-center">
				{activeTabState === 'signin'
					? 'Sign in to JustScore'
					: 'Create a JustScore account'}
			</h2>

			<Button
				variant="outline"
				size="lg"
				className="w-full mb-3"
				onClick={
					activeTabState === 'signin' ? handleGoogleSignIn : handleGoogleSignUp
				}
				disabled={isLoading || !isSignInLoaded || !isSignUpLoaded}
			>
				<svg viewBox="0 0 24 24" className="h-5 w-5 mr-2">
					<path
						d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						fill="#4285F4"
					/>
					<path
						d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						fill="#34A853"
					/>
					<path
						d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						fill="#FBBC05"
					/>
					<path
						d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						fill="#EA4335"
					/>
				</svg>
				{isLoading ? (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<>Continue with Google</>
				)}
			</Button>

			<div className="grid grid-cols-2 gap-3 w-full mb-8">
				<Button
					variant="outline"
					size="lg"
					onClick={() =>
						setLocalAuthError('Twitter authentication coming soon')
					}
				>
					<svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
						<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
					</svg>
				</Button>
				<Button
					variant="outline"
					size="lg"
					onClick={() =>
						setLocalAuthError('LinkedIn authentication coming soon')
					}
				>
					<svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
						<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
					</svg>
				</Button>
			</div>

			<div className="flex items-center gap-2 w-full my-4">
				<Separator className="flex-1" />
				<span className="heading-upper px-2">OR via email</span>
				<Separator className="flex-1" />
			</div>
		</div>
	)

	const handleVerificationCodeSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!isSignInLoaded) return

		try {
			setIsLoading(true)
			setLocalAuthError(null)

			// Attempt to complete the sign-in with the verification code
			const result = await signIn.attemptFirstFactor({
				strategy: 'email_code',
				code: verificationCode,
			})

			if (result.status === 'complete') {
				await setActiveSignIn({ session: result.createdSessionId })
				router.push('/dashboard')
			} else {
				setLocalAuthError('Verification failed. Please try again.')
			}
		} catch (err: any) {
			setLocalAuthError(
				err.errors?.[0]?.message ||
					'Invalid verification code. Please try again.'
			)
		} finally {
			setIsLoading(false)
		}
	}

	// Reset function to go back to email input step
	const resetVerification = () => {
		setVerificationStep('email')
		setVerificationCode('')
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-lg">
			<div className="mb-6">
				<Tabs
					defaultValue={activeTab}
					value={activeTabState}
					onValueChange={setActiveTabState}
					size="lg"
					className="w-full"
				>
					<TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
						<TabsTrigger value="signin">Sign In</TabsTrigger>
						<TabsTrigger value="signup">Create Account</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{(authError || error) && (
				<Alert variant="destructive" className="mb-4">
					<AlertTriangle className="h-4 w-4" />
					<AlertDescription>{authError || error}</AlertDescription>
				</Alert>
			)}

			<Card className="border border-border-weak shadow-lg overflow-hidden flex flex-col">
				{/* Top Section - Authentication Forms */}
				<div className="p-6 md:p-8 bg-white">
					{activeTabState === 'signin' ? (
						// Sign In Content
						<div className="space-y-4">
							<SocialLogins />

							<Tabs
								defaultValue="password"
								value={authMethod}
								onValueChange={setAuthMethod}
								className="w-full"
							>
								<TabsList className="grid grid-cols-2 mb-6 w-full">
									<TabsTrigger
										value="password"
										className="flex items-center justify-center"
									>
										With Password
									</TabsTrigger>
									<TabsTrigger
										value="passwordless"
										className="flex items-center justify-center"
									>
										Passwordless
									</TabsTrigger>
								</TabsList>

								<TabsContent value="password" className="space-y-4">
									<form onSubmit={handleSignIn} className="space-y-4">
										<div className="space-y-1.5">
											<Label htmlFor="email-signin">Email</Label>
											<EmailInput
												id="email-signin"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												required
											/>
										</div>

										<div className="space-y-1.5">
											<div className="flex items-center justify-between">
												<Label htmlFor="password-signin">Password</Label>
											</div>
											<PasswordInput
												id="password-signin"
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												required
												showStrengthIndicator
												onStrengthChange={handlePasswordStrengthChange}
											/>
										</div>

										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-2">
												<Checkbox
													id="remember"
													checked={rememberMe}
													onCheckedChange={(checked) =>
														setRememberMe(checked as boolean)
													}
												/>
												<Label htmlFor="remember" className="text-sm">
													Remember me
												</Label>
											</div>
										</div>

										<Button
											variant="primary"
											className="w-full"
											size="lg"
											type="submit"
											disabled={isLoading || !isSignInLoaded}
										>
											{isLoading ? (
												<>
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													Signing in...
												</>
											) : (
												'Sign In'
											)}
										</Button>
									</form>

									<div className="flex justify-center">
										<Button variant="link" size="sm" className="p-0 text-xs">
											Forgot password?
										</Button>
									</div>
								</TabsContent>

								<TabsContent value="passwordless" className="space-y-2">
									<div className="text-center">
										<Badge variant="outline" className="mb-2">
											<Fingerprint size={14} className="mr-1" />
											Passwordless Authentication
										</Badge>
										{verificationStep === 'email' ? (
											<p className="body-sm">
												Enter your email to receive a secure verification code
											</p>
										) : (
											<p className="body-sm">
												Enter the verification code sent to {email}
											</p>
										)}
									</div>

									{verificationStep === 'email' ? (
										<form
											onSubmit={handlePasswordlessSignIn}
											className="space-y-4"
										>
											<div className="space-y-1.5">
												<Label htmlFor="email-passwordless">Email</Label>
												<EmailInput
													id="email-passwordless"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
													required
												/>
											</div>

											<Button
												variant="primary"
												className="w-full"
												size="lg"
												type="submit"
												disabled={isLoading || !isSignInLoaded}
											>
												{isLoading ? (
													<>
														<Loader2 className="mr-2 h-4 w-4 animate-spin" />
														Sending...
													</>
												) : (
													<>
														Send Verification Code
														<ArrowRight size={16} className="ml-2" />
													</>
												)}
											</Button>
										</form>
									) : (
										<form
											onSubmit={handleVerificationCodeSubmit}
											className="space-y-4"
										>
											<div className="space-y-1.5">
												<Label htmlFor="verification-code">
													Verification Code
												</Label>
												<div className="relative">
													<div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-dark">
														<Fingerprint size={18} />
													</div>
													<Input
														id="verification-code"
														className="pl-10"
														placeholder="Enter the 6-digit code"
														value={verificationCode}
														onChange={(e) =>
															setVerificationCode(e.target.value)
														}
														required
													/>
												</div>
											</div>

											<Button
												variant="primary"
												className="w-full"
												size="lg"
												type="submit"
												disabled={isLoading || !isSignInLoaded}
											>
												{isLoading ? (
													<>
														<Loader2 className="mr-2 h-4 w-4 animate-spin" />
														Verifying...
													</>
												) : (
													'Verify and Sign In'
												)}
											</Button>

											<div className="flex justify-center mt-2">
												<Button
													variant="link"
													size="sm"
													type="button"
													className="p-0 text-xs"
													onClick={resetVerification}
													disabled={isLoading}
												>
													Use a different email
												</Button>
											</div>
										</form>
									)}
								</TabsContent>
							</Tabs>
						</div>
					) : (
						// Sign Up Content
						<div className="space-y-4">
							<SocialLogins />

							<form onSubmit={handleSignUp} className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-1.5">
										<Label htmlFor="first-name">First name</Label>
										<IconInput
											id="first-name"
											placeholder="John"
											icon={User}
											value={firstName}
											onChange={(e) => setFirstName(e.target.value)}
										/>
									</div>
									<div className="space-y-1.5">
										<Label htmlFor="last-name">Last name</Label>
										<IconInput
											id="last-name"
											placeholder="Doe"
											icon={User}
											value={lastName}
											onChange={(e) => setLastName(e.target.value)}
										/>
									</div>
								</div>

								<div className="space-y-1.5">
									<Label htmlFor="email-signup">Email</Label>
									<EmailInput
										id="email-signup"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
								</div>

								<div className="space-y-1.5">
									<Label htmlFor="password-signup">Password</Label>
									<PasswordInput
										id="password-signup"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										showStrengthIndicator
										onStrengthChange={handlePasswordStrengthChange}
									/>
									<p className="text-xs text-muted-foreground mt-1">
										Use 8+ characters with a mix of letters, numbers & symbols
									</p>
								</div>

								<div className="space-y-2">
									<div className="flex items-center space-x-2">
										<Checkbox
											id="terms"
											checked={agreeToTerms}
											onCheckedChange={(checked) =>
												setAgreeToTerms(checked as boolean)
											}
										/>
										<Label htmlFor="terms" className="text-sm">
											I agree to the{' '}
											<Button
												variant="link"
												className="h-auto p-0"
												type="button"
											>
												Terms of Service
											</Button>{' '}
											and{' '}
											<Button
												variant="link"
												className="h-auto p-0"
												type="button"
											>
												Privacy Policy
											</Button>
										</Label>
									</div>
								</div>

								<Button
									variant="primary"
									className="w-full"
									size="lg"
									type="submit"
									disabled={
										isLoading || !isSignUpLoaded || passwordStrength < 3
									}
								>
									{isLoading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Creating account...
										</>
									) : (
										'Create Account'
									)}
								</Button>
							</form>
						</div>
					)}
				</div>

				{/* Bottom Section - Info */}
				<div className="bg-gradient-to-r from-info-darker to-info-darkest text-white p-6 md:p-8">
					<div className="">
						<div className="space-y-8">
							<div>
								<h5 className="heading-5 !text-white">Need assistance?</h5>
								<p className="body-sm">
									Contact our support team at support@example.com
								</p>
							</div>

							<div className="grid md:grid-cols-2 gap-6">
								<div className="flex items-start space-x-3">
									<ShieldCheck className="mt-1 flex-shrink-0" />
									<div className="space-y-1">
										<h3 className="heading-5 !text-white">Enhanced Security</h3>
										<p className="body-xs text-neutral-light">
											Your data is protected with industry-leading encryption.
										</p>
									</div>
								</div>
								<div className="flex items-start space-x-3">
									<Fingerprint className="mt-1 flex-shrink-0" />
									<div className="space-y-1">
										<h3 className="heading-5 !text-white">
											Passwordless Options
										</h3>
										<p className="body-xs text-neutral-light">
											Sign in quickly and securely with modern authentication
											methods.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Card>
		</div>
	)
}

export default AuthenticationForm
