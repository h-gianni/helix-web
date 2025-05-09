import { create } from "zustand";
import { apiClient } from "@/lib/api/api-client";
import type { ApiResponse } from "@/lib/types/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

// Define types for the modular API responses
interface ProfileData {
  id: string;
  email: string;
  name: string | null;
  subscription: {
    tier: string;
    startDate: string | null;
    endDate: string | null;
  };
  organization: {
    id: string;
    name: string;
  } | null;
  stats: {
    teamsOwned: number;
    teamsMember: number;
    activitiesCreated: number;
  };
  clerkProfile: {
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
    primaryEmail: string;
    title: string | null;
  };
  orgName?: { name: string }[]; // or whatever the actual type of orgName is
  createdAt: string;
  updatedAt: string;
  teams?: any[];
}

interface TeamsData {
  owned: OwnedTeam[];
  member: MemberTeam[];
}

interface OwnedTeam {
  id: string;
  name: string;
  description: string | null;
  teamFunctionId: string;
  teamFunction: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  memberCount: number;
  activityCount: number;
  isOwner: boolean;
}

interface MemberTeam {
  id: string;
  name: string;
  description: string | null;
  teamFunctionId: string;
  teamFunction: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  memberInfo: {
    id: string;
    title: string | null;
    isAdmin: boolean;
  };
  memberCount: number;
  activityCount: number;
}

interface SubscriptionData {
  subscription: {
    tier: string;
    startDate: string | null;
    endDate: string | null;
    daysRemaining: number | null;
    isActive: boolean;
    paymentDetails: any | null;
  };
  usage: {
    teams: UsageMetric;
    members: UsageMetric;
    actions: UsageMetric;
  };
  features: string[];
}

interface UsageMetric {
  current: number;
  limit: number | null;
  percentage: number;
}

interface ActivityData {
  id: string;
  name: string;
  description: string | null;
  priority: string;
  status: string;
  dueDate: string | null;
  teamId: string;
  teamName: string;
  category: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  ratingsCount: number;
}

// For backward compatibility with your existing code
interface UserProfile {
  id: string;
  email: string;
  name?: string;
  clerkId: string;
  subscriptionTier: string;
  subscriptionStart?: string;
  subscriptionEnd?: string;
  createdAt: string;
  updatedAt: string;
  customFields?: any;
  teamMembers: any[];
  teams: any[];
  createdActions: any[];
  orgName: { id: string; name: string }[];
  clerkProfile: {
    firstName: string;
    lastName: string;
    imageUrl: string;
    emailAddresses: any[];
  };
}

// API clients for each endpoint
const userApi = {
  getProfile: async (): Promise<ProfileData> => {
    const { data } = await apiClient.get<ApiResponse<ProfileData>>(
      "/user/profile"
    );
    if (!data.success) throw new Error(data.error || "Failed to fetch profile");
    return data.data ?? ({} as ProfileData);
  },

  getTeams: async (): Promise<TeamsData> => {
    const { data } = await apiClient.get<ApiResponse<TeamsData>>("/user/teams");
    if (!data.success) throw new Error(data.error || "Failed to fetch teams");
    return data.data ?? ({} as TeamsData);
  },

  getActivities: async (options?: {
    page?: number;
    limit?: number;
    teamId?: string;
    status?: string;
  }): Promise<ActivityData[]> => {
    const { page = 1, limit = 10, teamId, status } = options || {};

    let url = `/user/actions?page=${page}&limit=${limit}`;
    if (teamId) url += `&teamId=${teamId}`;
    if (status) url += `&status=${status}`;

    const { data } = await apiClient.get<ApiResponse<ActivityData[]>>(url);
    if (!data.success)
      throw new Error(data.error || "Failed to fetch activities");
    return data.data ?? [];
  },

  getSubscription: async (): Promise<SubscriptionData> => {
    const { data } = await apiClient.get<ApiResponse<SubscriptionData>>(
      "/user/subscription"
    );
    if (!data.success)
      throw new Error(data.error || "Failed to fetch subscription");
    return data.data ?? ({} as SubscriptionData);
  },

  updateProfile: async (profileData: {
    firstName?: string;
    lastName?: string;
    title?: string | null;
  }): Promise<any> => {
    const { data } = await apiClient.patch<ApiResponse<any>>(
      "/user/profile",
      profileData
    );
    if (!data.success)
      throw new Error(data.error || "Failed to update profile");
    return data.data;
  },

  updateOrgName: async (orgName: string): Promise<any> => {
    const { data } = await apiClient.patch<ApiResponse<any>>("/user/org-name", {
      name: orgName,
    });
    if (!data.success)
      throw new Error(data.error || "Failed to update organization name");
    return data.data;
  },
};

// React Query hooks
export const useProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: userApi.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserTeams = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["userTeams"],
    queryFn: userApi.getTeams,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useUserActivities = (options?: {
  enabled?: boolean;
  page?: number;
  limit?: number;
  teamId?: string;
  status?: string;
}) => {
  const { page, limit, teamId, status, enabled } = options || {};

  return useQuery({
    queryKey: ["userActivities", { page, limit, teamId, status }],
    queryFn: () => userApi.getActivities({ page, limit, teamId, status }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: enabled !== false, // Enable by default unless explicitly disabled
  });
};

export const useUserSubscription = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["userSubscription"],
    queryFn: userApi.getSubscription,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Update mutations
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export const useUpdateOrgName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.updateOrgName,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

// Zustand store for state management
interface ProfileStore {
  profile: ProfileData | null;
  orgName: string;
  isEditModalOpen: boolean;
  activeTab: string;
  setProfile: (profile: ProfileData | null) => void;
  setOrgName: (name: string) => void;
  setEditModalOpen: (isOpen: boolean) => void;
  setActiveTab: (tab: string) => void;
  initializeFromProfile: (profile: ProfileData) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  orgName: "",
  isEditModalOpen: false,
  activeTab: "profile",

  setProfile: (profile) => set({ profile }),
  setOrgName: (name) => set({ orgName: name }),
  setEditModalOpen: (isOpen) => set({ isEditModalOpen: isOpen }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  initializeFromProfile: (profile) => {
    let orgNameValue = "";

    if (profile.organization) {
      orgNameValue = profile.organization.name;
    }

    set({
      profile,
      orgName: orgNameValue,
    });
  },
}));

// For backward compatibility mapping new API to old structure
export function mapProfileToLegacyFormat(
  profileData: ProfileData
): UserProfile {
  return {
    id: profileData.id,
    email: profileData.email,
    name: profileData.name || undefined,
    clerkId: "", // Fill from other sources if available
    subscriptionTier: profileData.subscription.tier,
    subscriptionStart: profileData.subscription.startDate || undefined,
    subscriptionEnd: profileData.subscription.endDate || undefined,
    createdAt: profileData.createdAt,
    updatedAt: profileData.updatedAt,
    customFields: {},
    teamMembers: [], // Will be filled by team-specific calls
    teams: [], // Will be filled by team-specific calls
    createdActions: [], // Will be filled by activities-specific calls
    orgName: profileData.organization
      ? [
          {
            id: profileData.organization.id,
            name: profileData.organization.name,
            // createdAt: profileData.createdAt,
            // userId: profileData.id
          },
        ]
      : [],
    clerkProfile: {
      firstName: profileData.clerkProfile.firstName || "",
      lastName: profileData.clerkProfile.lastName || "",
      imageUrl: profileData.clerkProfile.imageUrl || "",
      emailAddresses: [{ emailAddress: profileData.clerkProfile.primaryEmail }],
    },
  };
}

// Helper hook to sync React Query data with Zustand store
export function useProfileSync() {
  const { data: profileData, isLoading, error } = useProfile();
  const { initializeFromProfile } = useProfileStore();

  useEffect(() => {
    if (profileData) {
      initializeFromProfile(profileData);
    }
  }, [profileData, initializeFromProfile]);

  return {
    profile: profileData ? mapProfileToLegacyFormat(profileData) : null,
    isLoading,
    error,
  };
}
