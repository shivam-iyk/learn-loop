import { Button, Chip, Modal } from "@heroui/react";
import {
  Check,
  ChevronLeft,
  GripVertical,
  ListTodo,
  Notebook,
  NotebookPen,
  Play,
} from "lucide-react";
import type { Lesson } from "../types/lesson";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import useAppStore from "../store";
import { useQuery } from "@tanstack/react-query";
import { getCourse } from "../services/courses";
import { useParams } from "react-router-dom";
import type { Course } from "../types/course";

function CoverPreview({ image }: { image: string }) {
  return (
    <Modal>
      <Modal.Trigger className="relative group w-full ring-visible rounded-lg overflow-hidden active:transform-none">
        <div className="bg-black/20 transition-opacity duration-300 w-full h-40 left-0 top-0 absolute flex items-center justify-center opacity-0 group-hover:opacity-100" />
        <img src={image} className="w-full h-40 object-cover" />
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Body>
              <img src={image} className="w-full object-contain mx-auto" />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

function Lesson({ lesson, index }: { lesson: Lesson; index: number }) {
  const { ref, handleRef } = useSortable({
    id: lesson.id,
    index,
    type: "item",
    accept: "item",
  });

  return (
    <div
      className="flex justify-between items-center gap-2 border bg-white px-3 py-2 w-full rounded-lg"
      ref={ref}
    >
      <div className="flex items-center gap-2">
        <Button
          className="text-accent bg-accent-soft group hover:bg-background-secondary hover:text-black"
          size="sm"
          isIconOnly
          ref={handleRef}
        >
          <GripVertical className="group-hover:inline hidden" size={20} />
          {lesson.type === "notes" ? (
            <Notebook size={20} className="group-hover:hidden" />
          ) : lesson.type === "video" ? (
            <Play size={20} className="group-hover:hidden" />
          ) : (
            <ListTodo size={20} className="group-hover:hidden" />
          )}
        </Button>
        <p>{lesson.name}</p>
      </div>
      <span className="text-muted uppercase font-huninn tracking-tight text-sm">
        {lesson.type}
      </span>
    </div>
  );
}

function PublishCourse() {
  const { lessons } = useAppStore();
  const { courseId } = useParams();

  const { data } = useQuery<Course>({
    queryKey: ["course", courseId],
    queryFn: () => getCourse(courseId),
  });

  if (!data) return null;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h4 className="text-xl font-semibold tracking-tight">
          Review & Publish
        </h4>
        <p className="text-muted text-sm">
          Almost there, review everything before you publish
        </p>
      </div>
      <div className="bg-background rounded-lg">
        <CoverPreview image={data?.cover} />
        <div className="p-4 flex flex-col justify-center gap-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="sm:text-2xl text-xl font-semibold">{data.name}</h3>
              <p className="max-sm:text-sm text-muted">{data.tagline}</p>
            </div>
            <Chip className="rounded-full border border-accent text-accent capitalize bg-white">
              {data.category}
            </Chip>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-4 p-4 border rounded-lg">
              <span className="text-accent uppercase font-huninn">Level</span>
              <p className="md:text-4xl sm:text-3xl text-2xl font-merriweather capitalize truncate"></p>
            </div>
            <div className="flex flex-col gap-4 p-4 border rounded-lg">
              <span className="text-accent uppercase font-huninn">Lessons</span>
              <p className="md:text-4xl sm:text-3xl text-2xl font-merriweather truncate">
                {Number(data.lessons).toLocaleString("en-IN", {
                  style: "decimal",
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
            <div className="flex flex-col gap-4 p-4 border rounded-lg">
              <span className="text-accent uppercase font-huninn">Price</span>
              <p className="md:text-4xl sm:text-3xl text-2xl font-merriweather truncate">
                {Number(data.price).toLocaleString("en-IN", {
                  currency: "INR",
                  style: "currency",
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
          </div>
          {data?.skills && data.skills.length > 0 && (
            <div>
              <h5 className="text-xl font-medium">Skills</h5>
              <div className="flex items-center gap-2 mt-3">
                {data?.skills &&
                  data?.skills.map((item, index) => (
                    <Chip
                      className="bg-accent rounded-full text-white capitalize"
                      key={index}
                    >
                      {item}
                    </Chip>
                  ))}
              </div>
            </div>
          )}
          <div>
            <h5 className="text-xl font-medium">Lessons</h5>
            <DragDropProvider>
              <div className="flex flex-col gap-2 mt-3">
                {lessons.map((item, index) => (
                  <Lesson lesson={item} key={item.id} index={index} />
                ))}
              </div>
            </DragDropProvider>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Button variant="tertiary" className="mb-4">
            <NotebookPen /> Save Draft
          </Button>
        </div>
      </div>
      <div className="flex justify-between gap-2">
        <Button variant="outline" type="button">
          <ChevronLeft />
          Back
        </Button>
        <Button type="button">
          Publish
          <Check />
        </Button>
      </div>
    </div>
  );
}

export default PublishCourse;
