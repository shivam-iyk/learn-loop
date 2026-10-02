import { isSortable } from "@dnd-kit/react/sortable";
import { DragDropProvider } from "@dnd-kit/react";
import {
  Checkbox,
  CheckboxGroup,
  FieldError,
  Radio,
  RadioGroup,
} from "@heroui/react";
import { optionsSchema } from "../schema/quiz";
import type { QuizI } from "../types/quiz";
import useAppStore from "../store";
import OptionField from "./OptionField";
import OptionRow from "./OptionRow";

const radioControl = (id: number) => (
  <Radio value={id.toString()} className="m-0">
    <Radio.Content>
      <Radio.Control className="rounded-full">
        <Radio.Indicator className="before:rounded-full" />
      </Radio.Control>
    </Radio.Content>
  </Radio>
);

const checkboxControl = (id: number) => (
  <Checkbox className="m-0" value={id.toString()}>
    <Checkbox.Content>
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
    </Checkbox.Content>
  </Checkbox>
);

interface QuizOptionsProps {
  questionId: number;
  type: QuizI["questions"][number]["type"];
  answer: string;
  options: QuizI["questions"][number]["options"];
}

function QuizOptions({ type, answer, options, questionId }: QuizOptionsProps) {
  const {
    handleQuestionChange,
    handleOptionChange,
    handleCorrectChange,
    removeOption,
    handleReorder,
    handleMatchReorder,
  } = useAppStore();

  if (type === "single_choice" || type === "multiple_choice") {
    const isMulti = type === "multiple_choice";

    const rows = options.map((item, index) => (
      <OptionRow
        {...item}
        index={index}
        questionId={questionId}
        deleteDisabled={options.length === 2}
        control={isMulti ? checkboxControl(item.id) : radioControl(item.id)}
        key={item.id}
      />
    ));

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
        {isMulti ? (
          <CheckboxGroup
            aria-label={`question-${questionId}-checkbox`}
            name={`options-${questionId}`}
            defaultValue={options
              .filter((o) => o.correct)
              .map((o) => o.id.toString())}
            validate={(value) => {
              const result = optionsSchema.safeParse(value);
              return result.success ? null : result.error.issues[0].message;
            }}
            onChange={(value) => handleCorrectChange(value, questionId)}
            className="flex flex-col gap-2"
            validationBehavior="native"
          >
            {rows}
            <FieldError>Select at least one correct option</FieldError>
          </CheckboxGroup>
        ) : (
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
            {rows}
            <FieldError />
          </RadioGroup>
        )}
      </DragDropProvider>
    );
  }

  if (type === "true_false") {
    return (
      <RadioGroup
        aria-label={`question-${questionId}-radio`}
        name={questionId.toString()}
        defaultValue={options.find((o) => o.correct)?.id.toString()}
        onChange={(value) =>
          handleCorrectChange(true, questionId, parseInt(value))
        }
        className="flex max-sm:flex-col gap-2 w-full"
        isRequired
      >
        {options.map((item, index) => (
          <OptionRow
            {...item}
            index={index}
            questionId={questionId}
            hideGrip
            hideDelete
            deleteDisabled
            inputDisabled
            control={radioControl(item.id)}
            key={item.id}
          />
        ))}
      </RadioGroup>
    );
  }

  if (type === "fill") {
    return (
      <OptionField
        name={`answer-${questionId}`}
        value={answer}
        onChange={(value) => handleQuestionChange("answer", value, questionId)}
      />
    );
  }

  if (type === "order") {
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
        <div className="flex flex-col gap-2">
          {options.map((item, index) => (
            <OptionRow
              {...item}
              index={index}
              questionId={questionId}
              deleteDisabled={options.length <= 2}
              key={item.id}
            />
          ))}
        </div>
      </DragDropProvider>
    );
  }

  const lefts = options.filter((_, i) => i % 2 === 0);
  const rights = options.filter((_, i) => i % 2 === 1);

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return;
        const { source } = event.operation;
        if (isSortable(source) && source.initialIndex !== source.index) {
          handleMatchReorder(questionId, source.initialIndex, source.index);
        }
      }}
    >
      <div className="grid grid-cols-2 items-center gap-2">
        <div className="flex flex-col gap-2">
          {lefts.map((item) => (
            <OptionField
              name={`option-${questionId}-${item.id}`}
              value={item.option}
              onChange={(value) =>
                handleOptionChange(value, questionId, item.id)
              }
              key={item.id}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {rights.map((item, index) => (
            <OptionRow
              {...item}
              index={index}
              questionId={questionId}
              deleteDisabled={options.length <= 4}
              onDelete={() => {
                if (item.match_option_id)
                  removeOption(questionId, item.match_option_id);
                removeOption(questionId, item.id);
              }}
              key={item.id}
            />
          ))}
        </div>
      </div>
    </DragDropProvider>
  );
}

export default QuizOptions;
