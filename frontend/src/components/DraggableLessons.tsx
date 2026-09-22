import {
  Button,
  FieldError,
  Input,
  Modal,
  TextField,
  toast,
} from "@heroui/react";
import {
  Check,
  GripVertical,
  ListTodo,
  Loader2,
  Notebook,
  Pencil,
  Play,
  Trash,
  X,
} from "lucide-react";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { move } from "@dnd-kit/helpers";
import type { EditLessonI, Lesson, LessonFormI } from "../types/lesson";
import { nameSchema } from "../schema/lesson";
import useAppStore from "../store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLesson } from "../services/lesson";
import { useEffect, useMemo, useState } from "react";

function Lesson({
  id,
  index,
  type,
  name,
  sequence,
  nameEditedActive,
  handleChange,
  editing,
  deleting,
  savingName,
  handleCancelEdit,
  handleEdit,
  handleDelete,
  handleSaveName,
  handleCancelSaveName,
}: {
  id: number;
  sequence: number;
  index: number;
  type: LessonFormI["type"];
  name: LessonFormI["name"];
  nameEditedActive: boolean;
  editing: boolean;
  deleting: number;
  handleChange: (value: string) => void;
  handleEdit: () => void;
  handleCancelEdit: () => void;
  savingName: number;
  handleSaveName: (name: string) => void;
  handleCancelSaveName: () => void;
  handleDelete: () => void;
}) {
  const { ref, handleRef } = useSortable({
    id,
    index,
    type: "item",
    accept: "item",
  });

  return (
    <div className="flex flex-col gap-1 w-full" ref={ref}>
      <div className="text-muted">
        <span className="text-xs">Lesson {sequence + 1}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          className="shrink-0 bg-accent-soft text-accent cursor-default group hover:bg-background-secondary hover:cursor-grab"
          size="sm"
          isIconOnly
          ref={handleRef}
        >
          <GripVertical className="group-hover:inline hidden text-foreground" />
          {type === "video" ? (
            <Play className="group-hover:hidden" />
          ) : type === "notes" ? (
            <Notebook className="group-hover:hidden" />
          ) : (
            <ListTodo className="group-hover:hidden" />
          )}
        </Button>
        <TextField
          aria-label={`lesson-${id}`}
          name={`lesson-${id}`}
          value={name}
          onChange={(value) => handleChange(value)}
          className="w-full"
          validate={(value) => {
            const result = nameSchema.safeParse(value);
            return result.success ? null : result.error.issues[0].message;
          }}
        >
          <Input placeholder="Lesson Name" />
          <FieldError />
        </TextField>
        {nameEditedActive ? (
          <Button
            size="sm"
            isIconOnly
            className="shrink-0"
            onClick={() => handleSaveName(name)}
          >
            {savingName ? <Loader2 className="animate-spin" /> : <Check />}
          </Button>
        ) : editing ? (
          <Button
            size="sm"
            onClick={handleCancelEdit}
            variant="tertiary"
            className="shrink-0 bg-background border hover:bg-background-secondary"
            isIconOnly
          >
            <X />
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleEdit}
            className="shrink-0 bg-warning-soft text-warning-soft-foreground"
            isIconOnly
          >
            <Pencil />
          </Button>
        )}
        {nameEditedActive ? (
          <Button
            size="sm"
            variant="tertiary"
            className="shrink-0 bg-background border hover:bg-background-secondary"
            onClick={handleCancelSaveName}
            isIconOnly
          >
            <X />
          </Button>
        ) : (
          <Modal>
            <Button
              variant="danger-soft"
              size="sm"
              className="shrink-0"
              isIconOnly
            >
              {deleting !== 0 ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Trash />
              )}
            </Button>
            <Modal.Backdrop>
              <Modal.Container>
                <Modal.Dialog>
                  <Modal.Icon className="bg-danger-soft text-danger-soft-foreground mx-auto mb-4">
                    <Trash />
                  </Modal.Icon>
                  <Modal.Header className="items-center text-center">
                    <h4 className="font-outfit tracking-tight text-xl font-semibold">
                      Delete Lesson
                    </h4>
                  </Modal.Header>
                  <Modal.Body>
                    <p>
                      Changes you made will be lost. Are you sure you want to
                      delete this lesson?
                    </p>
                  </Modal.Body>
                  <Modal.Footer className="flex-col">
                    <Button
                      variant="danger"
                      className="w-full"
                      slot="close"
                      isDisabled={deleting !== 0}
                      onClick={handleDelete}
                    >
                      {deleting !== 0 ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Delete"
                      )}
                    </Button>
                    <Button className="w-full" slot="close" variant="ghost">
                      Cancel
                    </Button>
                  </Modal.Footer>
                </Modal.Dialog>
              </Modal.Container>
            </Modal.Backdrop>
          </Modal>
        )}
      </div>
    </div>
  );
}

function DraggableLessons({
  editing,
  editLesson,
  courseId,
  savingName,
  handleCancelEdit,
  handleEditName,
  handleEdit,
}: {
  editing: boolean;
  editLesson: number;
  courseId?: string | number;
  savingName: number;
  handleCancelEdit: () => void;
  handleEditName: (lesson: EditLessonI) => void;
  handleEdit: (lesson: Lesson) => void;
}) {
  const queryClient = useQueryClient();
  const { lessons, setLessons } = useAppStore();

  const [editNames, setEditNames] = useState<
    Record<number, string | undefined>
  >({});

  // const reorderLessonMutation = useMutation({
  //   mutationFn: (lessons: { id: number; sequence: number }[]) =>
  //     reorderLesson(lessons),
  //   onError: (error) => {
  //     console.log(error);
  //   },
  // });

  const deleteLessonMutation = useMutation({
    mutationFn: (lessonId: number) => deleteLesson(lessonId),
    onSuccess: (data) => {
      queryClient.setQueryData(["lessons", courseId], (oldData: Lesson[]) =>
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
    setLessons(move(lessons, event));
  };

  useEffect(() => {
    setEditNames(
      Object.fromEntries(
        orderedLessons.map((lesson) => [lesson.id, lesson.name]),
      ),
    );
  }, [orderedLessons]);

  if (lessons.length === 0) return null;

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-4">
        {orderedLessons.map((item, index) => (
          <Lesson
            {...item}
            index={index}
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
