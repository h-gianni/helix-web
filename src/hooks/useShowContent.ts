// src/hooks/useShowContent.ts
import { usePerformers } from "@/store/performers-store";

export const useShowContent = () => {
  const { data: performers = [] } = usePerformers();
  return performers.length > 0;
};