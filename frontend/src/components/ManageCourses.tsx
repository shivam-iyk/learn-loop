import { Button, Skeleton, Table, Tooltip } from "@heroui/react";
import useAppStore from "../store";
import { Eye, Layers, Star, Users } from "lucide-react";
import RatingStars from "../components/RatingStars";
import CustomEmptyState from "./CustomEmptyState";
import ArchiveCourseModal from "./ArchiveCourseModal";
import { Link } from "react-router-dom";
import { lazy, Suspense } from "react";

const EditCourseModal = lazy(() => import("./EditCourseModal"));

function ManageCourses() {
  const { courses } = useAppStore();

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Team members" className="min-w-[600px]">
          <Table.Header>
            <Table.Column className="font-huninn uppercase" isRowHeader>
              Course
            </Table.Column>
            <Table.Column className="font-huninn uppercase">
              Lessons
            </Table.Column>
            <Table.Column className="font-huninn uppercase">Price</Table.Column>
            <Table.Column className="font-huninn uppercase">
              Students
            </Table.Column>
            <Table.Column className="font-huninn uppercase">
              Rating
            </Table.Column>
            <Table.Column className="font-huninn uppercase">
              Actions
            </Table.Column>
          </Table.Header>
          <Table.Body
            renderEmptyState={() => (
              <CustomEmptyState
                title="No courses found"
                description="Please try again later"
                containerClassName="bg-white"
              />
            )}
          >
            {courses.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell className="font-medium">{item.name}</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2 h-full">
                    <Layers size={16} /> {item.lessons}
                  </div>
                </Table.Cell>
                <Table.Cell className="text-accent text-lg">
                  {item.price.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  })}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2 h-full">
                    <Users size={16} />
                    {item.students_enrolled}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2 h-full">
                    <Star className="text-warning" size={16} />
                    <RatingStars
                      stars={item.rating_sum / item.rating_count}
                      starsClassName="hidden!"
                      size={0}
                    />
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <Tooltip delay={0}>
                      <Link to={`/course/${item.id}`}>
                        <Button
                          className="bg-accent-soft text-accent-soft-foreground"
                          size="sm"
                          isIconOnly
                        >
                          <Eye />
                        </Button>
                      </Link>
                      <Tooltip.Content>
                        <p className="font-outfit">View Course</p>
                      </Tooltip.Content>
                    </Tooltip>
                    <Suspense
                      fallback={
                        <Skeleton className="button button--sm min-w-8 rounded-2xl" />
                      }
                    >
                      <EditCourseModal courseId={item.id} />
                    </Suspense>
                    <ArchiveCourseModal courseId={item.id} />
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}

export default ManageCourses;
