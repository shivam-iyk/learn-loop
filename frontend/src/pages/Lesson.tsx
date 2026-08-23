import { useParams } from "react-router-dom";
import useBoundStore from "../store";
import Reviews from "../components/Reviews";
import CourseContent from "../components/CourseContent";
import { Button, Skeleton } from "@heroui/react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sliders,
} from "lucide-react";
import RateCourse from "../components/RateCourse";
import { Suspense } from "react";
import ReportModal from "../components/ReportModal";

function Lesson() {
  const params = useParams<{ lessonId?: string }>();

  const { course, user, lesson, progress } = useBoundStore();

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex-1 max-h-[80vh] aspect-video overflow-hidden w-full bg-background rounded-2xl relative col-span-3">
        {lesson.video && (
          <iframe
            width="100%"
            height="100%"
            src={`https://youtube.com/embed/${lesson.video.split("/").pop()}?fs=1&autoplay=1&enablejsapi=1&loop=1&playsInline=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;"
            allowFullScreen
          ></iframe>
        )}
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {lesson.video && (
          <div className="flex flex-col gap-4 md:col-span-2">
            <div className="bg-background/20 border border-default rounded-xl p-4">
              <div className="flex items-center gap-2 font-huninn font-semibold tracking-tight uppercase text-foreground">
                <Sliders size={16} className="text-accent" />
                Quick controls
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
                <div className="flex items-center gap-2">
                  {course.owner !== user.id && (
                    <Button>
                      <CheckCircle2 />
                      Mark Complete
                    </Button>
                  )}
                  <Suspense fallback={<Skeleton className="" />}>
                    <ReportModal
                      heading="Report Issue"
                      issues={[
                        "Video not playing",
                        "Audio problem",
                        "Incorrect content",
                        "Missing content",
                        "Broken link/resource",
                        "Quiz/assessment issue",
                        "Typo or grammatical error",
                        "Other",
                      ]}
                    />
                  </Suspense>
                </div>
                <div className="flex items-center gap-2">
                  {parseInt(params?.lessonId || "0") > progress.completed && (
                    <Button variant="outline">
                      <ChevronLeft />
                      <span className="max-md:hidden">Previous</span>
                    </Button>
                  )}
                  <Button variant="outline">
                    <span className="max-md:hidden">Next</span>
                    <ChevronRight />
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-background/50 rounded-lg p-4">
              <h4 className="sm:text-3xl text-2xl font-outfit tracking-tight font-semibold">
                {lesson.name}
              </h4>
              <p className="text-muted font-quicksand mt-4">{lesson.notes}</p>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-4">
          <CourseContent />
          <RateCourse />
          <Reviews />
        </div>
      </div>
    </div>
  );
}

export default Lesson;
