// src/hooks/useSetupStateSync.ts
import { useEffect } from 'react'
import { useConfigStore } from '@/store/config-store'
import { useTeams } from '@/store/team-store'
import { usePerformers } from '@/store/performers-store'

// Helper function to set a cookie
function setCookie(name: string, value: string, days: number = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;samesite=strict${location.protocol === 'https:' ? ';secure' : ''}`
}

export function useSetupStateSync() {
  const config = useConfigStore((state) => state.config)
  const { data: teams = [] } = useTeams()
  const { data: performers = [] } = usePerformers()
  
  useEffect(() => {
    // Don't run on server side
    if (typeof window === 'undefined') return
    
    // Gather required info about setup state
    const setupState = {
      organizationName: config?.organization?.name || '',
      hasActivities: Object.keys(config?.activities?.selectedByCategory || {}).length > 0,
      hasTeams: teams.length > 0,
      hasPerformers: performers.length > 0
    }
    
    // Store in localStorage for client-side access
    localStorage.setItem('setup-state', JSON.stringify(setupState))
    
    // Also store in cookie for middleware access
    setCookie('setup-state', JSON.stringify(setupState))
  }, [config, teams, performers])
}