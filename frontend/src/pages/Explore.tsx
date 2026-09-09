import useBoundStore from "../store";
import SearchCourses from "../components/SearchBar";
import Sort from "../components/Sort";
import ExploreCard from "../components/ExploreCard";
import { Button, Pagination, Skeleton } from "@heroui/react";
import { useSearchParams } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { getPageNumbers } from "../lib/helpers";
import CustomEmptyState from "../components/CustomEmptyState";
import { useQuery } from "@tanstack/react-query";
import { getCourses } from "../services/courses";
import type { CourseSlice } from "../types/course";

const Filters = lazy(() => import("../components/Filters"));

interface QueryData {
  courses: CourseSlice["courses"];
  pagination: CourseSlice["pagination"];
  filters: {
    max_price: number;
    max_lessons: number;
    categories: string[];
  };
}

function Explore() {
  const {
    courses,
    sort,
    search,
    setSearch,
    pagination,
    setPagination,
    filters,
    setFilters,
  } = useBoundStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isPending, isLoading } = useQuery<QueryData>({
    queryKey: ["courses", search, sort, pagination.page, filters],
    queryFn: () =>
      getCourses({
        sort,
        limit: 10,
        page: pagination.page,
        search: search.trim() || null,
        rating: filters.rating > 0 ? filters.rating : null,
        minPrice: filters.price[0] > 0 ? filters.price[0] : null,
        maxPrice: filters.price[1] > 0 ? filters.price[1] : null,
        minLessons: filters.lessons[0] > 0 ? filters.lessons[0] : null,
        maxLessons: filters.lessons[1] !== -1 ? filters.lessons[1] : null,
        categories:
          filters.categories?.length > 0 ? filters.categories.join(",") : null,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 0,
  });

  useEffect(() => {
    if (isPending) return;
    if (data?.pagination) setPagination(data.pagination);
  }, [data, setPagination]);

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    setPagination({ ...pagination, page });

    const price = searchParams.get("price");
    if (price === "0") setFilters({ ...filters, price: [0, 0] });
  }, [searchParams]);

  return (
    <div className="flex gap-6 py-6">
      <Suspense
        fallback={
          <Skeleton className="max-md:hidden lg:w-80 md:w-60 md:h-[70vh] rounded-lg" />
        }
      >
        {isPending ? (
          <Skeleton className="max-md:hidden lg:w-80 md:w-60 md:h-[70vh] rounded-lg" />
        ) : (
          <Filters
            maxPrice={data?.filters?.max_price || 1}
            maxLessons={data?.filters?.max_lessons || 1}
            categories={data?.filters?.categories || []}
          />
        )}
      </Suspense>
      <div className="flex flex-1 flex-col gap-4 w-full">
        <h3 className="tracking-tighter sm:text-3xl text-2xl font-bold font-outfit">
          Explore Courses
        </h3>
        <div className="flex max-sm:flex-col items-center gap-2 w-full">
          <SearchCourses value={search} setValue={setSearch} />
          <div className="flex gap-2 max-sm:w-full">
            <Sort isDrawer />
            <Suspense
              fallback={
                <Skeleton className="md:hidden w-24 h-10 rounded-2xl" />
              }
            >
              {isPending ? (
                <Skeleton className="md:hidden w-24 h-10 rounded-2xl" />
              ) : (
                <Filters
                  maxPrice={data?.filters?.max_price || 1}
                  maxLessons={data?.filters?.max_lessons || 1}
                  categories={data?.filters?.categories || []}
                  isDrawer
                />
              )}
            </Suspense>
          </div>
        </div>
        <Sort />

        {isLoading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <div className="flex gap-6" key={index}>
              <Skeleton className="lg:w-1/3 sm:w-1/2 aspect-video rounded-l-lg w-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="w-60 h-6" />
                <Skeleton className="w-80 h-4" />
                <Skeleton className="w-30 h-4" />
                <Skeleton className="w-20 h-7 rounded-full" />
                <Skeleton className="w-24 h-8" />
              </div>
            </div>
          ))
        ) : data?.courses && data?.courses?.length > 0 ? (
          data?.courses.map((item, index) => (
            <ExploreCard course={item} key={index} />
          ))
        ) : (
          <CustomEmptyState
            icon={BookOpen}
            title="No Courses Found"
            description={
              courses.length === 0
                ? "Something went wrong"
                : search.length > 0
                  ? "Try refining your search"
                  : "Try adjusting your filters"
            }
            actions={
              courses.length === 0 ? null : search.length > 0 ? (
                <Button variant="outline" onClick={() => setSearch("")}>
                  Clear Search
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      price: [0, -1],
                      categories: [],
                      duration: new Set(),
                      rating: 0,
                      lessons: [0, -1],
                    })
                  }
                >
                  Clear Filters
                </Button>
              )
            }
            containerClassName="min-h-[50vh]"
          />
        )}
        {pagination.pages > 1 && (
          <Pagination className="mt-4 justify-center">
            <Pagination.Content className="max-sm:mx-auto">
              <Pagination.Item>
                <Pagination.Previous
                  isDisabled={pagination.page === 1}
                  onClick={() =>
                    setSearchParams({ page: (pagination.page - 1).toString() })
                  }
                >
                  <Pagination.PreviousIcon />
                  <span className="max-sm:hidden">Back</span>
                </Pagination.Previous>
              </Pagination.Item>
              <div className="flex gap-1">
                {getPageNumbers(pagination).map((page, i) =>
                  page === "ellipsis" ? (
                    <Pagination.Item key={`ellipsis-${i}`}>
                      <Pagination.Ellipsis />
                    </Pagination.Item>
                  ) : (
                    <Pagination.Item key={page}>
                      <Pagination.Link
                        isActive={page === pagination.page}
                        onPress={() => setPagination({ ...pagination, page })}
                      >
                        {page}
                      </Pagination.Link>
                    </Pagination.Item>
                  ),
                )}
              </div>
              <Pagination.Item>
                <Pagination.Next
                  onClick={() =>
                    setSearchParams({ page: (pagination.page + 1).toString() })
                  }
                  isDisabled={pagination.page === pagination.pages}
                >
                  <span className="max-sm:hidden">Next</span>
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        )}
      </div>
    </div>
  );
}

export default Explore;
