import { Avatar, Modal } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { formatDistance } from "date-fns";
import { getRecentEnrollments } from "../services/instructor";
import { Link } from "react-router-dom";

interface Enrollment {
  id: number;
  course_name: string;
  course_id: number;
  user_avatar: string;
  user_name: string;
  enrolled_at: string;
}

function EnrollmentCard({
  user_avatar,
  user_name,
  course_id,
  course_name,
  enrolled_at,
}: Enrollment) {
  return (
    <div className="flex items-center justify-between gap-4 p-2 border border-default rounded-lg">
      <div className="flex gap-4">
        <Avatar className="rounded-full size-10">
          <Avatar.Image src={user_avatar} />
          <Avatar.Fallback>{user_name[0]}</Avatar.Fallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h6 className="text-foreground leading-4 font-medium truncate tracking-tight">
            {user_name}
          </h6>
          <Link
            to={`/course/${course_id}`}
            className="text-muted text-xs truncate hover:underline"
          >
            {course_name}
          </Link>
        </div>
      </div>
      <span className="text-xs text-muted truncate">
        {formatDistance(new Date(enrolled_at), new Date(), {
          addSuffix: true,
        })?.replace("about ", "")}
      </span>
    </div>
  );
}

function Enrollments() {
  const { data } = useQuery<Enrollment[]>({
    queryKey: ["recent-enrollments"],
    queryFn: getRecentEnrollments,
    staleTime: 15 * 1000 * 60, // 15 minutes
  });

  return (
    <div className="bg-background/70 p-4 rounded-lg w-full">
      <h4 className="text-xl font-outfit font-semibold tracking-tight">
        Enrollments
      </h4>
      <div className="flex flex-col gap-2 mt-4">
        {data?.slice(0, 4).map((item, index) => (
          <EnrollmentCard {...item} key={index} />
        ))}
        {data && data.length > 4 && (
          <Modal>
            <Modal.Trigger className="w-fit ring-visible rounded">
              <button
                tabIndex={-1}
                className="text-accent hover:underline text-sm w-fit p-1"
              >
                Show All
              </button>
            </Modal.Trigger>
            <Modal.Backdrop>
              <Modal.Container>
                <Modal.Dialog>
                  <Modal.CloseTrigger />
                  <Modal.Header>
                    <h4 className="text-xl font-outfit tracking-tighter font-semibold">
                      Enrollments
                    </h4>
                  </Modal.Header>
                  <Modal.Body className="text-black">
                    <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
                      {data?.map((item, index) => (
                        <EnrollmentCard {...item} key={index} />
                      ))}
                    </div>
                  </Modal.Body>
                </Modal.Dialog>
              </Modal.Container>
            </Modal.Backdrop>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default Enrollments;
