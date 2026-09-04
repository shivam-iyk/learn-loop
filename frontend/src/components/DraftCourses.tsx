import { EmptyState, Skeleton, Table } from "@heroui/react";
import { Layers, Package2 } from "lucide-react";
import DeleteCourseModal from "./DeleteCourseModal";
import PublishCourseModal from "./PublishCourseModal";
import { lazy, Suspense } from "react";

const EditCourseModal = lazy(() => import("./EditCourseModal"));

function DraftCourses() {
  const drafts = [
    {
      id: 1,
      name: "React.js",
      lessons: 4,
      price: 1212,
    },
    {
      id: 2,
      name: "Vue Fundamentals",
      lessons: 6,
      price: 2300,
    },
  ];

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
            renderEmptyState={() => (
              <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                <Package2 />
                <span className="text-sm text-muted">No courses found</span>
              </EmptyState>
            )}
          >
            {drafts.map((item, index) => (
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
                    <PublishCourseModal courseId={item.id} />
                    <Suspense
                      fallback={
                        <Skeleton className="button button--sm min-w-8 rounded-2xl" />
                      }
                    >
                      <EditCourseModal
                        courseId={item.id}
                        buttonClassName="bg-warning-soft text-warning-soft-foreground"
                      />
                    </Suspense>
                    <DeleteCourseModal courseId={item.id} />
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
