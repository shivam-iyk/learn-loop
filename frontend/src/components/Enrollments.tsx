import { Avatar, Modal } from "@heroui/react";
import { formatDistance } from "date-fns";

function EnrollmentCard({
  avatar,
  name,
  course,
  created_at,
}: {
  avatar: string;
  name: string;
  course: string;
  created_at: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-2 border border-default rounded-lg">
      <div className="flex gap-4">
        <Avatar className="rounded-full size-10">
          <Avatar.Image src={avatar} />
          <Avatar.Fallback>{name[0]}</Avatar.Fallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h6 className="text-foreground font-medium truncate tracking-tight">{name}</h6>
          <p className="text-muted text-xs truncate">{course}</p>
        </div>
      </div>
      <span className="text-xs text-muted truncate">
        {formatDistance(new Date(created_at), new Date(), {
          addSuffix: true,
        })?.replace("about ", "")}
      </span>
    </div>
  );
}

function Enrollments() {
  const enrollments = [
    {
      avatar: "/avatar-small.png",
      name: "Aman",
      course: "React Tutorial",
      created_at: "2026-06-09T06:05:01.891Z",
    },
    {
      avatar: "/avatar-small.png",
      name: "Sara",
      course: "CSS Tricks",
      created_at: "2026-06-09T06:05:01.891Z",
    },
    {
      avatar: "/avatar-small.png",
      name: "John",
      course: "JavaScript Deep Dive",
      created_at: "2026-06-09T06:05:01.891Z",
    },
    {
      avatar: "/avatar-small.png",
      name: "Emily",
      course: "Understanding APIs",
      created_at: "2026-06-09T06:05:01.891Z",
    },
    {
      avatar: "/avatar-small.png",
      name: "Aman",
      course: "React Tutorial",
      created_at: "2026-06-09T06:05:01.891Z",
    },
    {
      avatar: "/avatar-small.png",
      name: "Sara",
      course: "CSS Tricks",
      created_at: "2026-06-09T06:05:01.891Z",
    },
    {
      avatar: "/avatar-small.png",
      name: "John",
      course: "JavaScript Deep Dive",
      created_at: "2026-06-09T06:05:01.891Z",
    },
    {
      avatar: "/avatar-small.png",
      name: "Emily",
      course: "Understanding APIs",
      created_at: "2026-06-09T06:05:01.891Z",
    },
    {
      avatar: "/avatar-small.png",
      name: "Aman",
      course: "React Tutorial",
      created_at: "2026-06-09T06:05:01.891Z",
    },
    {
      avatar: "/avatar-small.png",
      name: "Sara",
      course: "CSS Tricks",
      created_at: "2026-06-09T06:05:01.891Z",
    },
    {
      avatar: "/avatar-small.png",
      name: "John",
      course: "JavaScript Deep Dive",
      created_at: "2026-06-09T06:05:01.891Z",
    },
    {
      avatar: "/avatar-small.png",
      name: "Emily",
      course: "Understanding APIs",
      created_at: "2026-06-09T06:05:01.891Z",
    },
    {
      avatar: "/avatar-small.png",
      name: "Aman",
      course: "React Tutorial",
      created_at: "2026-06-09T06:05:01.891Z",
    },
    {
      avatar: "/avatar-small.png",
      name: "Sara",
      course: "CSS Tricks",
      created_at: "2026-06-09T06:05:01.891Z",
    },
    {
      avatar: "/avatar-small.png",
      name: "John",
      course: "JavaScript Deep Dive",
      created_at: "2026-06-09T06:05:01.891Z",
    },
    {
      avatar: "/avatar-small.png",
      name: "Emily",
      course: "Understanding APIs",
      created_at: "2026-06-09T06:05:01.891Z",
    },
    {
      avatar: "/avatar-small.png",
      name: "Aman",
      course: "React Tutorial",
      created_at: "2026-06-09T06:05:01.891Z",
    },
    {
      avatar: "/avatar-small.png",
      name: "Sara",
      course: "CSS Tricks",
      created_at: "2026-06-09T06:05:01.891Z",
    },
    {
      avatar: "/avatar-small.png",
      name: "John",
      course: "JavaScript Deep Dive",
      created_at: "2026-06-09T06:05:01.891Z",
    },
    {
      avatar: "/avatar-small.png",
      name: "Emily",
      course: "Understanding APIs",
      created_at: "2026-06-09T06:05:01.891Z",
    },
    {
      avatar: "/avatar-small.png",
      name: "Aman",
      course: "React Tutorial",
      created_at: "2026-06-09T06:05:01.891Z",
    },
    {
      avatar: "/avatar-small.png",
      name: "Sara",
      course: "CSS Tricks",
      created_at: "2026-06-09T06:05:01.891Z",
    },
    {
      avatar: "/avatar-small.png",
      name: "John",
      course: "JavaScript Deep Dive",
      created_at: "2026-06-09T06:05:01.891Z",
    },
    {
      avatar: "/avatar-small.png",
      name: "Emily",
      course: "Understanding APIs",
      created_at: "2026-06-09T06:05:01.891Z",
    },
  ];

  return (
    <div className="bg-background/50 p-4 rounded-lg w-full">
      <h4 className="text-xl font-outfit font-semibold tracking-tight">
        Enrollments
      </h4>
      <div className="flex flex-col gap-2 mt-4">
        {enrollments.slice(0, 4).map((item, index) => (
          <EnrollmentCard {...item} key={index} />
        ))}
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
                    {enrollments.map((item, index) => (
                      <EnrollmentCard {...item} key={index} />
                    ))}
                  </div>
                </Modal.Body>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      </div>
    </div>
  );
}

export default Enrollments;
