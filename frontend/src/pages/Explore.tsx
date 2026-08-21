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

const Filters = lazy(() => import("../components/Filters"));

function Explore() {
  const { courses, search, setSearch, pagination, setFilters } =
    useBoundStore();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    pagination.setPage(page);
  }, [searchParams]);

  return (
    <div className="flex gap-6 py-6">
      <Suspense
        fallback={
          <Skeleton className="max-md:hidden lg:w-80 md:w-60 md:h-[70vh] rounded-lg" />
        }
      >
        <Filters />
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
              <Filters isDrawer />
            </Suspense>
          </div>
        </div>
        <Sort />
        {courses.length > 0 ? (
          courses.map((item, index) => (
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
                        onPress={() => pagination.setPage(page)}
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
