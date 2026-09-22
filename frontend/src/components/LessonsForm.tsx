import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
  Select,
  ListBox,
  Skeleton,
  cn,
} from "@heroui/react";
import { ArrowUp, Loader2, Plus, RefreshCw, Upload } from "lucide-react";
import { nameSchema, notesSchema, videoSchema } from "../schema/lesson";
import RichTextField from "./RichTextField";
import { lazy, Suspense, useState } from "react";
import { questionSchema } from "../schema/quiz";
import type { LessonFormI } from "../types/lesson";
import type { QuizFormI } from "../types/quiz";
import { Link } from "react-router-dom";
import useAppStore from "../store";
import QuizSkeleton from "./QuizSkeleton";

const UploadGuidelines = lazy(() => import("./UploadGuidelines"));
const QuizForm = lazy(() => import("./QuizForm"));

function LessonsForm({
  lesson,
  setLesson,
  saving,
  editing,
  handleAdd,
  handleEdit,
  formClassName = "",
  toolbarClassName = "",
}: {
  lesson: LessonFormI;
  saving: boolean;
  editing: boolean;
  setLesson: (lesson: LessonFormI) => void;
  handleAdd: (lesson: LessonFormI) => void;
  handleEdit: (lesson: LessonFormI) => void;
  actionText?: string;
  formClassName?: string;
  toolbarClassName?: string;
}) {
  const { lessons } = useAppStore();

  const [invalid, setInvalid] = useState(false);
  const [quiz, setQuiz] = useState<QuizFormI>({
    pass_mark: "",
    instructions: "",
    questions: [
      {
        id: 1,
        type: "single_choice",
        question: "",
        options: [
          {
            id: 1,
            option: "",
          },
          {
            id: 2,
            option: "",
          },
        ],
      },
    ],
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    switch (lesson.type) {
      case "notes":
        const notes = notesSchema.safeParse(lesson.notes);
        setInvalid(!notes.success);
        break;
      case "video":
        const result = notesSchema.safeParse(lesson.notes);
        setInvalid(!result.success);
        break;
      case "quiz":
        quiz.questions.map((item) => {
          const result = questionSchema.safeParse(item);
          setInvalid(!result.success);
          return;
        });
        break;
      default:
        return;
    }
    if (editing) {
      if (lesson?.quiz) setQuiz(lesson.quiz);
      handleEdit(lesson);
    } else {
      handleAdd(lesson);
    }
    setInvalid(false);
  };

  return (
    <Form
      id="lessons-form"
      className={cn(
        "flex flex-col gap-4 bg-background/50 border p-4 rounded-xl",
        formClassName,
      )}
      onSubmit={handleSubmit}
      onInvalid={() => setInvalid(true)}
    >
      <h5 className="text-xl font-semibold font-outfit text-center tracking-tight text-accent">
        {editing ? "Edit Lesson" : "Lesson Details"}
      </h5>
      <div className="grid sm:grid-cols-4 gap-4">
        <Select
          name="type"
          placeholder="Type of Lesson"
          value={lesson.type}
          onChange={(value) =>
            setLesson({
              ...lesson,
              type: value?.toString() as LessonFormI["type"],
            })
          }
        >
          <Label>
            Type <span className="text-danger">*</span>
          </Label>
          <Select.Trigger>
            <Select.Value className="capitalize" />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {["notes", "video", "quiz"].map((item, index) => (
                <ListBox.Item
                  id={item}
                  textValue={item}
                  className="capitalize"
                  key={index}
                >
                  {item}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
        <TextField
          name="name"
          type="text"
          autoComplete="name"
          className="sm:col-span-3"
          value={lesson.name}
          onChange={(value) => setLesson({ ...lesson, name: value })}
          validate={(value) => {
            const result = nameSchema.safeParse(value);
            return result.success ? null : result.error.issues[0].message;
          }}
        >
          <Label>
            {lesson.type === "quiz" ? "Title" : "Name"}{" "}
            <span className="text-danger">*</span>
          </Label>
          <Input
            placeholder={
              lesson.type === "quiz" ? "Title of Quiz" : "Name the lesson"
            }
          />
          <FieldError />
        </TextField>
      </div>
      {lesson.type === "video" && (
        <TextField
          name="video"
          type="text"
          className="flex-1 col-span-3"
          value={lesson.video}
          onChange={(value) => setLesson({ ...lesson, video: value })}
          validate={(value) => {
            const result = videoSchema.safeParse(value);
            return result.success ? null : result.error.issues[0].message;
          }}
        >
          <Label>
            Video <span className="text-danger">*</span>
          </Label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="URL of the video uploaded to YouTube"
                className="w-full"
              />
              <Suspense fallback={<Skeleton className="size-4" />}>
                <UploadGuidelines />
              </Suspense>
            </div>
            <Link
              to="https://youtube.com/upload"
              className="button button--outline button--icon-only"
              target="_blank"
            >
              <Upload />
            </Link>
          </div>
          <Description>
            Please make sure that video must be public or unlisted
          </Description>
          <FieldError />
        </TextField>
      )}
      {(lesson.type === "video" || lesson.type === "notes") && (
        <RichTextField
          label={
            <>
              Notes
              {lesson.type === "notes" && (
                <span className="text-danger"> *</span>
              )}
            </>
          }
          toolbarClassName={toolbarClassName}
          value={lesson.notes}
          placeholder="Provide notes to students"
          onChange={(value) => setLesson({ ...lesson, notes: value })}
          invalid={invalid}
          validate={(value) => {
            if (lesson.type !== "notes") return null;
            const result = notesSchema.safeParse(value);
            return result.success ? null : result.error.issues[0].message;
          }}
          resetKey={lesson.id}
        />
      )}
      {lesson.type === "quiz" && (
        <Suspense fallback={<QuizSkeleton />}>
          <QuizForm
            lesson={lesson.id}
            quiz={quiz}
            setQuiz={setQuiz}
            invalid={invalid}
          />
        </Suspense>
      )}
      <div className="flex justify-center gap-4">
        <Button variant="tertiary" className="min-w-32" type="submit">
          {saving ? (
            <Loader2 className="animate-spin" />
          ) : lessons.length === 0 ? (
            <Plus />
          ) : editing ? (
            <RefreshCw />
          ) : (
            <ArrowUp />
          )}
          {saving ? null : editing ? "Update Lesson" : "Add Lesson"}
        </Button>
      </div>
    </Form>
  );
}

export default LessonsForm;
