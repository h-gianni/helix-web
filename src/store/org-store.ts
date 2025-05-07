import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/api-client";
import React from "react";

// Type definitions (as you had before)
export interface OrgSetupResponse {
  success: boolean;
  data: {
    organizations: Array<{
      id: string;
      name: string;
      siteDomain: string;
      teams: Array<{
        id: string;
        name: string;
        description: string | null;
        teamMembers: Array<{
          user: {
            id: string;
            name: string;
            email: string;
          };
        }>;
      }>;
    }>;
  };
}

export interface OrgState {
  organizations: OrgSetupResponse["data"]["organizations"];
  selectedOrgId: string | null;

  // Actions
  setOrganizations: (
    organizations: OrgSetupResponse["data"]["organizations"]
  ) => void;
  setSelectedOrgId: (id: string | null) => void;
  refreshOrgData: () => void;

  // Selectors
  getCurrentOrg: () => OrgSetupResponse["data"]["organizations"][0] | undefined;
  getOrgById: (
    id: string
  ) => OrgSetupResponse["data"]["organizations"][0] | undefined;
  getOrgTeams: (orgId?: string) => any[] | undefined;
}

// API function
export const orgApi = {
  getOrgSetup: async (): Promise<OrgSetupResponse> => {
    const { data } = await apiClient.get<OrgSetupResponse>("/org");
    if (!data.success)
      throw new Error("Failed to fetch organization setup data");
    return data;
  },
};

// Create the Zustand store
export const useOrgStore = create<OrgState>()(
  persist(
    (set, get) => ({
      organizations: [],
      selectedOrgId: null,

      // Actions
      setOrganizations: (organizations) => set({ organizations }),
      setSelectedOrgId: (id) => set({ selectedOrgId: id }),
      refreshOrgData: () => {
        // This will be implemented by the useOrgSetup hook
        // to avoid direct dependencies on react-query in the store
      },

      // Selectors
      getCurrentOrg: () => {
        const { organizations, selectedOrgId } = get();
        return selectedOrgId
          ? organizations.find((org) => org.id === selectedOrgId)
          : undefined;
      },

      getOrgById: (id) => {
        const { organizations } = get();
        return organizations.find((org) => org.id === id);
      },

      getOrgTeams: () => {
        const { organizations, selectedOrgId } = get();

        const org = organizations[0];
        return org?.teams;
      },
    }),
    {
      name: "org-store",
    }
  )
);

// React Query hook that updates Zustand
export function useOrgSetup() {
  const queryClient = useQueryClient();
  const setOrganizations = useOrgStore((state) => state.setOrganizations);

  // Implement the refreshOrgData function
  useOrgStore.setState({
    refreshOrgData: () => {
      queryClient.invalidateQueries({ queryKey: ["orgSetup"] });
    },
  });

  const query = useQuery({
    queryKey: ["orgSetup"],
    queryFn: orgApi.getOrgSetup,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  React.useEffect(() => {
    if (query.data) {
      setOrganizations(query.data.data.organizations);
    }
  }, [query.data, setOrganizations]);
  return query;
}
