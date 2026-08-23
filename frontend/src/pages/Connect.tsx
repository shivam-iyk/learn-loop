import { Avatar, InputGroup } from "@heroui/react";
import { Link, useLocation, useParams } from "react-router-dom";
import ChatCard from "../components/ChatCard";
import CustomEmptyState from "../components/CustomEmptyState";
import { History, Network, Search } from "lucide-react";
import { useMemo, useState } from "react";

function Connect() {
  const params = useParams();
  const location = useLocation();

  const [search, setSearch] = useState("");

  const chats = [
    {
      id: 1,
      name: "React Tutorial",
      lastMessage: "Anyone please share notes?",
      cover:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1780987669/lms/course/yndzt0xxjwmgkyrucwqy.jpg",
    },
    {
      id: 2,
      name: "Vue Basics",
      lastMessage: "What is closures?",
      cover:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1780987669/lms/course/yndzt0xxjwmgkyrucwqy.jpg",
    },
    {
      id: 3,
      name: "Remix Starter",
      lastMessage: "What is conditional rendering?",
      cover:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1780987669/lms/course/yndzt0xxjwmgkyrucwqy.jpg",
    },
    {
      id: 4,
      name: "NEET Smasher",
      lastMessage: "Anyone help me with Integration",
      cover:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1780987669/lms/course/yndzt0xxjwmgkyrucwqy.jpg",
    },
    {
      id: 5,
      name: "JEE Crash",
      lastMessage: "Guys help me with ellipse area",
      cover:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1780987669/lms/course/yndzt0xxjwmgkyrucwqy.jpg",
    },
  ];

  const filteredChats = useMemo(() => {
    if (search === "") return chats;
    return chats.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [chats, search]);

  return (
    <div className="flex flex-col gap-6 md:py-6">
      <div className="max-md:hidden">
        <h3 className="tracking-tighter sm:text-3xl text-2xl font-outfit font-bold">
          Connect
        </h3>
        <p className="text-muted">
          Join the community, start conversations, and stay connected
        </p>
      </div>
      <div className="grid md:grid-cols-4 md:border rounded-4xl min-h-[75vh]">
        <div
          className={`md:border-r relative group ${params.chatId ? "max-md:hidden" : ""}`}
        >
          <div className="flex flex-col gap-3 p-4 border-b">
            <p className="font-outfit font-medium text-xl">Messages</p>
            <InputGroup className="w-full">
              <InputGroup.Prefix>
                <Search size={16} />
              </InputGroup.Prefix>
              <InputGroup.Input
                name="search-chats"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search chats..."
              />
            </InputGroup>
          </div>
          <div className="flex flex-col md:overflow-y-auto overflow-x-hidden md:h-[90%]">
            {chats.length === 0 ? (
              <CustomEmptyState
                icon={History}
                title="No Chats"
                description="Enroll in a course to start chatting"
                containerClassName="h-full"
              />
            ) : filteredChats.length === 0 ? (
              <CustomEmptyState
                icon={Search}
                title="No chats found"
                description="Please refine your search"
                containerClassName="h-full"
              />
            ) : (
              filteredChats.map((item, index) => (
                <Link
                  to={`/connect/${item.id}`}
                  className={`flex items-center gap-2 p-3 hover:bg-background ${location.pathname.includes(`/connect/${item.id}`) ? "group-hover:bg-background bg-background group-focus-within:bg-white" : ""} focus-visible:bg-background focus-visible:outline-none`}
                  key={index}
                >
                  <Avatar className="rounded-full">
                    <Avatar.Image src={item.cover} />
                    <Avatar.Fallback>{item.name[0]}</Avatar.Fallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <p className="text-lg font-medium font-outfit leading-4 w-fit">
                      {item.name}
                    </p>
                    <span className="text-xs text-muted truncate">
                      {item.lastMessage}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
        {params?.chatId ? (
          <ChatCard />
        ) : (
          <CustomEmptyState
            iconSize={30}
            icon={Network}
            title="No messages here"
            description="Select a Chat to view messages"
            containerClassName="flex items-center justify-center md:col-span-3 max-md:hidden"
          />
        )}
      </div>
    </div>
  );
}

export default Connect;
