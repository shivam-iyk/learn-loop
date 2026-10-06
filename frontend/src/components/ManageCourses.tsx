import { Button, Table, Tooltip } from "@heroui/react";
import useAppStore from "../store";
import {
  Eye,
  Layers,
  Loader2,
  Pen,
  ShieldAlert,
  Star,
  Users,
} from "lucide-react";
import RatingStars from "../components/RatingStars";
import CustomEmptyState from "./CustomEmptyState";
import ArchiveCourseModal from "./ArchiveCourseModal";
import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { getLanguageName } from "../lib/helpers";

function ManageCourses({
  loading,
  isError = false,
  error = null,
}: {
  loading: boolean;
  isError?: boolean;
  error?: any;
}) {
  const navigate = useNavigate();
  const { courses } = useAppStore();

  const published = useMemo(() => {
    return courses.filter((item) => item.status === "published");
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
            <Table.Column className="font-huninn uppercase">
              Language
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
              ) : isError ? (
                <CustomEmptyState
                  icon={ShieldAlert}
                  title="Something went wrong"
                  description={error?.message || "Please try again later"}
                />
              ) : (
                <CustomEmptyState
                  title="No courses found"
                  description="Please try again later"
                  containerClassName="bg-background"
                />
              )
            }
          >
            {published.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell className="font-medium">{item.name}</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2 h-full">
                    <Layers size={16} /> {item.lessons}
                  </div>
                </Table.Cell>
                <Table.Cell>{getLanguageName(item.language)}</Table.Cell>
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
                      stars={item.rating_sum / item.rating_count || 0}
                      starsClassName="hidden!"
                      size={0}
                    />
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <Tooltip delay={0}>
                      <Tooltip.Trigger>
                        <Link
                          to={`/course/${item.id}`}
                          className="button button--primary bg-accent-soft text-accent-soft-foreground button--icon-only"
                        >
                          <Eye />
                        </Link>
                      </Tooltip.Trigger>
                      <Tooltip.Content>
                        <p className="font-outfit">View Course</p>
                      </Tooltip.Content>
                    </Tooltip>
                    <Tooltip delay={0}>
                      <Button
                        className="bg-success-soft text-success-soft-foreground"
                        onClick={() =>
                          navigate(`/create-course/${item.id}?edit=true`)
                        }
                        size="sm"
                        isIconOnly
                      >
                        <Pen />
                      </Button>
                      <Tooltip.Content>
                        <p className="font-outfit">Edit</p>
                      </Tooltip.Content>
                    </Tooltip>
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
