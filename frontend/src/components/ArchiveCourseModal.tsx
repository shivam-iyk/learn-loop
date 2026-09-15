import { Button, Modal, toast, Tooltip } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Archive, Loader2 } from "lucide-react";
import { updateCourse } from "../services/courses";
import type { Course } from "../types/course";
import useAppStore from "../store";
import type { ApiError } from "../services/api";

function ArchiveCourseModal({ courseId }: { courseId: number }) {
  const queryClient = useQueryClient();

  const { courses, setCourses } = useAppStore();

  const archiveCourseMutation = useMutation<Course, ApiError, FormData>({
    mutationFn: (formData) => updateCourse(courseId, formData),
    onSuccess: () => {
      queryClient.setQueryData(["courses"], (oldData: Course[]) =>
        oldData.map((item) => {
          if (item.id === courseId) {
            return { ...item, status: "archived" };
          }
          return item;
        }),
      );
      setCourses(
        courses.map((item) => {
          if (item.id === courseId) {
            return { ...item, status: "archived" };
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
          case "UPLOAD_FAILED":
            message = "Image upload failed";
            description = "Please try again later";
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

  const handleArchive = () => {
    const formData = new FormData();
    formData.append("status", "archived");
    archiveCourseMutation.mutate(formData);
  };

  return (
    <Modal>
      <Tooltip delay={0}>
        <Button
          className="bg-warning-soft text-warning-soft-foreground"
          size="sm"
          isIconOnly
        >
          {archiveCourseMutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Archive />
          )}
        </Button>
        <Tooltip.Content>
          <p className="font-outfit">Archive</p>
        </Tooltip.Content>
      </Tooltip>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Icon className="bg-warning-soft text-warning-soft-foreground mx-auto mb-4">
              <Archive />
            </Modal.Icon>
            <Modal.Header className="items-center text-center">
              <h4 className="text-xl font-outfit font-semibold">
                Archive Course
              </h4>
            </Modal.Header>
            <Modal.Body>
              <p className="text-center">
                Are you sure you want to archive this course? You can unarchive
                it later.
              </p>
            </Modal.Body>
            <Modal.Footer className="flex-col">
              <Button
                className="w-full bg-warning"
                slot="close"
                onClick={handleArchive}
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

export default ArchiveCourseModal;
