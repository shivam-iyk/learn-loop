import { useEffect, useState } from "react";
import CourseDetailsForm from "../components/CourseDetailsForm";
import { toast } from "@heroui/react";
import type { CourseDetailsFormI, CourseSlice } from "../types/course";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createCourse, getCourse, updateCourse } from "../services/courses";
import useAppStore from "../store";

function CreateCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { course, setCourse } = useAppStore();

  const { data } = useQuery<CourseSlice["course"]>({
    queryKey: ["draft-course", courseId],
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

  const createCourseMutation = useMutation({
    mutationFn: (formData: FormData) => createCourse(formData),
    onSuccess: (data) => {
      console.log(data);
      navigate(`/create-course/${data?.id}/lessons`);
    },
    onError: (error) => {
      console.log(error);
      toast.danger(error?.message || "Something went wrong");
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: (data: { courseId: number; formData: FormData }) =>
      updateCourse(data.courseId, data.formData),
    onSuccess: (data) => {
      setCourse(data);
      navigate(`/create-course/${data?.id}/lessons`);
    },
    onError: (error) => {
      console.log(error);
      toast.danger(error.message || "Something went wrong");
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
