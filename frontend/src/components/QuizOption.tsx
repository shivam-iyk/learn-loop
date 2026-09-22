import { useSortable } from "@dnd-kit/react/sortable";
import {
  Button,
  Checkbox,
  FieldError,
  Input,
  TextField,
} from "@heroui/react";
import { optionSchema } from "../schema/quiz";
import { GripVertical, Trash } from "lucide-react";
import type { QuizFormI } from "../types/quiz";

function Option({
  id,
  index,
  option,
  type,
  correct,
  question,
  disabled,
  handleDelete,
  handleOptionChange,
}: {
  id: number;
  index: number;
  type: QuizFormI["questions"][number]["type"];
  option: string;
  correct: boolean;
  disabled?: boolean;
  question: number;
  handleDelete: () => void;
  handleOptionChange: (value: boolean | string) => void;
}) {
  const { ref, handleRef } = useSortable({
    id,
    index,
    type: "item",
    accept: "item",
  });

  const Selector = () => {
    switch (type) {
      case "single_choice":
        return (
          <Input
            type="radio"
            name={`option-${index}`}
            className="rounded-full"
            checked={correct}
            onChange={(e) => handleOptionChange(e.target.checked)}
          />
        );
      case "multiple_choice":
        return (
          <Checkbox
            variant="secondary"
            value={correct ? "on" : "off"}
            onChange={() => handleOptionChange(correct)}
          >
            <Checkbox.Content>
              <Checkbox.Control className="size-4 rounded-xl">
                <Checkbox.Indicator />
              </Checkbox.Control>
            </Checkbox.Content>
          </Checkbox>
        );
      case "match":
        return <>Match</>;
      case "order":
        return <>Order</>;
      case "true_false":
        return (
          <Input
            type="radio"
            name={`option-${index}`}
            className="rounded-full"
            checked={correct}
            onChange={(e) => handleOptionChange(e.target.checked)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-2" ref={ref}>
      <TextField
        name={`option-${question}-${index}`}
        value={option}
        aria-label="Option"
        onChange={(value) => handleOptionChange(value)}
        validate={(value) => {
          const result = optionSchema.safeParse(value);
          return result.success ? null : result.error.issues[0].message;
        }}
        className="flex-1"
      >
        {type === "fill" ? (
          <Input placeholder="Answer" />
        ) : (
          <div className="flex items-center gap-2 flex-1">
            {<Selector />}
            <Input placeholder="Option value" className="flex-1" />
          </div>
        )}
        <FieldError />
      </TextField>
      <Button
        variant="tertiary"
        ref={handleRef}
        className="hover:cursor-grab"
        isIconOnly
      >
        <GripVertical />
      </Button>
      <Button
        variant="danger-soft"
        isIconOnly
        isDisabled={disabled}
        onClick={handleDelete}
      >
        <Trash />
      </Button>
    </div>
  );
}

export default Option;
