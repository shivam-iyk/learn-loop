import { Alert, Button, toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { becomeInstructor } from "../services/user";
import { useNavigate } from "react-router-dom";
import useBoundStore from "../store";
import type { UserI } from "../types/user";

function UpgradeAlert() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { becomeInstructor: upgradeRoleToInstructor } = useBoundStore();

  const becomeInstructorMutation = useMutation({
    mutationFn: () => becomeInstructor(),
    onSuccess: () => {
      upgradeRoleToInstructor();
      navigate("/dashboard");
      queryClient.setQueryData(["user"], (old: UserI) => {
        if (!old) return;
        return { ...old, role: "instructor" };
      });
    },
    onError: (error) => {
      toast.danger(error.message);
    },
  });

  const handleUpgrade = () => {
    becomeInstructorMutation.mutate();
  };

  return (
    <Alert
      status="accent"
      className="bg-accent-soft dark:border dark:border-accent-soft"
    >
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title className="font-outfit font-bold text-lg tracking-tight">
          Are you an instructor?
        </Alert.Title>
        <Alert.Description>
          Start creating and publishing courses on LearnLoop. This action is
          irreversible.
        </Alert.Description>
        <Button
          size="sm"
          variant="primary"
          className="mt-2 sm:hidden"
          onClick={handleUpgrade}
        >
          Continue
        </Button>
      </Alert.Content>
      <Button
        size="sm"
        variant="primary"
        className="hidden sm:block"
        onClick={handleUpgrade}
      >
        Continue
      </Button>
    </Alert>
  );
}

export default UpgradeAlert;
