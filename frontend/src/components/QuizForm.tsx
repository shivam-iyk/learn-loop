import {
  Description,
  FieldError,
  Input,
  Label,
  Separator,
  Skeleton,
  TextField,
} from "@heroui/react";
import { instructionSchema, passMarksSchema } from "../schema/quiz";
import RichTextField from "./RichTextField";
import { Fragment, lazy, Suspense, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQuiz } from "../services/quiz";
import QuizSkeleton from "./QuizSkeleton";
import Question from "./Question";
import useAppStore from "../store";

const QuizGuidelines = lazy(() => import("../components/QuizGuidelines"));

function QuizForm({ lesson, invalid }: { lesson?: number; invalid: boolean }) {
  const { quiz, setQuiz } = useAppStore();

  const { data, isLoading } = useQuery({
    queryKey: ["quiz", lesson],
    queryFn: () => getQuiz(lesson ?? 0),
    enabled: !!lesson,
  });

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
      <div className="flex flex-col gap-4">
        {quiz.questions.map((item, index) => (
          <Fragment key={index}>
            <Question index={index} invalid={invalid} key={index} {...item} />
            <Separator key={`separator` + index} />
          </Fragment>
        ))}
      </div>
      <TextField
        name="max-marks"
        type="number"
        onChange={(value) => setQuiz({ ...quiz, pass_mark: parseInt(value) })}
        validate={(value) => {
          const result = passMarksSchema.safeParse(value);
          if (parseInt(value) > quiz.questions.length) {
            return "Pass marks cannot be more than total questions";
          }
          return result.success ? null : result.error.issues[0].message;
        }}
      >
        <Label>
          Passing Marks <span className="text-danger">*</span>
        </Label>
        <Input placeholder="Passing Marks" />
        <Description>
          Make sure marks is less than total number of questions
        </Description>
        <FieldError />
      </TextField>
      <RichTextField
        label="Instructions"
        value={quiz?.instructions || ""}
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
