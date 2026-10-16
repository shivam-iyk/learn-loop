import {
  Button,
  FieldError,
  Form,
  Input,
  Skeleton,
  TextField,
  toast,
} from "@heroui/react";
import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
  type RefObject,
} from "react";
import useAppStore from "../store";
import { messageSchema } from "../schema/message";
import { Check, Send, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "../services/message";
import { useApiErrorHandler } from "../hooks/error";
import type { Message, MessagePage, MessageReply } from "../types/message";
import type { ApiError } from "../services/api";
import { editMessage as editMessageApi } from "../services/message";

const AttachmentDropdown = lazy(() => import("./AttachmentDropdown"));

export interface EditMessage {
  id: number;
  editing: boolean;
}

function MessageInput({
  reply,
  editMessage,
  inputRef,
  courseId,
  scrollToBottomRef,
  setReply,
  setEditMessage,
}: {
  reply: MessageReply;
  editMessage: EditMessage;
  courseId: string | number;
  scrollToBottomRef: RefObject<Boolean>;
  inputRef: RefObject<HTMLInputElement | null>;
  setReply: (reply: MessageReply) => void;
  setEditMessage: (editing: EditMessage) => void;
}) {
  const queryClient = useQueryClient();
  const handleError = useApiErrorHandler();

  const { user, messages, pagination, setMessages, addMessage, updateMessage } =
    useAppStore();

  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<{
    file: File | null;
    url: string;
  }>({
    file: null,
    url: "",
  });

  const sendMessageMutation = useMutation<Message, ApiError, FormData>({
    mutationFn: (formData) => sendMessage(formData),
    onSuccess: (data) => {
      const tempId = sendMessageMutation.variables?.get("tempId");
      if (typeof tempId !== "string" && typeof tempId !== "number") return;
      updateMessage(data, tempId);
      queryClient.setQueryData(
        ["messages", courseId, pagination.page],
        (oldData: MessagePage) => ({
          ...oldData,
          messages: [data, ...oldData.messages],
        }),
      );
    },
    onError: (err) => {
      const { message, errorCode, description } = handleError(err);

      const messageId = sendMessageMutation.variables?.get("tempId");
      setMessages(messages.filter((item) => item.id !== Number(messageId)));

      const showRetry = [
        "UPLOAD_FAILED",
        "VALIDATION",
        "IMAGE_SIZE",
        "MESSAGE_REQUIRED",
      ].includes(errorCode || "");

      toast.danger(message, {
        description,
        actionProps: showRetry
          ? {
              size: "sm",
              children: "Resend",
              variant: "ghost",
              onPress: () =>
                sendMessageMutation.mutate(sendMessageMutation.variables!),
            }
          : undefined,
      });
    },
  });

  const editMessageMutation = useMutation<
    Message,
    ApiError,
    { id: number | string; content: string }
  >({
    mutationFn: ({ id, content }) => editMessageApi(id, content),
    onSuccess: (data) => {
      updateMessage(data, data?.id);
      queryClient.setQueryData(
        ["messages", courseId, pagination.page],
        (oldData: MessagePage) => ({
          ...oldData,
          messages: oldData.messages.map((item) => {
            if (item.id === data?.id) {
              return data;
            }
            return item;
          }),
        }),
      );
    },
    onError: (err) => {
      const { message, errorCode, description } = handleError(err);
      const messageId = editMessageMutation.variables?.id;

      const showRetry = [
        "VALIDATION",
        "UPLOAD_FAILED",
        "IMAGE_SIZE",
        "MESSAGE_REQUIRED",
        "MESSAGE_NOT_FOUND",
        "UNAUTHORIZED",
      ].includes(errorCode || "");

      const prevMsg =
        messages.find((item) => item.id === messageId)?.content || "";
      setMessages(
        messages.map((item) => {
          if (item.id === messageId) {
            return {
              ...item,
              content: prevMsg,
              isLoading: false,
            };
          }
          return item;
        }),
      );
      toast.danger(message, {
        description,
        actionProps: showRetry
          ? {
              size: "sm",
              variant: "ghost",
              children: "Retry",
              onPress: () =>
                editMessageMutation.mutate(editMessageMutation.variables!),
            }
          : undefined,
      });
    },
  });

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message) return;

    const prevMsg = messages.find((item) => item.id === editMessage.id);
    if (prevMsg) {
      updateMessage(
        {
          ...prevMsg,
          content: message,
          isLoading: true,
        },
        editMessage.id,
      );
    }
    editMessageMutation.mutate({
      id: editMessage.id,
      content: message,
    });
    setMessage("");
    setEditMessage({
      id: 0,
      editing: false,
    });
  };

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message) return;

    const tempId = Date.now();
    const formData = new FormData();

    formData.append("course", courseId.toString());
    formData.append("message", message);
    if (attachment?.file) formData.append("attachment", attachment.file);
    formData.append("tempId", tempId.toString());

    sendMessage(formData);
    setMessage("");

    const msg = {
      id: tempId,
      attachment: null,
      avatar: user?.avatar || null,
      course: Number(courseId),
      content: message,
      created_at: new Date().toISOString(),
      name: user.name,
      role: user.role === "admin" ? "instructor" : user.role,
      sender: user.id,
      isLoading: true,
    };

    if (scrollToBottomRef?.current) scrollToBottomRef.current = true;
    addMessage(msg);
  };

  useEffect(() => {
    if (editMessage.editing) {
      setMessage(
        messages.find((item) => item.id === editMessage.id)?.content || "",
      );
    }
  }, [editMessage]);

  return (
    <Form
      className="flex flex-col gap-2 p-3 border-t max-md:w-full max-md:fixed bottom-0 left-0 bg-background/50"
      onSubmit={editMessage.editing ? handleEdit : handleSend}
    >
      {reply?.content && (
        <div className="flex justify-between items-center gap-2 bg-background p-2 rounded-xl">
          <div className="space-y-0 text-sm">
            <div className="text-accent text-xs">{reply.name}</div>
            <div className="text-muted">{reply.content}</div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="sm:size-6 size-9 shrink-0"
            onClick={() => setReply(null)}
            isIconOnly
          >
            <X size={10} />
          </Button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Suspense
          fallback={<Skeleton className="size-9 md:size-8 rounded-xl" />}
        >
          <AttachmentDropdown
            attachment={attachment}
            setAttachment={setAttachment}
          />
        </Suspense>
        <TextField
          name="message"
          value={message}
          onChange={(value) => setMessage(value)}
          className="flex-1"
          validate={(value) => {
            const result = messageSchema.safeParse(value);
            return result.success ? null : result.error.issues[0]?.message;
          }}
          aria-label="Message"
          ref={inputRef}
        >
          <Input
            placeholder="Your message here..."
            autoComplete="off"
            autoFocus
          />
          <FieldError />
        </TextField>
        {editMessage.editing && (
          <Button
            size="sm"
            variant="tertiary"
            onClick={() => {
              setMessage("");
              setEditMessage({ editing: false, id: 0 });
            }}
            isIconOnly
          >
            <X />
          </Button>
        )}
        <Button size="sm" type="submit" isIconOnly>
          {editMessage.editing ? <Check /> : <Send />}
        </Button>
      </div>
    </Form>
  );
}

export default MessageInput;
