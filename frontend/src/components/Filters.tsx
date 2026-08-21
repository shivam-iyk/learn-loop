import {
  Checkbox,
  Chip,
  Label,
  ListBox,
  Slider,
  Select,
  Drawer,
  Button,
  cn,
} from "@heroui/react";
import { useMemo } from "react";
import useBoundStore from "../store";
import { Funnel } from "lucide-react";
import StarsSelector from "./StarsSelector";

const durations = [
  { label: "0-2 hours", value: [0, 120] },
  { label: "2-5 hours", value: [120, 300] },
  { label: "5-10 hours", value: [300, 600] },
  { label: "10+ hours", value: [600, Infinity] },
];

function Filters({ className = "" }: { className?: string }) {
  const { courses, filters, setFilters } = useBoundStore();

  const maxPrice = useMemo(() => {
    let max = courses[0]?.price || -1;
    courses.map(({ price }) => {
      if (price > max) {
        max = price;
      }
    });
    if (Array.isArray(filters.price) && filters.price[1] === -1) {
      const price = [filters.price[0], max];
      setFilters({ ...filters, price });
    }
    return max;
  }, [courses]);

  const maxLessons = useMemo(() => {
    let max = courses[0]?.lessons || -1;
    courses.map((item) => {
      if (item.lessons > max) {
        max = item.lessons;
      }
    });
    return max;
  }, [courses]);

  const categories = useMemo(
    () =>
      Array.from(new Set(courses.map((item) => item.category).filter(Boolean))),
    [courses],
  );

  return (
    <div
      className={cn(
        "lg:w-80 max-md:hidden md:bg-background/50 rounded-lg sm:p-4 px-2 h-fit sticky top-20",
        className,
      )}
    >
      <h5 className="sm:text-2xl text-lg text-center text-foreground font-outfit font-semibold tracking-tight">
        Filters
      </h5>
      <div className="flex flex-col gap-4 py-4">
        <Slider
          aria-label="Price"
          className="w-full"
          value={filters.price}
          onChange={(value) => setFilters({ ...filters, price: value })}
          formatOptions={{
            currency: "INR",
            style: "currency",
            maximumFractionDigits: 0,
          }}
          minValue={0}
          maxValue={maxPrice}
          isDisabled={Array.isArray(filters.price) && filters.price[1] === -1}
          step={1}
        >
          <div className="flex flex-col">
            <span className="label font-huninn uppercase text-base mb-2">
              Price
            </span>
            <Slider.Track className="w-full border-x-0 h-2 bg-accent-soft">
              {({ state }) => (
                <>
                  <Slider.Fill />
                  {state.values.map((_, i) => (
                    <Slider.Thumb
                      className="size-4 after:rounded-full after:border after:border-accent bg-transparent"
                      key={i}
                      index={i}
                    />
                  ))}
                </>
              )}
            </Slider.Track>
            <Slider.Output className="flex justify-between w-full">
              {({ state }) =>
                state.values.map((_, i) => (
                  <span className="font-light text-sm mt-2" key={i}>
                    {state.getThumbValueLabel(i)}
                  </span>
                ))
              }
            </Slider.Output>
          </div>
        </Slider>
        <div className="flex flex-col gap-2">
          <span className="label font-huninn uppercase text-base">
            Category
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {categories.length > 0 ? (
              categories.map((item, index) => (
                <button
                  className="cursor-pointer ring-visible-offset rounded-full"
                  onClick={() =>
                    filters.categories.includes(item)
                      ? setFilters({
                          ...filters,
                          categories: filters.categories.filter(
                            (i) => i !== item,
                          ),
                        })
                      : setFilters({
                          ...filters,
                          categories: [...filters.categories, item],
                        })
                  }
                  key={index}
                >
                  <Chip
                    className={`capitalize rounded-full border border-accent text-accent bg-background ${filters.categories.includes(item) ? "bg-accent text-white" : ""}`}
                  >
                    {item}
                  </Chip>
                </button>
              ))
            ) : (
              <span className="text-muted text-sm">No categories found</span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="label font-huninn uppercase text-base">
            Duration
          </span>
          <div className="flex flex-col gap-2">
            {durations.map((item, index) => (
              <Checkbox
                name="duration"
                isSelected={filters.duration.has(item.label)}
                onChange={() =>
                  filters.duration.has(item.label)
                    ? setFilters({
                        ...filters,
                        duration: new Set(
                          [...filters.duration].filter((d) => d !== item.label),
                        ),
                      })
                    : setFilters({
                        ...filters,
                        duration: filters.duration.add(item.label),
                      })
                }
                key={index}
              >
                <Checkbox.Content className="flex-row items-center gap-2">
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  {item.label}
                </Checkbox.Content>
              </Checkbox>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="label font-huninn uppercase text-base">Ratings</span>
          <StarsSelector
            value={filters.rating}
            setValue={(value) => setFilters({ ...filters, rating: value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="label font-huninn uppercase text-base">Lessons</span>
          <Select
            name="min-lessons"
            className="flex flex-row justify-between items-center gap-2 w-full"
            placeholder="Min Lessons"
            value={filters.lessons[0]}
            onChange={(value) =>
              setFilters({
                ...filters,
                lessons: [
                  parseInt(value?.toString() || "0"),
                  filters.lessons[1],
                ],
              })
            }
          >
            <Label>
              Min<span className="max-lg:hidden">imum</span>:
            </Label>
            <Select.Trigger className="flex-1 max-w-60">
              <Select.Value className="max-sm:text-sm" />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {Array.from<number>({ length: maxLessons - 1 }).map(
                  (_, index) => (
                    <ListBox.Item
                      id={index + 1}
                      textValue={(index + 1).toString()}
                      key={index}
                      isDisabled={
                        filters.lessons[1] === -1
                          ? false
                          : index + 1 > filters.lessons[1]
                      }
                    >
                      {index + 1}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ),
                )}
              </ListBox>
            </Select.Popover>
          </Select>
          <Select
            name="max-lessons"
            className="flex flex-row justify-between items-center gap-2 w-full"
            placeholder="Max Lessons"
            value={filters.lessons[1]}
            onChange={(value) =>
              setFilters({
                ...filters,
                lessons: [
                  filters.lessons[0],
                  parseInt(value?.toString() || "0"),
                ],
              })
            }
          >
            <Label>
              Max<span className="max-lg:hidden">imum</span>:
            </Label>
            <Select.Trigger className="flex-1 max-w-60">
              <Select.Value className="max-sm:text-sm" />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {Array.from<number>({ length: maxLessons }).map((_, index) => (
                  <ListBox.Item
                    id={index + 1}
                    textValue={(index + 1).toString()}
                    key={index}
                    isDisabled={index + 1 < filters.lessons[0]}
                  >
                    {index + 1}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </div>
      <Button className="sm:hidden w-full" size="sm" slot="close">
        Apply Filters
      </Button>
    </div>
  );
}

function FiltersModular({ isDrawer = false }: { isDrawer?: boolean }) {
  if (!isDrawer) return <Filters />;
  return (
    <Drawer>
      <Button
        variant="secondary"
        className="md:hidden max-sm:w-full text-black"
      >
        <Funnel /> Filters
      </Button>
      <Drawer.Backdrop>
        <Drawer.Content>
          <Drawer.Dialog>
            <Drawer.Handle />
            <Drawer.Body>
              <Filters className="block!" />
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}

export default FiltersModular;
