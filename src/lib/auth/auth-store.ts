// src/lib/auth/auth-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from '../api/api-client'

interface User {
	id: string
	email: string
	name?: string
	createdAt?: string
	updatedAt?: string
}

interface AuthState {
	user: User | null
	token: string | null
	loading: boolean
	error: string | null
	isAuthenticated: boolean

	signIn: (email: string, password: string) => Promise<void>
	signUp: (
		email: string,
		password: string,
		firstName?: string,
		lastName?: string
	) => Promise<void>
	signOut: () => void
	sendPasswordlessLink: (email: string) => Promise<void>
	setAuthError: (error: string | null) => void
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			token: null,
			loading: false,
			error: null,
			isAuthenticated: false,

			signIn: async (email: string, password: string) => {
				set({ loading: true, error: null })
				try {
					const response = await apiClient.post('/api/auth/signin', {
						email,
						password,
					})
					const { user, token } = response.data
					set({ user, token, isAuthenticated: true, loading: false })
				} catch (error: any) {
					set({
						error:
							error.response?.data?.error ||
							'Failed to sign in. Please try again.',
						loading: false,
					})
				}
			},

			signUp: async (
				email: string,
				password: string,
				firstName?: string,
				lastName?: string
			) => {
				set({ loading: true, error: null })
				try {
					const response = await apiClient.post('/api/auth/signup', {
						email,
						password,
						firstName,
						lastName,
					})
					const { user, token } = response.data
					set({ user, token, isAuthenticated: true, loading: false })
				} catch (error: any) {
					set({
						error:
							error.response?.data?.error ||
							'Failed to create account. Please try again.',
						loading: false,
					})
				}
			},

			signOut: () => {
				set({ user: null, token: null, isAuthenticated: false })
			},

			sendPasswordlessLink: async (email: string) => {
				set({ loading: true, error: null })
				try {
					await apiClient.post('/api/auth/passwordless', { email })
					set({ loading: false })
				} catch (error: any) {
					set({
						error:
							error.response?.data?.error ||
							'Failed to send login link. Please try again.',
						loading: false,
					})
				}
			},

			setAuthError: (error: string | null) => {
				set({ error })
			},
		}),
		{
			name: 'auth-storage', // Name for localStorage
			partialize: (state) => ({
				user: state.user,
				token: state.token,
				isAuthenticated: state.isAuthenticated,
			}),
		}
	)
)
