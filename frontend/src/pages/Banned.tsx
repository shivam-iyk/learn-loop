import { useEffect } from "react";
import useAppStore from "../store";
import { useCurrentUser } from "../hooks/auth";
import { Skeleton } from "@heroui/react";
import { useNavigate } from "react-router-dom";

function Banned() {
  const navigate = useNavigate();

  const { isLoading, isPending, data } = useCurrentUser();
  const { user } = useAppStore();

  useEffect(() => {
    if (isPending) return;
    if (data?.is_banned === false) {
      navigate("/home");
    }
  }, [isPending, data]);

  return (
    <div className="flex flex-col gap-6 py-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-outfit tracking-tighter">
          Account banned
        </h1>
        <p className="text-muted sm:text-lg">
          Your account has been suspended and you can no longer access
          LearnLoop.
        </p>
      </div>
      {!isLoading ? (
        <Skeleton className="w-full rounded-xl h-30" />
      ) : (
        <div className="flex flex-col gap-4 bg-surface p-4 border rounded-xl">
          <h4 className="text-2xl font-outfit tracking-tight font-semibold">
            Reason
          </h4>
          {user?.ban_reason}
        </div>
      )}
    </div>
  );
}

export default Banned;
