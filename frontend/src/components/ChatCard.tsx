import { Avatar, Button, Input, Skeleton } from "@heroui/react";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import MessageBubble from "./MessageBubble";
import type { MessageI } from "../types/message";
import InfiniteScroll from "react-infinite-scroll-component";

const AttachmentDropdown = lazy(() => import("./AttachmentDropdown"));

function ChatCard() {
  const previousHeightRef = useRef(0);
  const scrollActionRef = useRef<"initial" | "loadOlder" | "newMessage" | null>(
    null,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const chat = {
    cover:
      "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1780987669/lms/course/yndzt0xxjwmgkyrucwqy.jpg",
    name: "React.js",
    tagline: "React Tutorial",
  };

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageI[]>([]);

  const fetchMore = (initialLoad = false) => {
    if (!containerRef.current) return;

    const older = Array.from(
      { length: messages.length === 0 ? 20 : 10 },
      (_, i) =>
        ({
          id: Date.now() + i,
          avatar: "/avatar-small.png",
          user:
            i.toString().includes("1") || i.toString().includes("5") ? 0 : 2,
          name: "Raghav",
          role: "student",
          message: `Old message ${messages.length + i}`,
          attachment: null,
          created_at: new Date().toISOString(),
        }) as MessageI,
    );

    previousHeightRef.current = containerRef.current.scrollHeight;
    scrollActionRef.current = initialLoad ? "initial" : "loadOlder";

    setTimeout(() => {
      setMessages((prev) => [...prev, ...older]);
    }, 2000);
  };

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage: MessageI = {
      id: Date.now(),
      avatar: "/avatar-small.png",
      user: 0,
      name: "Raghav",
      message,
      role: "student",
      attachment: null,
      created_at: new Date().toISOString(),
    };

    setMessage("");
    inputRef.current?.focus();

    scrollActionRef.current = "newMessage";

    setMessages((prev) => [newMessage, ...prev]);
  };

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    switch (scrollActionRef.current) {
      case "initial":
        container.scrollTop = container.scrollHeight;
        break;

      case "loadOlder":
        container.scrollTop +=
          container.scrollHeight - previousHeightRef.current;
        break;

      case "newMessage":
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
        break;
    }

    scrollActionRef.current = null;
  }, [messages]);

  useEffect(() => {
    if (!containerRef.current) return;

    if (containerRef.current.scrollHeight > 0) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "instant",
      });
    }
  }, []);

  return (
    <div className="flex flex-col md:col-span-3 max-md:w-full">
      <div className="flex items-center gap-2 p-3 max-md:h-18 border-b max-md:fixed top-0 max-md:z-50 left-0 max-md:bg-background max-md:w-full">
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
          <Avatar.Image src={chat.cover} />
          <Avatar.Fallback>S</Avatar.Fallback>
        </Avatar>
        <div>
          <p className=" font-outfit font-medium leading-4 text-xl">
            {chat.name}
          </p>
          <span className="text-sm text-muted">{chat.tagline}</span>
        </div>
      </div>
      <div
        className="w-full md:max-h-[60vh] max-md:max-h-[calc(100dvh-9rem)] p-2 overflow-y-auto flex-1"
        ref={containerRef}
        id="messages-container"
      >
        <InfiniteScroll
          dataLength={messages.length}
          next={() => fetchMore(messages.length === 0)}
          hasMore={messages.length < 100}
          loader={<Loader2 className="animate-spin mx-auto" />}
          scrollableTarget="messages-container"
          inverse={true}
          className="flex flex-col-reverse gap-2"
        >
          {messages.map((item, index) => (
            <MessageBubble
              message={item}
              ref={index === messages.length - 1 ? lastMessageRef : null}
              key={item.id}
            />
          ))}
        </InfiniteScroll>
      </div>
      <div className="flex items-center gap-2 p-3 h-18 border-t max-md:w-full max-md:fixed bottom-0 left-0 bg-default/50">
        <Suspense
          fallback={<Skeleton className="size-9 md:size-8 rounded-xl" />}
        >
          <AttachmentDropdown />
        </Suspense>
        <Input
          name="message"
          ref={inputRef}
          value={message}
          className="flex-1"
          placeholder="Your message here..."
          onChange={(e) => setMessage(e.target.value)}
          autoFocus
        />
        <Button size="sm" onClick={handleSend} isIconOnly>
          <Send />
        </Button>
      </div>
    </div>
  );
}

export default ChatCard;
