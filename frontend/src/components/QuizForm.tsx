import {
  Button,
  Description,
  FieldError,
  Input,
  Label,
  ListBox,
  Select,
  Skeleton,
  TextField,
} from "@heroui/react";
import { instructionSchema, passMarksSchema } from "../schema/quiz";
import RichTextField from "./RichTextField";
import { Plus } from "lucide-react";
import type { QuizFormI } from "../types/quiz";
import { lazy, Suspense, useEffect } from "react";
import QuestionInput from "./QuestionInput";
import { useQuery } from "@tanstack/react-query";
import { getQuiz } from "../services/quiz";
import Option from "./QuizOption";
import QuizSkeleton from "./QuizSkeleton";

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

// TODO: Fix the different types of questions
function QuizForm({
  quiz,
  lesson,
  setQuiz,
  invalid,
}: {
  quiz: QuizFormI;
  setQuiz: (quiz: QuizFormI) => void;
  lesson?: number;
  invalid: boolean;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["quiz", lesson],
    queryFn: () => getQuiz(lesson ?? 0),
    enabled: !!lesson,
  });

  const addOption = (questionId: number) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.map((question) => {
        if (question.id === questionId) {
          return {
            ...question,
            options: [
              ...question.options,
              {
                id: question.options[question.options.length - 1].id + 1,
                option: "",
                correct: false,
              },
            ],
          };
        }
        return question;
      }),
    });
  };

  const addQuestion = (questionId: number) => {
    const lastOptionId = quiz.questions[questionId]?.options.at(-1)?.id || 1;
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
              id: lastOptionId + 1,
              correct: false,
              option: "",
            },
            {
              id: lastOptionId + 2,
              correct: false,
              option: "",
            },
          ],
        },
      ],
    });
  };

  const handleQuestionChange = (
    target: string,
    value: string,
    questionId: number,
  ) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.map((question) => {
        if (questionId === question.id) {
          return {
            ...question,
            [target]: value,
          };
        }
        return question;
      }),
    });
  };

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
      option.correct = !option?.correct;
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

  useEffect(() => {
    if (!data) return;
    setQuiz(data);
  }, [data]);

  if (isLoading) {
    return <QuizSkeleton />;
  }

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
              <Select
                value={item.type}
                onChange={(value) =>
                  handleQuestionChange(
                    "type",
                    value?.toString() || "single_choice",
                    item.id,
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
                  handleQuestionChange("question", value, item.id)
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
            {item.type === "fill" && (
              <TextField>
                <Input placeholder="Answer " />
              </TextField>
            )}
            <span className="font-huninn uppercase text-xs text-muted">
              Options
            </span>
            {item.options.map((option, idx) => (
              <Option
                {...option}
                type={item.type}
                correct={option?.correct || false}
                question={index}
                index={index}
                disabled={item?.options?.length === 2}
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
                onClick={() => addOption(item.id)}
              >
                <Plus /> Add Option
              </Button>
              {index === quiz.questions.length - 1 && (
                <Button
                  size="sm"
                  variant="tertiary"
                  onClick={() => addQuestion(item.id)}
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
        value={quiz.pass_mark}
        onChange={(value) => setQuiz({ ...quiz, pass_mark: value })}
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
          Make sure marks is less than total number of questions
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
