import { Button, Modal, toast, Tooltip } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowUpFromLine, Loader2 } from "lucide-react";
import type { Course } from "../types/course";
import type { ApiError } from "../services/api";
import { updateCourse } from "../services/courses";
import useAppStore from "../store";

function PublishCourseModal({
  courseId,
  disabled,
  handleDisabledClick,
}: {
  courseId: number;
  disabled?: boolean;
  handleDisabledClick?: () => void;
}) {
  const queryClient = useQueryClient();

  const { courses, setCourses } = useAppStore();

  const publishCourseMutation = useMutation<Course, ApiError, FormData>({
    mutationFn: (formData) => updateCourse(courseId, formData),
    onSuccess: () => {
      queryClient.setQueryData(["courses"], (oldData: Course[]) =>
        oldData.map((item) => {
          if (item.id === courseId) {
            return { ...item, status: "published" };
          }
          return item;
        }),
      );
      setCourses(
        courses.map((item) => {
          if (item.id === courseId) {
            return { ...item, status: "published" };
          }
          return item;
        }),
      );
    },
    onError: (error) => {
      let message = error.message || "Something went wrong";
      let description: string | undefined = undefined;

      const errorCode = error?.errors?.[0];
      if (error.message === "Validation Error") {
        message = error.errors?.[0] || message;
      } else {
        switch (errorCode) {
          case "UPLOAD_FAILED":
            message = "Image cannot be uploaded";
            description = "Please try again later";
            break;
          case "INVALID_COURSE_ID":
            message = "Something went wrong";
            description = "Please try again later";
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            break;
          case "NOT_FOUND":
            message = "Something went wrong";
            description = "Please try again later";
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            break;
          case "UNAUTHORIZED":
            message = "Something went wrong";
            description = "Please try again later";
            queryClient.invalidateQueries({ queryKey: ["user"] });
            break;
          case "ACTION_FAILED":
            [message, description] = error.message?.split(",");
            break;
        }
      }
      toast.danger(message, {
        description,
      });
    },
  });

  const handlePublish = () => {
    const formData = new FormData();
    formData.append("status", "published");
    publishCourseMutation.mutate(formData);
  };

  if (disabled) {
    return (
      <Tooltip delay={0}>
        <Button
          className="bg-success-soft text-success-soft-foreground"
          size="sm"
          onClick={handleDisabledClick}
          isIconOnly
        >
          <ArrowUpFromLine />
        </Button>
        <Tooltip.Content>
          <p className="font-outfit">Publish</p>
        </Tooltip.Content>
      </Tooltip>
    );
  }

  return (
    <Modal>
      <Tooltip delay={0}>
        <Button
          className="bg-success-soft text-success-soft-foreground"
          size="sm"
          onClick={handlePublish}
          isIconOnly
        >
          {publishCourseMutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <ArrowUpFromLine />
          )}
        </Button>
        <Tooltip.Content>
          <p className="font-outfit">Publish</p>
        </Tooltip.Content>
      </Tooltip>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Icon className="bg-success-soft text-success-soft-foreground mx-auto mb-4">
              <ArrowUpFromLine />
            </Modal.Icon>
            <Modal.Header className="items-center text-center">
              <h4 className="text-xl font-outfit font-semibold">
                Publish Course
              </h4>
            </Modal.Header>
            <Modal.Body>
              <p className="text-center">
                Are you sure you want to publish this course? You can archive it
                later.
              </p>
            </Modal.Body>
            <Modal.Footer className="flex-col">
              <Button
                className="w-full bg-success text-success-foreground"
                slot="close"
              >
                Publish
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

export default PublishCourseModal;
