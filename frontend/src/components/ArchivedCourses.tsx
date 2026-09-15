import { Button, EmptyState, Table, toast, Tooltip } from "@heroui/react";
import {
  ArchiveRestore,
  Layers,
  Loader2,
  Package2,
  Star,
  Users,
} from "lucide-react";
import RatingStars from "./RatingStars";
import useAppStore from "../store";
import { useMemo } from "react";
import CustomEmptyState from "./CustomEmptyState";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCourse } from "../services/courses";
import type { Course } from "../types/course";
import type { ApiError } from "../services/api";

function ArchivedCourses({ loading }: { loading: boolean }) {
  const queryClient = useQueryClient();

  const { courses, setCourses } = useAppStore();

  const unarchiveCourseMutation = useMutation<
    Course,
    ApiError,
    { id: number; formData: FormData }
  >({
    mutationFn: (course) => updateCourse(course.id, course.formData),
    onSuccess: () => {
      queryClient.setQueryData(["courses"], (oldData: Course[]) =>
        oldData.map((item) => {
          if (item.id === unarchiveCourseMutation.variables?.id) {
            return { ...item, status: "published" };
          }
          return item;
        }),
      );
      setCourses(
        courses.map((item) => {
          if (item.id === unarchiveCourseMutation.variables?.id) {
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

  const handleUnarchive = (courseId: number) => {
    const formData = new FormData();
    formData.append("status", "published");
    unarchiveCourseMutation.mutate({ id: courseId, formData });
  };

  const archived = useMemo(() => {
    return courses.filter((item) => item.status === "archived");
  }, [courses]);

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Team members" className="min-w-[600px]">
          <Table.Header>
            <Table.Column className="font-huninn uppercase" isRowHeader>
              Course
            </Table.Column>
            <Table.Column className="font-huninn uppercase">
              Lessons
            </Table.Column>
            <Table.Column className="font-huninn uppercase">
              Students
            </Table.Column>
            <Table.Column className="font-huninn uppercase">
              Rating
            </Table.Column>
            <Table.Column className="font-huninn uppercase">
              Actions
            </Table.Column>
          </Table.Header>
          <Table.Body
            renderEmptyState={() =>
              loading ? (
                <CustomEmptyState
                  title=""
                  description=""
                  icon={Loader2}
                  iconContainerClassName="bg-transparent"
                  textContainerClassName="hidden"
                  iconClassName="animate-spin"
                  containerClassName="bg-background"
                />
              ) : (
                <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                  <Package2 />
                  <span className="text-sm text-muted">No courses found</span>
                </EmptyState>
              )
            }
          >
            {archived.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell className="font-medium">{item.name}</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2 h-full">
                    <Layers size={16} /> {item.lessons}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2 h-full">
                    <Users size={16} />
                    {item.students_enrolled}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2 h-full">
                    <Star className="text-warning" size={16} />
                    <RatingStars
                      stars={item.rating_sum / item.rating_count || 0}
                      starsClassName="hidden!"
                      size={0}
                    />
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <Button
                        className="bg-success-soft text-success-soft-foreground"
                        size="sm"
                        onClick={() => handleUnarchive(item.id)}
                      >
                        {unarchiveCourseMutation.variables?.id === item.id &&
                        unarchiveCourseMutation.isPending ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <ArchiveRestore />
                        )}
                      </Button>
                      <Tooltip.Content>
                        <p className="font-outfit">Publish</p>
                      </Tooltip.Content>
                    </Tooltip>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}

export default ArchivedCourses;
