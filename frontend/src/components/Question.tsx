import { Plus } from "lucide-react";
import { Select, Label, ListBox, Button } from "@heroui/react";
import QuestionInput from "./QuestionInput";
import QuizOptions from "./QuizOptions";
import type { QuizI } from "../types/quiz";
import useAppStore from "../store";

const quizTypes = [
  {
    name: "Single Choice",
    value: "single_choice",
  },
  {
    name: "Multiple Choice",
    value: "multiple_choice",
  },
  {
    name: "True/False",
    value: "true_false",
  },
  {
    name: "Match the following",
    value: "match",
  },
  {
    name: "Fill in the blanks",
    value: "fill",
  },
  {
    name: "Arrange in correct Order",
    value: "order",
  },
];

function Question({
  id,
  index,
  question,
  invalid,
  type,
  answer,
  options,
}: QuizI["questions"][number] & {
  index: number;
  invalid: boolean;
}) {
  const { quiz, handleQuestionChange, removeQuestion, addOption, addQuestion } =
    useAppStore();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex max-sm:flex-col gap-2 items-end">
        <Select
          name={`question-type-${id}`}
          value={type}
          onChange={(value) =>
            handleQuestionChange(
              "type",
              value?.toString() || "single_choice",
              id,
            )
          }
        >
          <Label className="font-huninn uppercase tracking-tight text-xs text-muted mb-1">
            Type
          </Label>
          <Select.Trigger>
            <Select.Value className="max-w-30 w-30 truncate" />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {quizTypes.map((item, index) => (
                <ListBox.Item id={item.value} textValue={item.name} key={index}>
                  {item.name}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
        <QuestionInput
          label={`Question ${index + 1}`}
          invalid={invalid}
          question={question}
          setQuestion={(value) => handleQuestionChange("question", value, id)}
          deleteVisible={quiz.questions.length > 1}
          onDelete={() => removeQuestion(id)}
          placeholder="Your Question here"
        />
      </div>
      <span className="font-huninn uppercase text-xs text-muted">Options</span>
      <QuizOptions
        questionId={id}
        type={type}
        options={options}
        answer={answer || ""}
      />
      <div className="flex items-center justify-between gap-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => addOption(id)}
          isDisabled={type === "true_false"}
        >
          <Plus /> Add Option
        </Button>
        {index === quiz.questions.length - 1 && (
          <Button size="sm" variant="tertiary" onClick={addQuestion}>
            <Plus /> Add Question
          </Button>
        )}
      </div>
    </div>
  );
}

export default Question;
