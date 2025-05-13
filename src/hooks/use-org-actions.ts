import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OrgAction } from '@/lib/types/org-actions';

export function useOrgActions(orgId: string) {
  return useQuery({
    queryKey: ['orgActions', orgId],
    queryFn: async () => {
      const response = await fetch(`/api/org/global-actions?orgId=${orgId}`);
      if (!response.ok) throw new Error('Failed to fetch actions');
      return response.json();
    },
    enabled: !!orgId,
  });
}

export function useUpdateOrgActions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orgId, actions }: { orgId: string; actions: any[] }) => {
      const response = await fetch('/api/org/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId, actions }),
      });
      
      if (!response.ok) throw new Error('Failed to update actions');
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orgActions', variables.orgId] });
    },
  });
}
