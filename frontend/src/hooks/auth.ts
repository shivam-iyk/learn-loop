import { useQuery } from "@tanstack/react-query";
import { getUser } from "../services/user";
import type { UserI } from "../types/user";
import type { ApiError } from "../services/api";

export const useCurrentUser = () => {
  return useQuery<UserI, ApiError>({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: 15 * 1000 * 60, // 15 minutes
    retry: false,
    refetchOnWindowFocus: false,
  });
};
