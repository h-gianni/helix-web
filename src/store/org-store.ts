import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useQuery, QueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/api-client";

const queryClient = new QueryClient();

// Define the organization API response type to match the actual structure
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
  loading: boolean;
  error: string | null;
  setOrganizations: (
    organizations: OrgSetupResponse["data"]["organizations"]
  ) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshOrgData: () => void;
}

// API function to fetch organization setup data
export const orgApi = {
  getOrgSetup: async (): Promise<OrgSetupResponse> => {
    const { data } = await apiClient.get<OrgSetupResponse>("/org");
    if (!data.success)
      throw new Error("Failed to fetch organization setup data");
    return data;
  },
};

// Create the organization store
export const useOrgStore = create<OrgState>()(
  persist(
    (set) => ({
      organizations: [],
      loading: false,
      error: null,

      setOrganizations: (organizations) => set({ organizations }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      refreshOrgData: () => {
        queryClient.invalidateQueries({ queryKey: ["orgSetup"] });
      },
    }),
    {
      name: "org-store",
    }
  )
);

// React Query hook for fetching organization setup data
export function useOrgSetup() {
  const setOrganizations = useOrgStore((state) => state.setOrganizations);
  const setLoading = useOrgStore((state) => state.setLoading);
  const setError = useOrgStore((state) => state.setError);

  return useQuery({
    queryKey: ["orgSetup"],
    queryFn: orgApi.getOrgSetup,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: (data) => {
      setOrganizations(data.data.organizations);
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : "Unknown error");
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}
