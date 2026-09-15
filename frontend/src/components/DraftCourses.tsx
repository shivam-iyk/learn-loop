import { EmptyState, Table, toast } from "@heroui/react";
import { Edit2, Layers, Loader2, Package2 } from "lucide-react";
import DiscardDraftModal from "./DiscardDraftModal";
import PublishCourseModal from "./PublishCourseModal";
import { useMemo } from "react";
import useAppStore from "../store";
import CustomEmptyState from "./CustomEmptyState";
import { Link } from "react-router-dom";

function DraftCourses({ loading }: { loading: boolean }) {
  const { courses } = useAppStore();

  const drafts = useMemo(() => {
    return courses.filter((item) => item.status === "draft");
  }, [courses]);

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
              Actions
            </Table.Column>
          </Table.Header>
          <Table.Body
            renderEmptyState={() =>
              loading ? (
                <CustomEmptyState
                  title=""
                  description=""
                  icon={Loader2}
                  iconContainerClassName="bg-transparent"
                  textContainerClassName="hidden"
                  iconClassName="animate-spin"
                  containerClassName="bg-background"
                />
              ) : (
                <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                  <Package2 />
                  <span className="text-sm text-muted">No courses found</span>
                </EmptyState>
              )
            }
          >
            {drafts?.map((item, index) => (
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
                  <div className="flex items-center gap-2">
                    <PublishCourseModal
                      courseId={item.id}
                      disabled={item.lessons === 0}
                      handleDisabledClick={() =>
                        toast.warning("Course cannot be published", {
                          description:
                            "Please add one or more lessons to publish",
                        })
                      }
                    />
                    <Link
                      to={`/create-course/${item.id}`}
                      className="button button--icon-only bg-warning-soft text-warning-soft-foreground"
                    >
                      <Edit2 size={16} />
                    </Link>
                    <DiscardDraftModal courseId={item.id} />
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

export default DraftCourses;
