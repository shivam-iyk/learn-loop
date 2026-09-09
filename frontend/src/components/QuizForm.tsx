import {
  Button,
  Checkbox,
  Description,
  FieldError,
  Input,
  Label,
  ListBox,
  Select,
  Skeleton,
  TextField,
} from "@heroui/react";
import {
  instructionSchema,
  optionSchema,
  passMarksSchema,
} from "../schema/quiz";
import RichTextField from "./RichTextField";
import { GripVertical, Plus, Trash } from "lucide-react";
import { useSortable } from "@dnd-kit/react/sortable";
import type { QuizFormI } from "../types/quiz";
import { lazy, Suspense } from "react";
import QuestionInput from "./QuestionInput";

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

const QuizGuidelines = lazy(() => import("../components/QuizGuidelines"));

function Option({
  id,
  index,
  option,
  correct,
  question,
  disabled,
  handleDelete,
  handleOptionChange,
}: {
  id: number;
  index: number;
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
        <div className="flex items-center gap-2 flex-1">
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
          <Input placeholder="Option value" className="flex-1" />
        </div>
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
// TODO: Fix the different types of questions
function QuizForm({
  quiz,
  setQuiz,
  invalid,
}: {
  quiz: QuizFormI;
  setQuiz: (quiz: QuizFormI) => void;
  invalid: boolean;
}) {
  const handleOptionChange = (
    value: boolean | string,
    questionId: number,
    optionId: number,
  ) => {
    const options = quiz.questions.find(
      (item) => item.id === questionId,
    )?.options;

    if (!options) return;
    const option = options.find((item) => item.id === optionId);
    if (!option) return;

    if (typeof value === "boolean") {
      option.correct = !option.correct;
    } else if (typeof value === "string") {
      option.option = value;
    }

    setQuiz({
      ...quiz,
      questions: quiz.questions.map((item) => {
        if (item.id === questionId) {
          return { ...item, options };
        }
        return item;
      }),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h6 className="font-semibold tracking-tight text-base">
          Quiz Questions
        </h6>
        <Suspense
          fallback={
            <div className="size-9 flex items-center justify-center">
              <Skeleton className="size-4" />
            </div>
          }
        >
          <QuizGuidelines />
        </Suspense>
      </div>
      <div className="flex flex-col gap-3">
        {quiz.questions.map((item, index) => (
          <div className="flex flex-col gap-2" key={index}>
            <div className="flex max-sm:flex-col gap-2 items-end">
              <Select value={item.type}>
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
                      <ListBox.Item
                        id={item.value}
                        textValue={item.name}
                        key={index}
                      >
                        {item.name}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
              <QuestionInput
                label={`Question ${index + 1}`}
                invalid={invalid}
                question={item.question}
                setQuestion={(value) =>
                  setQuiz({
                    ...quiz,
                    questions: quiz.questions.map((question) => {
                      if (item.id === question.id) {
                        return {
                          ...question,
                          question: value,
                        };
                      }
                      return question;
                    }),
                  })
                }
                deleteVisible={quiz.questions.length >= 0}
                onDelete={() =>
                  setQuiz({
                    ...quiz,
                    questions: quiz.questions.filter(
                      (question) => item.id !== question.id,
                    ),
                  })
                }
                placeholder="Your Question here"
              />
            </div>
            <span className="font-huninn uppercase text-xs text-muted">
              Options
            </span>
            {item.options.map((option, idx) => (
              <Option
                {...option}
                question={index}
                index={index}
                disabled={item.options.length === 2}
                key={idx}
                handleDelete={() =>
                  setQuiz({
                    ...quiz,
                    questions: quiz.questions.map((question, qIdx) => {
                      const options = quiz.questions[qIdx].options;
                      options.pop();
                      if (question.id === item.id) {
                        return {
                          ...item,
                          options,
                        };
                      }
                      return item;
                    }),
                  })
                }
                handleOptionChange={(value) =>
                  handleOptionChange(value, item.id, option.id)
                }
              />
            ))}
            <div className="flex items-center justify-between gap-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setQuiz({
                    ...quiz,
                    questions: quiz.questions.map((question) => {
                      if (question.id === item.id) {
                        return {
                          ...item,
                          options: [
                            ...item.options,
                            {
                              id: item.options[item.options.length - 1].id + 1,
                              option: "",
                              correct: false,
                            },
                          ],
                        };
                      }
                      return item;
                    }),
                  })
                }
              >
                <Plus /> Add Option
              </Button>
              {index === quiz.questions.length - 1 && (
                <Button
                  size="sm"
                  variant="tertiary"
                  onClick={() =>
                    setQuiz({
                      ...quiz,
                      questions: [
                        ...quiz.questions,
                        {
                          id: quiz.questions[quiz.questions.length - 1].id + 1,
                          type: "single_choice",
                          question: "",
                          options: [
                            {
                              id: 1,
                              correct: false,
                              option: "",
                            },
                            {
                              id: 2,
                              correct: false,
                              option: "",
                            },
                          ],
                        },
                      ],
                    })
                  }
                >
                  <Plus /> Add Question
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <TextField
        name="max-marks"
        type="number"
        value={quiz.passMark}
        onChange={(value) => setQuiz({ ...quiz, passMark: value })}
        validate={(value) => {
          const result = passMarksSchema.safeParse(value);
          if (parseInt(value) > quiz.questions.length) {
            return "Pass marks cannot be more than total questions";
          }
          return result.success ? null : result.error.issues[0].message;
        }}
      >
        <Label>
          Marks <span className="text-danger">*</span>
        </Label>
        <Input placeholder="Passing Marks" />
        <Description>
          Make sure marks is less than total no. of questions
        </Description>
        <FieldError />
      </TextField>
      <RichTextField
        label="Instructions"
        value={quiz.instructions}
        onChange={(value) => setQuiz({ ...quiz, instructions: value })}
        placeholder="Instructions to solve the quiz"
        validate={(value) => {
          const result = instructionSchema.safeParse(value);
          console.log(result.error);
          return result.success ? null : result.error.issues[0].message;
        }}
      />
    </div>
  );
}

export default QuizForm;
