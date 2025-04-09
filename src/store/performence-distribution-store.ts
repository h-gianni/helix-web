// src/hooks/usePerformanceDistribution.ts
import { useQuery } from '@tanstack/react-query';
import type { ApiResponse } from '@/lib/types/api';
import { apiClient } from '@/lib/api/api-client';


// src/lib/types/api/performance-distribution.ts

export interface PerformanceCategory {
    name: string;   // Category name (Star, Strong, Solid, Lower, Poor, Not Scored)
    value: number;  // Number of members in this category
    minRating?: number; // Min rating threshold (not included in API response)
    maxRating?: number; // Max rating threshold (not included in API response)
  }
  
  export interface PerformanceDistributionResponse {
    distribution: PerformanceCategory[];
  }


  export const performenceDistributionApi = {
    getPerformeneceDistribution: async ()=>{
        const {data} = await apiClient('/dashboard/performance-distribution')
        if (!data.success) throw new Error('Failed to fetch Performence Distribution');
    return data.data;
    }
  }

  export function usePerformanceDistribution () {
    return useQuery({
        queryKey: ['performanceDistribution'],
        queryFn: performenceDistributionApi.getPerformeneceDistribution,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }