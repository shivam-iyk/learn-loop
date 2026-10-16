import { Avatar, Button, toast } from "@heroui/react";
import { ArrowLeft, History, Loader2, ShieldAlert } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import type { Message, MessagePage, MessageReply } from "../types/message";
import InfiniteScroll from "react-infinite-scroll-component";
import useAppStore from "../store";
import CustomEmptyState from "./CustomEmptyState";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteMessage, getMessages } from "../services/message";
import type { ApiError } from "../services/api";
import { useApiErrorHandler, useParsedQueryError } from "../hooks/error";
import MessagesSkeleton, { ChatInfo } from "../skeletons/Messages";
import MessageInput, { type EditMessage } from "./MessageInput";

function Messages({ courseId }: { courseId: string | number }) {
  const queryClient = useQueryClient();
  const handleError = useApiErrorHandler();

  const {
    chats,
    messages,
    setMessages,
    removeMessage,
    pagination,
    setPagination,
  } = useAppStore();

  const scrollToBottomRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [reply, setReply] = useState<MessageReply>(null);
  const [editMessage, setEditMessage] = useState<EditMessage>({
    id: 0,
    editing: false,
  });

  const { data, isFetching, isError, error, isLoading } = useQuery<MessagePage>(
    {
      queryKey: ["messages", courseId, pagination.page],
      queryFn: () => getMessages(courseId, pagination.page),
      staleTime: 15 * 60 * 1000, // 15 minutes
      enabled: !!courseId,
    },
  );

  const parsedError = useParsedQueryError(error);

  const deleteMessageMutation = useMutation<Message, ApiError, string | number>(
    {
      mutationFn: (messageId) => deleteMessage(messageId),
      onSuccess: (data) => {
        removeMessage(data?.id);
        queryClient.setQueryData(
          ["messages", courseId, pagination.page],
          (oldData: MessagePage) => ({
            ...oldData,
            messages: oldData.messages.filter(
              (item) => item.id !== Number(deleteMessageMutation.variables),
            ),
          }),
        );
        setPagination({ ...pagination, total: pagination.total - 1 });
      },
      onError: (err) => {
        const { message, description, errorCode } = handleError(err);
        console.log(errorCode);
        if (errorCode === "NOT_FOUND") {
          removeMessage(deleteMessageMutation.variables || 0);
          setPagination({ ...pagination, total: pagination.total - 1 });
        }
        toast.danger(message, {
          description: description,
        });
      },
    },
  );

  const fetchMore = () => {
    const { pagination: p } = useAppStore.getState();
    if (isFetching || p.page >= p.pages) return;
    setPagination({ ...p, page: p.page + 1 });
  };

  const chat = useMemo(() => {
    return chats.find((item) => item.id === Number(courseId));
  }, [chats, courseId]);

  useLayoutEffect(() => {
    if (!scrollToBottomRef.current) return;
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" }); // top 0 = bottom in column-reverse
    scrollToBottomRef.current = false;
  }, [messages]);

  useEffect(() => {
    return () => {
      setMessages([]);
      setPagination({
        ...useAppStore.getState().pagination,
        page: 1,
        pages: 1,
        total: 0,
      });
    };
  }, []);

  useEffect(() => {
    if (!data) return;
    const state = useAppStore.getState();

    const byId = new Map<Message["id"], Message>();
    [...state.messages, ...data.messages].forEach((m) => {
      if (m.course === Number(courseId)) {
        byId.set(m.id, m);
      }
    });
    setMessages([...byId.values()]);

    if (data.pagination) {
      const { total, pages, limit } = data.pagination;
      setPagination({ ...state.pagination, total, pages, limit });
    }
  }, [data]);

  if (!chat && !isLoading) {
    return (
      <CustomEmptyState
        icon={History}
        title="Chat not found"
        description="Something went wrong"
        containerClassName="md:col-span-3 max-md:w-full"
      />
    );
  }

  if (isError && messages.length === 0 && !isLoading) {
    return (
      <CustomEmptyState
        icon={ShieldAlert}
        title={parsedError?.message || "Something went wrong"}
        description={parsedError?.description || "Please try again later"}
        containerClassName="md:col-span-3 max-md:w-full"
      />
    );
  }

  return (
    <div className="flex flex-col md:col-span-3 max-md:w-full">
      {isLoading ? (
        <ChatInfo />
      ) : (
        <div className="flex items-center gap-2 p-3 h-18 border-b max-md:fixed top-0 max-md:z-50 left-0 max-md:bg-background max-md:w-full">
          <Button
            size="sm"
            variant="ghost"
            className="md:hidden"
            onClick={() => history.back()}
            isIconOnly
          >
            <ArrowLeft />
          </Button>
          <Avatar className="rounded-full">
            <Avatar.Image src={chat?.cover} />
            <Avatar.Fallback>{chat?.name[0]}</Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col">
            <h5 className=" font-outfit font-medium text-xl -mb-1">
              {chat?.name}
            </h5>
            <span className="text-sm text-muted">{chat?.tagline}</span>
          </div>
        </div>
      )}
      <div
        className="w-full md:max-h-[60vh] max-md:max-h-[calc(100dvh-9rem)] p-2 overflow-y-auto flex flex-col-reverse flex-1"
        ref={containerRef}
        id="messages-container"
      >
        {messages.length === 0 ? (
          isLoading ? (
            <MessagesSkeleton />
          ) : (
            <CustomEmptyState
              icon={History}
              title="No Messages yet"
              description="Start conversation now"
            />
          )
        ) : (
          <InfiniteScroll
            dataLength={messages.length}
            next={fetchMore}
            hasMore={messages.length < pagination.total && !isError}
            loader={<Loader2 className="animate-spin mx-auto" />}
            scrollableTarget="messages-container"
            role="list"
            className="flex flex-col-reverse gap-2"
            inverse
          >
            {messages?.map((item, index) => (
              <MessageBubble
                message={item}
                hideUserPreview={messages[index + 1]?.sender === item.sender}
                hideTime={messages[index - 1]?.sender === item.sender}
                handleDelete={() => deleteMessageMutation.mutate(item.id)}
                handleReply={() =>
                  setReply({
                    name: item.name,
                    content: item.content.slice(0, 100),
                  })
                }
                handleEdit={() =>
                  setEditMessage({
                    id: item.id,
                    editing: true,
                  })
                }
                key={item.id}
              />
            ))}
          </InfiniteScroll>
        )}
      </div>
      <MessageInput
        courseId={courseId}
        inputRef={inputRef}
        scrollToBottomRef={scrollToBottomRef}
        reply={reply}
        setReply={(reply) => setReply(reply)}
        editMessage={editMessage}
        setEditMessage={(editing) => setEditMessage(editing)}
      />
    </div>
  );
}

export default Messages;
