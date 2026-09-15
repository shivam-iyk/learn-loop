import { Button, Modal, toast, Tooltip } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash } from "lucide-react";
import { discardDraft } from "../services/courses";
import type { Course } from "../types/course";
import type { ApiError } from "../services/api";
import useAppStore from "../store";

function DiscardDraftModal({ courseId }: { courseId: number }) {
  const queryClient = useQueryClient();

  const { courses, setCourses } = useAppStore();

  const discardDraftMutation = useMutation<Course, ApiError>({
    mutationFn: () => discardDraft(courseId),
    onSuccess: (data) => {
      queryClient.setQueryData(["courses"], (oldData: Course[]) =>
        oldData.filter((item) => item.id !== courseId),
      );
      setCourses(courses.filter((item) => item.id !== courseId));
      toast.success(`${data?.name || "Course"} deleted successfully`);
    },
    onError: (error) => {
      let message = error?.message || "Something went wrong";
      let description: string | undefined = undefined;

      const errorCode = error?.errors?.[0];
      switch (errorCode) {
        case "INVALID_COURSE_ID":
          message = "Something went wrong";
          description = "Please try again later";
          queryClient.invalidateQueries({ queryKey: ["courses"] });
          break;
        case "NOT_FOUND":
          queryClient.setQueryData(["courses"], (oldData: Course[]) =>
            oldData.filter((item) => item.id !== courseId),
          );
          return;
        case "UNAUTHORIZED":
          message = "Something went wrong";
          description = "Please try again later";
          queryClient.invalidateQueries({ queryKey: ["user"] });
          break;
        case "ACTION_FAILED":
          [message, description] = error.message?.split(",");
          break;
      }
      toast.danger(message, {
        description,
      });
    },
  });

  return (
    <Modal>
      <Tooltip delay={0}>
        <Button
          className="bg-danger-soft text-danger-soft-foreground"
          size="sm"
          isIconOnly
        >
          {discardDraftMutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Trash />
          )}
        </Button>
        <Tooltip.Content>
          <p className="font-outfit">Discard</p>
        </Tooltip.Content>
      </Tooltip>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Icon className="bg-danger-soft text-danger-soft-foreground mx-auto mb-4">
              <Trash />
            </Modal.Icon>
            <Modal.Header className="items-center text-center">
              <h4 className="text-xl font-outfit font-semibold">
                Delete Course
              </h4>
            </Modal.Header>
            <Modal.Body>
              <p className="text-center">
                Are you sure you want to delete this course? This action is
                irreversible.
              </p>
            </Modal.Body>
            <Modal.Footer className="flex-col">
              <Button
                className="w-full bg-danger"
                onClick={() => discardDraftMutation.mutate()}
                slot="close"
              >
                Archive
              </Button>
              <Button className="w-full" slot="close" variant="ghost">
                Cancel
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default DiscardDraftModal;
