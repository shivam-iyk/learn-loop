import { useSortable } from "@dnd-kit/react/sortable";
import type { LessonFormI } from "../types/lesson";
import { Button, FieldError, Input, Modal, TextField } from "@heroui/react";
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
import { nameSchema } from "../schema/course";

function Lesson({
  id,
  index,
  type,
  name,
  sequence,
  nameEditedActive,
  inputClassName = "",
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
  inputClassName?: string;
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
        <span className="text-xs">Lesson {sequence}</span>
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
          <Input placeholder="Lesson Name" className={inputClassName} />
          <FieldError />
        </TextField>
        {nameEditedActive ? (
          <Button
            size="sm"
            isIconOnly
            className="shrink-0"
            onClick={() => handleSaveName(name)}
            isDisabled={!!savingName}
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
              isDisabled={deleting !== 0}
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

export default Lesson;
