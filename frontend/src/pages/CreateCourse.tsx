import { useEffect, useState } from "react";
import CourseDetailsForm from "../components/CourseDetailsForm";
import { toast } from "@heroui/react";
import type { Course, CourseDetailsFormI, CourseSlice } from "../types/course";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCourse, getCourse, updateCourse } from "../services/courses";
import useAppStore from "../store";
import type { ApiError } from "../services/api";

function CreateCourse() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { courseId } = useParams();
  const { course, setCourse } = useAppStore();

  const { data } = useQuery<CourseSlice["course"]>({
    queryKey: ["course", courseId],
    queryFn: () => getCourse(courseId),
    enabled: !!courseId && course.id.toString() !== courseId?.toString(),
    retry: 1,
  });

  const [cover, setCover] = useState<{ file: File | null; uri: string }>({
    file: null,
    uri: "",
  });
  const [details, setDetails] = useState<CourseDetailsFormI>({
    name: "",
    tagline: "",
    description: "",
    category: "",
    skills: [],
    price: "",
  });

  const createCourseMutation = useMutation<Course, ApiError, FormData>({
    mutationFn: (formData) => createCourse(formData),
    onSuccess: (data) => {
      setCourse(data);
      queryClient.setQueryData(["courses"], (oldData: Course[]) => [
        ...(oldData || []),
        data,
      ]);
      queryClient.setQueryData(["course", courseId], data);
      navigate(`/create-course/${data?.id}/lessons`);
    },
    onError: (error) => {
      let message = error.message || "Something went wrong";
      let description: string | undefined = undefined;

      const errorCode = error?.errors?.[0];
      if (error.message === "Validation Error") {
        message = error.errors?.[0] || message;
      } else {
        switch (errorCode) {
          case "COVER_IMAGE_REQUIRED":
            message = "Please provide cover image";
            break;
          case "COVER_IMAGE_SIZE":
            description = "Please try with a smaller file";
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            break;
          case "UPLOAD_FAILED":
            message = "Image upload failed";
            description = "Please try again later";
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

  const updateCourseMutation = useMutation<
    Course,
    ApiError,
    { courseId: number; formData: FormData }
  >({
    mutationFn: (data) => updateCourse(data.courseId, data.formData),
    onSuccess: (data) => {
      setCourse(data);
      queryClient.setQueryData(["courses"], (oldData: Course[]) =>
        oldData.map((item) => {
          if (item.id === data?.id) {
            return data;
          }
          return item;
        }),
      );
      queryClient.setQueryData(["course", courseId], data);
      navigate(`/create-course/${data?.id}/lessons`);
    },
    onError: (error) => {
      let message = error.message || "Something went wrong";
      let description: string | undefined = undefined;

      const errorCode = error?.errors?.[0];
      if (error.message === "Validation Error") {
        message = error.errors?.[0] || message;
      } else {
        switch (errorCode) {
          case "COVER_IMAGE_REQUIRED":
            message = "Please provide cover image";
            break;
          case "COVER_IMAGE_SIZE":
            description = "Please try with a smaller file";
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

  const handleSaveCourse = () => {
    const courseAlreadySaved =
      details.name === course.name &&
      details.tagline === course.tagline &&
      details.category === course.category &&
      details.description === course.description &&
      parseInt(details.price) === course.price &&
      details.skills.length === course?.skills?.length &&
      details.skills.every((item) => course.skills?.includes(item)) &&
      !cover.file;

    if (courseAlreadySaved) {
      navigate(`/create-course/${data?.id}/lessons`);
      return;
    }

    const formData = new FormData();
    formData.append("name", details.name);
    formData.append("tagline", details.tagline);
    formData.append("category", details.category);
    formData.append("description", details.description);
    formData.append("price", details.price);
    formData.append("status", "draft");
    details.skills.map((item) => {
      formData.append("skills", item);
    });
    if (cover.file) formData.append("cover", cover.file);

    const id = parseInt(courseId || "-1");
    if (id === course.id) {
      updateCourseMutation.mutate({ courseId: id, formData });
      return;
    }
    createCourseMutation.mutate(formData);
  };

  useEffect(() => {
    if (!data) return;
    setCourse(data);
    setDetails({
      name: data?.name || "",
      tagline: data?.tagline || "",
      description: data?.description || "",
      category: data?.category || "",
      skills: data?.skills || [],
      price: data?.price?.toString() || "0",
    });
    if (data?.cover) {
      setCover({ file: null, uri: data?.cover });
    }
  }, [data]);

  return (
    <div className="lg:w-2/3 flex-1 min-w-0">
      <CourseDetailsForm
        cover={cover}
        form={details}
        setCover={setCover}
        setForm={(value) => setDetails(value)}
        handleNext={handleSaveCourse}
        isLoading={
          createCourseMutation.isPending || updateCourseMutation.isPending
        }
      />
    </div>
  );
}

export default CreateCourse;
