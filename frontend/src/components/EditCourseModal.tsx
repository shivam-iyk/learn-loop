import { Button, cn, Modal, Tooltip } from "@heroui/react";
import { Pen } from "lucide-react";
import { useEffect, useState } from "react";
import type { CourseDetailsFormI } from "../types/course";
import CourseDetailsForm from "./CourseDetailsForm";
import LessonsForm from "./LessonsForm";
import type { LessonFormI } from "../types/lesson";
import useBoundStore from "../store";
import CustomEmptyState from "./CustomEmptyState";

function EditCourseModal({
  courseId,
  buttonClassName = "",
}: {
  courseId: number;
  buttonClassName?: string;
}) {
  const { setCourse, lessons: lessonsStore } = useBoundStore();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<CourseDetailsFormI>({
    name: "",
    tagline: "",
    description: "",
    level: "beginner",
    category: "",
    skills: [],
    price: "",
  });
  const [lessons, setLessons] = useState<LessonFormI[]>([]);
  const [cover, setCover] = useState<{ file: File | null; uri: string }>({
    file: null,
    uri: "",
  });
  const [notFound, setNotFound] = useState(false);

  const handleUpdate = () => {
    setOpen(false);
    setStep(1);
    setForm({
      name: "",
      tagline: "",
      description: "",
      level: "beginner",
      category: "",
      skills: [],
      price: "",
    });
    setLessons([]);
    setCover({ file: null, uri: "" });
  };

  useEffect(() => {
    const course = setCourse(courseId);
    if (!course) {
      setNotFound(true);
    } else {
      const { name, category, tagline, description, level, price, skills } =
        course;
      setForm({
        name,
        tagline,
        category,
        description,
        level,
        price: price.toString(),
        skills: skills ?? [],
      });
      setLessons(
        lessonsStore.map((item) => {
          const { course, duration, video, notes, ...lesson } = item;
          return {
            ...lesson,
            video: video || "",
            notes: notes || "",
            quiz: null,
          };
        }),
      );
    }
  }, [lessonsStore]);

  if(notFound) {
    
  }

  return (
    <Modal>
      <Tooltip delay={0}>
        <Button
          className={cn(
            "bg-success-soft text-success-soft-foreground",
            buttonClassName,
          )}
          onClick={() => setOpen(true)}
          size="sm"
          isIconOnly
        >
          <Pen />
        </Button>
        <Tooltip.Content>
          <p className="font-outfit">Edit</p>
        </Tooltip.Content>
      </Tooltip>
      <Modal.Backdrop
        isOpen={open}
        onOpenChange={setOpen}
        isDismissable={false}
      >
        <Modal.Container size="lg" scroll="inside" className="p-5">
          <Modal.Dialog className="my-0 max-h-[95vh]">
            <Modal.CloseTrigger />
            <Modal.Header>
              <h4 className="text-xl font-outfit font-semibold tracking-tight text-center mb-4">
                Edit Course
              </h4>
            </Modal.Header>
            {notFound ? (
              <Modal.Body>
                <CustomEmptyState
                  title="Something went wrong"
                  description="Course not found"
                />
              </Modal.Body>
            ) : (
              <Modal.Body>
                {step === 1 && (
                  <CourseDetailsForm
                    form={form}
                    cover={cover}
                    setForm={setForm}
                    setCover={setCover}
                    handleNext={() => setStep(2)}
                    headerClassName="hidden"
                    formClassName="gap-4 "
                    toolbarClassName="sm:overflow-x-auto sm:flex-nowrap [&>*]:first:overflow-x-scroll [&>*]:first:flex-nowrap"
                  />
                )}
                {step === 2 && (
                  <LessonsForm
                    lessons={lessons}
                    setLessons={setLessons}
                    handleBack={() => setStep(1)}
                    handleNext={handleUpdate}
                    headerClassName="hidden"
                    actionText="Update"
                    toolbarClassName="sm:flex-nowrap [&>*]:first:overflow-x-scroll [&>*]:first:flex-nowrap"
                  />
                )}
              </Modal.Body>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default EditCourseModal;
