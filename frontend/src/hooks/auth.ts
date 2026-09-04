import { useQuery } from "@tanstack/react-query";
import { getUser } from "../services/user";
import type { UserI } from "../types/user";
import type { ApiError } from "../services/api";

export const useCurrentUser = () => {
  return useQuery<UserI, ApiError>({
    queryKey: ["user"],
    queryFn: getUser,
    retry: false,
  });
};
