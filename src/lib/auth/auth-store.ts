// src/lib/auth/auth-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
	id: string
	email: string
	name?: string
	createdAt?: string
	updatedAt?: string
}

interface AuthState {
	user: User | null
	loading: boolean
	error: string | null
	isAuthenticated: boolean
	setAuthError: (error: string | null) => void
	setUser: (user: User | null) => void
	setIsAuthenticated: (isAuthenticated: boolean) => void
	setLoading: (loading: boolean) => void
	reset: () => void
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			loading: false,
			error: null,
			isAuthenticated: false,

			setAuthError: (error: string | null) => {
				set({ error })
			},

			setUser: (user: User | null) => {
				set({ user })
			},

			setIsAuthenticated: (isAuthenticated: boolean) => {
				set({ isAuthenticated })
			},

			setLoading: (loading: boolean) => {
				set({ loading })
			},

			reset: () => {
				set({ user: null, isAuthenticated: false })
			},
		}),
		{
			name: 'auth-storage', // Name for localStorage
			partialize: (state) => ({
				user: state.user,
				isAuthenticated: state.isAuthenticated,
			}),
		}
	)
)
