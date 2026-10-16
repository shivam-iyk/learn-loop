import type { Message as MessageI } from "../types/message";
import useAppStore from "../store";
import { formatDistanceToNow } from "date-fns";
import {
  Avatar,
  Button,
  Chip,
  Dropdown,
  Label,
  Modal,
  toast,
} from "@heroui/react";
import {
  Copy,
  Edit2,
  EllipsisVertical,
  Loader2,
  Reply,
  Trash,
} from "lucide-react";
import { useState } from "react";

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
              <Avatar.Image src={avatar || "/avatar-small.png"} />
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
  hideTime = false,
  hideUserPreview = false,
  handleDelete,
  handleReply,
  handleEdit,
}: {
  message: MessageI;
  hideTime?: boolean;
  hideUserPreview?: boolean;
  handleDelete: () => void;
  handleReply: () => void;
  handleEdit: () => void;
}) {
  const { user } = useAppStore();

  const [showTime, setShowTime] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast.success("Message copied successfully");
    } catch (error) {
      toast.danger("Something went wrong", {
        description: "Cannot copy message",
      });
    }
  };

  return (
    <div
      className={`flex flex-col group w-full ${message.sender === user.id ? "items-end" : "items-start"}`}
    >
      <div
        className={`flex ${message.sender === user.id ? "flex-row" : "flex-row-reverse"} items-center gap-2 max-w-5/6`}
      >
        {message?.isLoading ? (
          <Loader2 className="animate-spin size-5" />
        ) : (
          <div
            className={`flex ${message.sender === user.id ? "flex-row" : "flex-row-reverse"} items-center gap-1`}
          >
            <Dropdown>
              <Button
                type="button"
                aria-label="Options"
                variant="ghost"
                size="sm"
                className="group-hover:visible size-6 sm:invisible rounded-full"
                isIconOnly
              >
                <EllipsisVertical size={10} className="outline-none" />
              </Button>
              <Dropdown.Popover placement="bottom">
                <Dropdown.Menu>
                  {message.sender === user.id && (
                    <Dropdown.Item
                      id="edit-message"
                      textValue="Edit Message"
                      onClick={handleEdit}
                    >
                      <Edit2 className="size-4 shrink-0 text-accent" />
                      <Label className="text-accent">Edit</Label>
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item
                    id="copy-message"
                    textValue="Copy Message"
                    onClick={handleCopy}
                  >
                    <Copy className="size-4 shrink-0" />
                    <Label>Copy</Label>
                  </Dropdown.Item>
                  <Dropdown.Item
                    id="delete-message"
                    textValue="Delete Message"
                    onClick={handleDelete}
                    variant="danger"
                  >
                    <Trash className="size-4 shrink-0 text-danger" />
                    <Label>Delete</Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
            <Button
              variant="ghost"
              className="group-hover:visible size-6 sm:invisible rounded-full"
              onClick={handleReply}
              size="sm"
              isIconOnly
            >
              <Reply size={8} />
            </Button>
          </div>
        )}
        <div
          className={`flex flex-col max:w-4/5 p-3 rounded-4xl text-sm ${message.sender === user.id ? "bg-accent text-white" : "bg-background"}`}
          onClick={() => setShowTime((prev) => !prev)}
        >
          {message.sender !== user.id && !hideUserPreview && (
            <UserPreview
              avatar={message.avatar || "/avatar-small.png"}
              name={message.name}
              role={message.role}
            />
          )}
          {message.content}
        </div>
      </div>
      {(!hideTime || showTime) && (
        <span
          className={`text-xs pl-2 text-muted ${message.sender === user.id ? "self-end" : "self-start"}`}
          title={message.created_at}
        >
          {formatDistanceToNow(new Date(message.created_at), {
            addSuffix: true,
            includeSeconds: true,
          }).replace("about ", "")}
        </span>
      )}
    </div>
  );
}

export default MessageBubble;
