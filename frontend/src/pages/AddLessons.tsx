import { useEffect, useState } from "react";
import LessonsForm from "../components/LessonsForm";
import { useNavigate, useParams } from "react-router-dom";
import type { EditLessonI, Lesson, LessonFormI } from "../types/lesson";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLesson, editLesson, getLessons } from "../services/lesson";
import { Button, toast } from "@heroui/react";
import type { ApiError } from "../services/api";
import DraggableLessons from "../components/DraggableLessons";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useAppStore from "../store";

function AddLessons() {
  const { courseId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<LessonFormI>({
    id: 0,
    type: "notes",
    name: "",
    video: "",
    sequence: 1,
    notes: "",
    quiz: null,
  });
  const { lessons, setLessons } = useAppStore();

  const { data, isError, error } = useQuery<Lesson[], ApiError>({
    queryKey: ["lessons", courseId],
    queryFn: () => getLessons(courseId),
    enabled: !!courseId,
    staleTime: 15 * 1000 * 60, // 15 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const [editing, setEditing] = useState(false);

  const handleEditLesson = (lesson: Lesson) => {
    const lessonsForm = document.querySelector("#lessons-form");
    lessonsForm?.scrollIntoView();
    setLesson({
      id: lesson.id || 0,
      name: lesson.name || "",
      notes: lesson.notes || "",
      sequence: lesson.sequence || 1,
      quiz: null,
      type: lesson.type || "notes",
      video: lesson.video || "",
    });
    // if (lesson.quiz) setQuiz(lesson.quiz);
    setEditing(true);
  };

  const createLessonMutation = useMutation({
    mutationFn: (lesson: LessonFormI) =>
      createLesson({
        ...lesson,
        video: lesson?.video || null,
        course: courseId || 0,
      }),
    onSuccess: (data) => {
      setLessons([...lessons, data]);
      queryClient.setQueryData(["lessons", courseId], (oldData: Lesson[]) => [
        ...(oldData || []),
        data,
      ]);
      setLesson({
        id: 0,
        type: "notes",
        name: "",
        video: "",
        sequence: lessons?.at(-1)?.sequence || 1,
        notes: "",
        quiz: null,
      });
    },
    onError: (error) => {
      console.log(error);
      toast.danger(error.message || "Something went wrong");
    },
  });

  const editLessonMutation = useMutation({
    mutationFn: (lesson: EditLessonI) =>
      editLesson({ ...lesson, video: lesson?.video || null }),
    onSuccess: (data) => {
      setLessons(
        lessons.map((item) => {
          if (item.id === editLessonMutation.variables?.id) {
            return data;
          }
          return item;
        }),
      );
      setEditing(false);
    },
    onError: (error) => {
      console.log(error);
      toast.danger(error.message || "Something went wrong");
    },
  });

  useEffect(() => {
    if (!Array.isArray(data)) return;
    setLessons(data);
  }, [data, isError, error]);

  return (
    <div className="lg:w-2/3 flex-1 min-w-0">
      <div className="flex flex-col gap-6">
        <div>
          <h4 className="text-xl font-semibold tracking-tight">Add Lessons</h4>
          <p className="text-muted text-sm">Add Lessons to your course</p>
        </div>
        <DraggableLessons
          editLesson={lesson.id}
          handleEditName={(lesson) => editLessonMutation.mutate(lesson)}
          savingName={
            editLessonMutation.variables?.id && editLessonMutation.isPending
              ? editLessonMutation.variables?.id || 0
              : 0
          }
          courseId={courseId}
          editing={editing}
          handleEdit={handleEditLesson}
          handleCancelEdit={() => {
            setEditing(false);
            setLesson({
              id: 0,
              type: "notes",
              name: "",
              notes: "",
              sequence: lessons.at(-1)?.sequence || 0 + 1,
              video: "",
              quiz: null,
            });
          }}
        />
        <LessonsForm
          saving={
            createLessonMutation.isPending || editLessonMutation.isPending
          }
          editing={editing}
          lesson={lesson}
          setLesson={setLesson}
          handleAdd={(lesson) => createLessonMutation.mutate(lesson)}
          handleEdit={(lesson) => editLessonMutation.mutate(lesson)}
        />
        <div className="flex justify-between gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              navigate(`/create-course/${courseId}`);
            }}
          >
            <ChevronLeft />
            Back
          </Button>
          <Button
            type="button"
            isDisabled={lessons.length === 0}
            onClick={() => {
              if (lessons.length === 0) return;
              navigate(`/create-course/${courseId}/publish`);
            }}
          >
            Continue
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddLessons;
