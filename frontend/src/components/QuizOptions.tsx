import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  FieldError,
  Radio,
  RadioGroup,
} from "@heroui/react";
import { optionsSchema } from "../schema/quiz";
import { GripVertical, Trash } from "lucide-react";
import type { QuizI } from "../types/quiz";
import useAppStore from "../store";
import OptionField from "./OptionField";
import { useMemo } from "react";
import { DragDropProvider } from "@dnd-kit/react";

interface OptionI {
  id: number;
  index: number;
  option: string;
  questionId: number;
  correct?: boolean;
  match_option_id?: number;
  hideGrip?: boolean;
  hideDelete?: boolean;
  inputDisabled?: boolean;
  deleteDisabled?: boolean;
}

function RadioOption({
  id,
  index,
  option,
  questionId,
  hideGrip = false,
  hideDelete = false,
  deleteDisabled = false,
  inputDisabled = false,
}: OptionI) {
  const { removeOption, handleOptionChange } = useAppStore();
  const { ref, handleRef } = useSortable({
    id,
    index,
    type: "item",
    accept: "item",
  });

  return (
    <div className="flex items-center gap-2" ref={ref}>
      <Radio value={id.toString()} className="m-0">
        <Radio.Content>
          <Radio.Control className="rounded-full">
            <Radio.Indicator className="before:rounded-full" />
          </Radio.Control>
        </Radio.Content>
      </Radio>
      <OptionField
        name={`option-${questionId}-${id}`}
        value={option}
        onChange={(value) => handleOptionChange(value, questionId, id)}
        disabled={inputDisabled}
      />
      {!hideGrip && (
        <Button
          variant="tertiary"
          ref={handleRef}
          className="hover:cursor-grab"
          isIconOnly
        >
          <GripVertical />
        </Button>
      )}
      {!hideDelete && (
        <Button
          variant="danger-soft"
          isIconOnly
          isDisabled={deleteDisabled}
          onClick={() => removeOption(questionId, id)}
        >
          <Trash />
        </Button>
      )}
    </div>
  );
}

function CheckboxOption({
  id,
  option,
  questionId,
  index,
  hideGrip,
  hideDelete,
  deleteDisabled,
  inputDisabled,
}: OptionI) {
  const { removeOption, handleOptionChange } = useAppStore();

  const { ref, handleRef } = useSortable({
    id,
    index,
    type: "item",
    accept: "item",
  });

  return (
    <div className="flex items-center gap-2" ref={ref}>
      <Checkbox className="m-0" value={id.toString()}>
        <Checkbox.Content>
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
        </Checkbox.Content>
      </Checkbox>
      <OptionField
        name={`option-${questionId}-${id}`}
        value={option}
        onChange={(value) => handleOptionChange(value, questionId, id)}
        disabled={inputDisabled}
      />
      {!hideGrip && (
        <Button
          variant="tertiary"
          ref={handleRef}
          className="hover:cursor-grab"
          isIconOnly
        >
          <GripVertical />
        </Button>
      )}
      {!hideDelete && (
        <Button
          variant="danger-soft"
          isIconOnly
          isDisabled={deleteDisabled}
          onClick={() => removeOption(questionId, id)}
        >
          <Trash />
        </Button>
      )}
    </div>
  );
}

function MatchOption({
  id,
  option,
  index,
  questionId,
  match_option_id,
  hideGrip,
  hideDelete,
  inputDisabled,
  deleteDisabled,
}: OptionI) {
  const { handleOptionChange, removeOption } = useAppStore();
  const { handleRef, ref } = useSortable({
    id,
    index,
  });

  const handleDelete = () => {
    if (match_option_id) removeOption(questionId, match_option_id);
    removeOption(questionId, id);
  };

  return (
    <div className="flex items-center gap-2" ref={ref}>
      <OptionField
        name={`option-${questionId}-${id}`}
        value={option}
        onChange={(value) => handleOptionChange(value, questionId, id)}
        disabled={inputDisabled}
      />
      {!hideGrip && (
        <Button variant="tertiary" ref={handleRef} isIconOnly>
          <GripVertical />
        </Button>
      )}
      {!hideDelete && (
        <Button
          variant="danger-soft"
          onClick={handleDelete}
          isDisabled={deleteDisabled}
          isIconOnly
        >
          <Trash />
        </Button>
      )}
    </div>
  );
}

function QuizOptions({
  type,
  answer,
  options,
  questionId,
}: {
  questionId: number;
  type: QuizI["questions"][number]["type"];
  answer: string;
  inputDisabled?: boolean;
  options: QuizI["questions"][number]["options"];
}) {
  const {
    handleQuestionChange,
    handleOptionChange,
    handleCorrectChange,
    handleReorder,
  } = useAppStore();

  const lefts = useMemo(
    () => options.filter((_, index) => index % 2 === 0),
    [options],
  );
  const rights = useMemo(
    () => options.filter((_, index) => index % 2 === 1),
    [options],
  );

  if (type === "single_choice") {
    return (
      <RadioGroup
        aria-label={`question-${questionId}-radio`}
        name={questionId.toString()}
        defaultValue={options.find((o) => o.correct)?.id.toString()}
        onChange={(value) =>
          handleCorrectChange(false, questionId, parseInt(value))
        }
        className="flex flex-col gap-2"
        isRequired
      >
        {options.map((item, index) => (
          <RadioOption
            {...item}
            index={index}
            questionId={questionId}
            deleteDisabled={options.length === 2}
            key={index}
          />
        ))}
        <FieldError />
      </RadioGroup>
    );
  } else if (type === "multiple_choice") {
    return (
      <CheckboxGroup
        aria-label={`options-${questionId}`}
        name={`options-${questionId}`}
        validate={(value) => {
          const result = optionsSchema.safeParse(value);
          return result.success ? null : result.error.issues[0].message;
        }}
        value={options.filter((o) => o.correct).map((o) => o.id.toString())}
        onChange={(value: string[]) => handleCorrectChange(value, questionId)}
        className="flex flex-col gap-2"
        validationBehavior="native"
      >
        {options.map((item, index) => (
          <CheckboxOption
            index={index}
            questionId={questionId}
            deleteDisabled={options.length === 2}
            {...item}
            key={index}
          />
        ))}
        <FieldError>Select at least one correct option</FieldError>
      </CheckboxGroup>
    );
  } else if (type === "true_false") {
    return (
      <RadioGroup
        aria-label={`question-${questionId}-radio`}
        name={questionId.toString()}
        onChange={(value) =>
          handleOptionChange(value, questionId, parseInt(value))
        }
        className="flex max-sm:flex-col gap-2 w-full"
        isRequired
      >
        {options.map((item, index) => (
          <RadioOption
            id={item.id}
            index={index}
            option={item.option}
            questionId={questionId}
            hideDelete={true}
            deleteDisabled={true}
            inputDisabled={true}
            key={index}
          />
        ))}
      </RadioGroup>
    );
  } else if (type === "fill") {
    return (
      <OptionField
        name={`answer-${questionId}`}
        value={answer}
        onChange={(value) => handleQuestionChange("answer", value, questionId)}
      />
    );
  } else if (type === "order") {
    return <div className="flex items-center gap-2"></div>;
  }

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return;
        const { source } = event.operation;
        if (isSortable(source) && source.initialIndex !== source.index) {
          handleReorder(questionId, source.initialIndex, source.index);
        }
      }}
    >
      <div className="grid grid-cols-2 items-center gap-2">
        <div className="flex flex-col gap-2">
          {lefts.map((item, index) => (
            <OptionField
              name={`option-${questionId}-${item.id}`}
              value={item.option}
              onChange={(value) =>
                handleOptionChange(value, questionId, item.id)
              }
              key={index}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {rights.map((item, index) => (
            <MatchOption
              index={index}
              questionId={questionId}
              deleteDisabled={options.length <= 4}
              key={item.id}
              {...item}
            />
          ))}
        </div>
      </div>
    </DragDropProvider>
  );
}

export default QuizOptions;
