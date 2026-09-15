import { Button, cn, Modal, Tooltip } from "@heroui/react";
import { Pen } from "lucide-react";
import { useEffect, useState } from "react";
import type { CourseDetailsFormI } from "../types/course";
import CourseDetailsForm from "./CourseDetailsForm";
import type { LessonFormI } from "../types/lesson";
import useAppStore from "../store";
import CustomEmptyState from "./CustomEmptyState";

function EditCourseModal({
  buttonClassName = "",
}: {
  courseId: number;
  buttonClassName?: string;
}) {
  const { course, lessons: lessonsStore } = useAppStore();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<CourseDetailsFormI>({
    name: "",
    tagline: "",
    description: "",
    category: "",
    skills: [],
    price: "",
  });
  const [_, setLessons] = useState<LessonFormI[]>([]);
  const [cover, setCover] = useState<{ file: File | null; uri: string }>({
    file: null,
    uri: "",
  });
  const [notFound] = useState(false);

  // const handleUpdate = () => {
  //   setOpen(false);
  //   setStep(1);
  //   setForm({
  //     name: "",
  //     tagline: "",
  //     description: "",
  //     category: "",
  //     skills: [],
  //     price: "",
  //   });
  //   setLessons([]);
  //   setCover({ file: null, uri: "" });
  // };

  useEffect(() => {
    const { name, category, tagline, description, price, skills } = course;
    setForm({
      name,
      tagline,
      category,
      description,
      price: String(price) || "",
      skills: skills ?? [],
    });
    setLessons(
      lessonsStore.map((item) => {
        const { course, video, notes, ...lesson } = item;
        return {
          ...lesson,
          video: video || "",
          notes: notes || "",
          quiz: null,
        };
      }),
    );
  }, [lessonsStore]);

  if (notFound) {
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
              <Modal.Body className="text-foreground">
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
                {/* {step === 2 && <LessonsForm />} */}
              </Modal.Body>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default EditCourseModal;
