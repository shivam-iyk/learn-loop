import type { MessageI } from "../types/message";
import useAppStore from "../store";
import { formatDistance } from "date-fns";
import type { RefObject } from "react";
import { Avatar, Chip, Modal } from "@heroui/react";

function UserPreview({
  avatar,
  name,
  role,
}: {
  avatar: string;
  name: string;
  role: "instructor" | "student";
}) {
  return (
    <Modal>
      <Modal.Trigger className="ring-visible size-fit h-fit p-0 font-outfit w-fit hover:underline text-accent text-xs pt-0">
        {name}
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Avatar className="rounded-full size-24 mx-auto">
              <Avatar.Image src={avatar} />
              <Avatar.Fallback>{name[0]}</Avatar.Fallback>
            </Avatar>
            <Modal.Body className="flex flex-col gap-2 items-center justify-center">
              <h4 className="text-3xl font-outfit tracking-tight font-semibold text-foreground text-center">
                {name}
              </h4>
              <Chip className="uppercase font-huninn mx-auto rounded-full text-accent-soft-foreground bg-accent-soft">
                {role}
              </Chip>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

function MessageBubble({
  message,
  ref,
}: {
  message: MessageI;
  ref: RefObject<HTMLDivElement | null> | null;
}) {
  const { user } = useAppStore();

  return (
    <div
      className={`flex flex-col ${message.user === user.id ? "self-end" : "self-start"}`}
    >
      <div
        className={`flex flex-col max:w-4/5 p-3 rounded-4xl ${message.user === user.id ? "bg-accent text-white self-end" : "bg-background self-start"}`}
        ref={ref}
      >
        {message.user !== user.id && (
          <UserPreview
            avatar={message.avatar}
            name={message.name}
            role={message.role}
          />
        )}
        {message.message}
      </div>
      <span
        className={`text-xs pl-2 text-muted ${message.user === user.id ? "self-end" : "self-start"}`}
        title={message.created_at}
      >
        {formatDistance(new Date(message.created_at), new Date(), {
          addSuffix: true,
        }).replace("about ", "")}
      </span>
    </div>
  );
}

export default MessageBubble;
