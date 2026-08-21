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
import {
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  Upload,
} from "lucide-react";
import { nameSchema, notesSchema, videoSchema } from "../schema/lesson";
import RichTextField from "./RichTextField";
import { lazy, Suspense, useEffect, useState } from "react";
import DraggableLessons from "./DraggableLessons";
import { questionSchema } from "../schema/quiz";
import type { LessonFormI } from "../types/lesson";
import type { QuizFormI } from "../types/quiz";
import { Link } from "react-router-dom";

const UploadGuidelines = lazy(() => import("./UploadGuidelines"));
const QuizForm = lazy(() => import("./QuizForm"));

function LessonsForm({
  lessons,
  setLessons,
  handleBack,
  handleNext,
  actionText = "Continue",
  formClassName = "",
  headerClassName = "",
  containerClassName = "",
  toolbarClassName = "",
}: {
  lessons: LessonFormI[];
  setLessons: React.Dispatch<React.SetStateAction<LessonFormI[]>>;
  handleBack: () => void;
  handleNext: () => void;
  actionText?: string;
  formClassName?: string;
  headerClassName?: string;
  containerClassName?: string;
  toolbarClassName?: string;
}) {
  const [invalid, setInvalid] = useState(false);
  const [editing, setEditing] = useState(false);
  const [lesson, setLesson] = useState<LessonFormI>({
    id: 1,
    type: "notes",
    name: "",
    video: "",
    notes: "",
    quiz: null,
  });
  const [quiz, setQuiz] = useState<QuizFormI>({
    passMark: "",
    instructions: "",
    questions: [
      {
        id: 1,
        question: "",
        options: [
          {
            id: 1,
            option: "",
            correct: false,
          },
          {
            id: 2,
            option: "",
            correct: false,
          },
        ],
      },
    ],
  });

  const handleEdit = (lesson: LessonFormI) => {
    setLesson(lesson);
    if (lesson.quiz) setQuiz(lesson.quiz);
    setEditing(true);
  };

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
    let nextId = 0;
    if (editing) {
      setLessons((prev) => {
        nextId = (prev.at(-1)?.id ?? 0) + 1;

        return prev.map((item) => {
          if (lesson.id === item.id) {
            return lesson;
          }
          return item;
        });
      });
      setEditing(false);
    } else {
      setLessons((prev) => {
        nextId = (prev.at(-1)?.id ?? 0) + 1;

        return [
          ...prev,
          { ...lesson, quiz: lesson.type === "quiz" ? quiz : null },
        ];
      });
    }
    setLesson({
      id: nextId + 1,
      type: "notes",
      name: "",
      video: "",
      notes: "",
      quiz: null,
    });
    setInvalid(false);
  };

  useEffect(() => {
    setLesson((prev) => ({ ...prev, id: (lessons.at(-1)?.id || 0) + 1 }));
  }, [lessons]);

  return (
    <div className={cn("flex flex-col gap-6", containerClassName)}>
      <div className={headerClassName}>
        <h4 className="text-xl font-semibold tracking-tight">Add Lessons</h4>
        <p className="text-muted text-sm">Add Lessons to your course</p>
      </div>
      <DraggableLessons
        lessonId={lesson.id}
        lessons={lessons}
        setLessons={(lessons) => setLessons(lessons)}
        handleEdit={handleEdit}
        handleCancelEdit={() => {
          setEditing(false);
          setLesson({
            id: lessons[lessons.length - 1].id + 1,
            type: "notes",
            name: "",
            notes: "",
            video: "",
            quiz: null,
          });
        }}
      />
      <Form
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
              setLesson((prev) => ({
                ...prev,
                type: value?.toString() as LessonFormI["type"],
              }))
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
            onChange={(value) =>
              setLesson((prev) => ({ ...prev, video: value }))
            }
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
              <Link to="https://youtube.com/upload" target="_blank">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-white"
                  isIconOnly
                >
                  <Upload />
                </Button>
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
            onChange={(value) =>
              setLesson((prev) => ({ ...prev, notes: value }))
            }
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
          <Suspense
            fallback={
              <div className="flex flex-col gap-4">
                <Skeleton className="w-28 h-5 rounded-lg" />
                <Skeleton className="w-20 h-3 rounded-lg" />
                <Skeleton className="w-full h-32 rounded-lg" />
                <Skeleton className="w-20 h-3 rounded-lg" />
                <Skeleton className="w-full h-8 rounded-lg" />
                <div className="flex justify-between items-center">
                  <Skeleton className="w-32 h-8 rounded-2xl" />
                  <Skeleton className="w-32 h-8 rounded-2xl" />
                </div>
                <Skeleton className="w-20 h-3 rounded-lg" />
                <Skeleton className="w-full h-8 rounded-lg" />
                <Skeleton className="w-20 h-3 rounded-lg" />
                <Skeleton className="w-full h-32 rounded-lg" />
              </div>
            }
          >
            <QuizForm quiz={quiz} setQuiz={setQuiz} invalid={invalid} />
          </Suspense>
        )}
        <div className="flex justify-center gap-4">
          <Button variant="tertiary" type="submit">
            {lessons.length === 0 ? (
              <Plus />
            ) : editing ? (
              <RefreshCw />
            ) : (
              <ArrowUp />
            )}
            {editing ? "Update" : "Add"} Lesson
          </Button>
        </div>
      </Form>
      <div className="flex justify-between gap-2">
        <Button variant="outline" type="button" onClick={handleBack}>
          <ChevronLeft />
          Back
        </Button>
        <Button
          type="button"
          isDisabled={lessons.length === 0}
          onClick={() => {
            if (lessons.length === 0) return;
            handleNext();
          }}
        >
          {actionText}
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

export default LessonsForm;
