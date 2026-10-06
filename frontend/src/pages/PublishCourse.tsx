import { Button, Chip, Modal, toast } from "@heroui/react";
import {
  Check,
  ChevronLeft,
  Loader2,
  NotebookPen,
  ShieldAlert,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCourse, updateCourse } from "../services/courses";
import { useNavigate, useParams } from "react-router-dom";
import type { Course } from "../types/course";
import DraggableLessons from "../components/DraggableLessons";
import { languages } from "../lib/accessibility";
import { useEffect, useMemo } from "react";
import type { ApiError } from "../services/api";
import CustomEmptyState from "../components/CustomEmptyState";
import useAppStore from "../store";
import PublishCourseSkeleton from "../skeletons/PublishCourse";

function CoverPreview({ image }: { image: string }) {
  return (
    <Modal>
      <Modal.Trigger className="relative group w-full ring-visible rounded-lg overflow-hidden active:transform-none">
        <div className="bg-black/20 transition-opacity duration-300 w-full h-40 left-0 top-0 absolute flex items-center justify-center opacity-0 group-hover:opacity-100" />
        <img src={image} className="w-full h-40 object-cover" />
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Body>
              <img src={image} className="w-full object-contain mx-auto" />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

function PublishCourse() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { courseId } = useParams();
  const { course, setCourse } = useAppStore();
  const { data, isLoading, isError, error } = useQuery<Course, ApiError>({
    queryKey: ["course", courseId],
    queryFn: () => getCourse(courseId),
  });

  const language = useMemo(() => {
    const lang = languages.find((item) => item.code === data?.language);
    return lang?.name || "English";
  }, [data?.language]);

  const updateCourseMutation = useMutation<Course, ApiError, FormData>({
    mutationFn: (formData) => updateCourse(courseId || 0, formData),
    onSuccess: (data) => {
      navigate("/dashboard");
      queryClient.setQueryData(["course", courseId], data);
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

  const handleSaveDraft = () => {
    const formData = new FormData();
    formData.append("status", "draft");
    updateCourseMutation.mutate(formData);
  };

  const handlePublish = () => {
    const formData = new FormData();
    formData.append("status", "published");
    updateCourseMutation.mutate(formData);
  };

  useEffect(() => {
    if (!data) return;
    setCourse(data);
  }, [data]);

  if (isLoading) {
    return <PublishCourseSkeleton />;
  }

  if (isError && !isLoading) {
    return (
      <div className="bg-background rounded-lg w-full">
        <CustomEmptyState
          icon={ShieldAlert}
          iconContainerClassName="bg-background-secondary"
          title="Course not Found"
          description={error?.message || "Please try again later"}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div>
        <h4 className="text-xl font-semibold tracking-tight">
          Review & Publish
        </h4>
        <p className="text-muted text-sm">
          Almost there, review everything before you publish
        </p>
      </div>
      <div className="bg-background rounded-lg">
        <CoverPreview image={course?.cover} />
        <div className="p-4 flex flex-col justify-center gap-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="sm:text-4xl text-2xl font-semibold font-outfit tracking-tight">
                {course?.name}
              </h3>
              <p className="max-sm:text-sm text-lg text-muted">
                {course?.tagline}
              </p>
            </div>
            <Chip className="rounded-full border border-accent text-accent capitalize bg-background">
              {course?.category}
            </Chip>
          </div>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            <div className="flex flex-col gap-4 p-4 border rounded-lg">
              <span className="text-accent uppercase font-huninn">Lessons</span>
              <p className="md:text-4xl sm:text-3xl text-2xl font-merriweather truncate">
                {Number(course?.lessons).toLocaleString("en-IN", {
                  style: "decimal",
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
            <div className="flex flex-col gap-4 p-4 border rounded-lg">
              <span className="text-accent uppercase font-huninn">Price</span>
              <p className="md:text-4xl sm:text-3xl text-2xl font-merriweather truncate">
                {Number(course?.price).toLocaleString("en-IN", {
                  currency: "INR",
                  style: "currency",
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
            <div className="flex flex-col gap-4 p-4 border rounded-lg">
              <span className="text-accent uppercase font-huninn">
                Language
              </span>
              <p className="md:text-4xl sm:text-3xl text-2xl font-merriweather capitalize truncate pb-1">
                {language}
              </p>
            </div>
          </div>
          {course?.skills && course?.skills.length > 0 && (
            <div>
              <h5 className="text-xl font-medium">Skills</h5>
              <div className="flex items-center gap-2 mt-3">
                {course?.skills &&
                  course?.skills.map((item, index) => (
                    <Chip
                      className="bg-accent rounded-full text-white capitalize"
                      key={index}
                    >
                      {item}
                    </Chip>
                  ))}
              </div>
            </div>
          )}
          <h5 className="text-xl font-medium mb-4">Description</h5>
          <div
            className="quill-text pb-4 bg-background-secondary p-3 rounded-lg"
            dangerouslySetInnerHTML={{ __html: course?.description }}
          />
          <div>
            <h5 className="text-xl font-medium mb-4">Lessons</h5>
            <DraggableLessons
              courseId={courseId || 0}
              className="gap-2"
              inputClassName="bg-background-secondary"
              handleEdit={() => navigate(`/create-course/${courseId}/lessons`)}
            />
          </div>
        </div>
        {course?.status !== "published" && (
          <div className="flex items-center justify-center">
            <Button
              variant="tertiary"
              className="mb-4 w-30"
              onClick={handleSaveDraft}
              isDisabled={updateCourseMutation.isPending}
            >
              {updateCourseMutation.isPending &&
              updateCourseMutation.variables?.get("status") === "draft" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <NotebookPen /> Save Draft
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      <div className="flex justify-between gap-2">
        <Button variant="outline" type="button">
          <ChevronLeft />
          Back
        </Button>
        <Button
          type="button"
          onClick={handlePublish}
          isDisabled={updateCourseMutation.isPending}
        >
          {updateCourseMutation.isPending &&
          updateCourseMutation.variables?.get("status") === "published" ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Publish"
          )}
          <Check />
        </Button>
      </div>
    </div>
  );
}

export default PublishCourse;
