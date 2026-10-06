import { cn, toast } from "@heroui/react";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import type { EditLessonI, Lesson as LessonI } from "../types/lesson";
import useAppStore from "../store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteLesson, getLessons, reorderLesson } from "../services/lesson";
import { useEffect, useMemo, useState } from "react";
import type { ApiError } from "../services/api";
import Lesson from "./Lesson";

function DraggableLessons({
  className = "",
  inputClassName = "",
  editing = false,
  editLesson = 0,
  courseId,
  savingName = 0,
  handleCancelEdit = () => {},
  handleEditName = () => {},
  handleEdit = () => {},
}: {
  className?: string;
  inputClassName?: string;
  editing?: boolean;
  editLesson?: number;
  courseId: string | number;
  savingName?: number;
  handleCancelEdit?: () => void;
  handleEditName?: (lesson: EditLessonI) => void;
  handleEdit?: (lesson: LessonI) => void;
}) {
  const queryClient = useQueryClient();
  const { lessons, setLessons } = useAppStore();

  const { data, isError, error } = useQuery<LessonI[], ApiError>({
    queryKey: ["lessons", courseId],
    queryFn: () => getLessons(courseId),
    enabled: !!courseId,
    staleTime: 15 * 1000 * 60, // 15 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const [editNames, setEditNames] = useState<
    Record<number, string | undefined>
  >({});

  const reorderLessonMutation = useMutation<
    LessonI[],
    ApiError,
    { id: number; sequence: number }[]
  >({
    mutationFn: (lessons) => reorderLesson(lessons),
    onError: (error, _payload) => {
      console.log(error);
      toast.danger(error.message || "Something went wrong");
    },
  });

  const deleteLessonMutation = useMutation({
    mutationFn: (lessonId: number) => deleteLesson(lessonId),
    onSuccess: (data) => {
      queryClient.setQueryData(["lessons", courseId], (oldData: LessonI[]) =>
        oldData?.filter((item) => item?.id !== data?.id),
      );
    },
    onError: (error) => {
      console.log(error);
      toast.danger(error.message || "Something went wrong");
    },
  });

  const orderedLessons = useMemo(() => {
    return [...lessons].sort((a, b) => a.sequence - b.sequence);
  }, [lessons]);

  const handleChange = (value: string, id: number) => {
    setEditNames((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const reordered = move(lessons, event);

    const resequenced = reordered.map((lesson, index) => ({
      ...lesson,
      sequence: index + 1,
    }));

    const previousLessons = lessons;
    setLessons(resequenced);

    reorderLessonMutation.mutate(
      resequenced.map((l) => ({ id: l.id, sequence: l.sequence })),
      { onError: () => setLessons(previousLessons) },
    );
  };

  useEffect(() => {
    setEditNames(
      Object.fromEntries(
        orderedLessons.map((lesson) => [lesson.id, lesson.name]),
      ),
    );
  }, [orderedLessons]);

  useEffect(() => {
    if (!Array.isArray(data)) return;
    setLessons(data);
  }, [data, isError, error]);

  if (lessons.length === 0) return null;

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className={cn("flex flex-col gap-4", className)}>
        {orderedLessons.map((item, index) => (
          <Lesson
            {...item}
            index={index}
            inputClassName={inputClassName}
            name={editNames[item.id] ?? item.name}
            sequence={item.sequence}
            nameEditedActive={
              editNames[item.id] !== undefined &&
              editNames[item.id] !== item.name
            }
            handleDelete={() => deleteLessonMutation.mutate(item.id)}
            savingName={savingName === item.id ? item.id : 0}
            handleSaveName={(name) =>
              handleEditName({
                id: item.id,
                name,
              })
            }
            handleCancelSaveName={() =>
              setEditNames((prev) => ({ ...prev, [item.id]: undefined }))
            }
            deleting={
              deleteLessonMutation.isPending &&
              deleteLessonMutation.variables === item.id
                ? item.id
                : 0
            }
            handleEdit={() => handleEdit(item)}
            editing={editLesson === item.id && editing}
            handleCancelEdit={handleCancelEdit}
            handleChange={(value) => handleChange(value, item.id)}
            key={item.id}
          />
        ))}
      </div>
    </DragDropProvider>
  );
}

export default DraggableLessons;
