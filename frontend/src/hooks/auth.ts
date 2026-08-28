import { useQuery } from "@tanstack/react-query";
import { getUser } from "../services/auth";
import type { UserI } from "../types/user";

export const useCurrentUser = () => {
  return useQuery<UserI>({
    queryKey: ["user"],
    queryFn: getUser,
    retry: false,
  });
};
