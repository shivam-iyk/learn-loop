import { Avatar, Button, InputGroup } from "@heroui/react";
import { Link, useLocation, useParams } from "react-router-dom";
import Messages from "../components/Messages";
import CustomEmptyState from "../components/CustomEmptyState";
import { History, Network, Search, ShieldAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import useAppStore from "../store";
import { useQuery } from "@tanstack/react-query";
import { getChats } from "../services/message";
import ConnectSkeleton from "../skeletons/Connect";
import { formatDate, isToday, isYesterday } from "date-fns";
import { useParsedQueryError } from "../hooks/error";

function Connect() {
  const { courseId } = useParams();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const { chats, setChats } = useAppStore();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["chats"],
    queryFn: getChats,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  const parsedError = useParsedQueryError(error);

  const filteredChats = useMemo(() => {
    if (!search || search.length === 0) {
      return chats;
    }
    return chats.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.tagline.toLowerCase().includes(search.toLowerCase()),
    );
  }, [chats, search]);

  useEffect(() => {
    if (!data) return;
    setChats(data);
  }, [data]);

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
          className={`md:border-r relative ${courseId ? "max-md:hidden" : ""}`}
        >
          <div className="flex flex-col gap-3 p-4 border-b h-18 justify-center">
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
          {isError ? (
            <CustomEmptyState
              icon={ShieldAlert}
              title={parsedError?.message || "Something went wrong"}
              description={parsedError?.description || "Please try again later"}
              containerClassName="h-full"
            />
          ) : (
            <div className="flex flex-col md:overflow-y-auto overflow-x-hidden md:h-[90%] group">
              {isLoading ? (
                <ConnectSkeleton />
              ) : chats.length === 0 ? (
                <CustomEmptyState
                  icon={History}
                  title="No Chats"
                  description="Enroll in a course to start chatting"
                  containerClassName="h-full"
                />
              ) : filteredChats.length === 0 && search.length > 0 ? (
                <CustomEmptyState
                  icon={Search}
                  title="No chats found"
                  description="Please refine your search"
                  containerClassName="h-full"
                  actions={
                    <Button variant="tertiary" onClick={() => setSearch("")}>
                      Clear Search
                    </Button>
                  }
                />
              ) : (
                filteredChats.map((item, index) => (
                  <Link
                    to={`/connect/${item.id}`}
                    className={`flex items-center gap-2 p-3 hover:bg-background w-full ${location.pathname.includes(`/connect/${item.id}`) ? "group-hover:bg-background bg-background" : ""} focus-visible:bg-accent-soft focus-visible:outline-none`}
                    key={index}
                  >
                    <Avatar className="rounded-full">
                      <Avatar.Image src={item.cover} />
                      <Avatar.Fallback>{item.name[0]}</Avatar.Fallback>
                    </Avatar>
                    <div className="flex flex-1 flex-col justify-center min-w-0">
                      <h5 className="text-lg font-medium font-outfit truncate">
                        {item.name}
                      </h5>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-muted truncate">
                          {item.last_message || item.tagline}
                        </span>
                        {item?.last_message_at && (
                          <span className="text-xs text-muted">
                            {isYesterday(item.last_message_at)
                              ? "Yesterday"
                              : isToday(item.last_message_at)
                                ? formatDate(item.last_message_at, "hh:mm")
                                : formatDate(item.last_message_at, "dd/MM/yy")}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
        {courseId ? (
          <Messages key={courseId} courseId={courseId} />
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
