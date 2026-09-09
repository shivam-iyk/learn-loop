import SearchCourses from "../components/SearchBar";
import useBoundStore from "../store";
import MyCourseCard from "../components/MyCourseCard";
import { useMemo, useState } from "react";
import { Button, Chip } from "@heroui/react";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import CustomEmptyState from "../components/CustomEmptyState";
import { useQuery } from "@tanstack/react-query";
import { getEnrolledCourses } from "../services/courses";

function MyCourses() {
  const { setSearch, courses } = useBoundStore();
  const search = useBoundStore((state) => state.search);

  const {} = useQuery({
    queryKey: ["my-courses"],
    queryFn: getEnrolledCourses,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });

  const [filter, setFilter] = useState<string[]>([]);

  const categories = useMemo(() => {
    return Array.from(new Set(courses.map((item) => item.category)));
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((item) => {
      const matchesCategory =
        filter.length === 0 || filter.includes(item.category);
      const matchesSearch =
        search.length === 0 ||
        item.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [courses, search, filter]);

  return (
    <div className="flex flex-col py-6 gap-6">
      <h3 className="tracking-tighter sm:text-3xl text-2xl font-outfit font-bold">
        My Courses
      </h3>
      <SearchCourses value={search} setValue={setSearch} />
      <div className="flex items-center gap-2">
        {categories.map((item, index) => (
          <button
            className="cursor-pointer ring-visible-offset rounded-full"
            onClick={() =>
              setFilter((prev) =>
                prev.includes(item)
                  ? prev.filter((i) => i !== item)
                  : [...prev, item],
              )
            }
            key={index}
          >
            <Chip
              className={`rounded-full capitalize border border-accent ${filter.includes(item) ? "bg-accent text-white" : "bg-accent-soft text-accent"}`}
            >
              {item}
            </Chip>
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((item, index) => (
            <MyCourseCard course={item} key={index} />
          ))
        ) : (
          <CustomEmptyState
            icon={BookOpen}
            title="No Courses Found"
            description={
              search.length > 0
                ? "Try refining your search"
                : "You are not enrolled in any courses yet"
            }
            actions={
              search.length > 0 ? (
                <Button variant="outline" onClick={() => setSearch("")}>
                  Clear Search
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/explore">
                    <Button variant="outline">Explore Courses</Button>
                  </Link>
                </div>
              )
            }
            containerClassName="min-h-[50vh]"
          />
        )}
      </div>
    </div>
  );
}

export default MyCourses;
