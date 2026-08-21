import { Button, Input, Modal } from "@heroui/react";
import {
  GripVertical,
  ListTodo,
  Notebook,
  Pencil,
  Play,
  Trash,
  X,
} from "lucide-react";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { move } from "@dnd-kit/helpers";
import type { LessonFormI } from "../types/lesson";

function Lesson({
  id,
  index,
  type,
  name,
  handleChange,
  editing,
  handleCancelEdit,
  handleEdit,
  handleDelete,
}: {
  id: number;
  index: number;
  type: LessonFormI["type"];
  name: LessonFormI["name"];
  editing: boolean;
  handleChange: (value: string) => void;
  handleEdit: () => void;
  handleCancelEdit: () => void;
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
        <span className="text-xs">Lesson {index + 1}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          className="shrink-0 bg-accent-soft text-accent cursor-default group hover:bg-background-secondary hover:cursor-grab"
          size="sm"
          isIconOnly
          ref={handleRef}
        >
          <GripVertical className="group-hover:inline hidden text-black" />
          {type === "video" ? (
            <Play className="group-hover:hidden" />
          ) : type === "notes" ? (
            <ListTodo className="group-hover:hidden" />
          ) : (
            <Notebook className="group-hover:hidden" />
          )}
        </Button>
        <Input
          name={`lesson-${id}`}
          value={name}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full"
        />
        {editing ? (
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
        <Modal>
          <Button
            variant="danger-soft"
            size="sm"
            className="shrink-0"
            isIconOnly
          >
            <Trash />
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
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                  <Button className="w-full" slot="close" variant="ghost">
                    Cancel
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      </div>
    </div>
  );
}

function DraggableLessons({
  lessonId,
  lessons,
  handleCancelEdit,
  setLessons,
  handleEdit,
}: {
  lessons: LessonFormI[];
  lessonId: number;
  handleCancelEdit: () => void;
  setLessons: (lessons: LessonFormI[]) => void;
  handleEdit: (lesson: LessonFormI) => void;
}) {
  if (lessons.length === 0) return null;

  const handleChange = (value: string, id: number) => {
    setLessons(
      lessons.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            name: value,
          };
        } else return item;
      }),
    );
  };

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        setLessons(move(lessons, event));
      }}
    >
      <div className="flex flex-col gap-4">
        {lessons.map((item, index) => (
          <Lesson
            {...item}
            index={index}
            handleDelete={() =>
              setLessons(lessons.filter((lesson) => lesson.id !== item.id))
            }
            handleEdit={() => handleEdit(item)}
            editing={lessonId === item.id}
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
