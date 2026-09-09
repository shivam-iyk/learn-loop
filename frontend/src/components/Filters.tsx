import {
  Chip,
  Label,
  ListBox,
  Select,
  Drawer,
  Button,
  cn,
} from "@heroui/react";
import useBoundStore from "../store";
import { Funnel } from "lucide-react";
import StarsSelector from "./StarsSelector";
import PriceSlider from "./PriceSlider";

interface FilterProps {
  maxPrice: number;
  maxLessons: number;
  categories: string[];
  className?: string;
}

function Filters({
  maxPrice,
  categories,
  maxLessons,
  className = "",
}: FilterProps) {
  const { filters, setFilters } = useBoundStore();

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
        <PriceSlider
          maxPrice={maxPrice}
          defaultPrice={filters.price}
          setFilterPrice={(price) => setFilters({ ...filters, price })}
        />
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
              value === filters.lessons[0]
                ? setFilters({ ...filters, lessons: [0, filters.lessons[1]] })
                : setFilters({
                    ...filters,
                    lessons: [
                      parseInt(value?.toString() || "0"),
                      filters.lessons[1],
                    ],
                  })
            }
          >
            <Label className="text-muted">
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
              value === filters.lessons[1]
                ? setFilters({
                    ...filters,
                    lessons: [filters.lessons[0], maxLessons],
                  })
                : setFilters({
                    ...filters,
                    lessons: [
                      filters.lessons[0],
                      parseInt(value?.toString() || "0"),
                    ],
                  })
            }
          >
            <Label className="text-muted">
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

function FiltersModular(
  props: FilterProps & {
    isDrawer?: boolean;
  },
) {
  if (!props.isDrawer) return <Filters {...props} />;
  return (
    <Drawer>
      <Button
        variant="secondary"
        className="md:hidden max-sm:w-full text-foreground"
      >
        <Funnel /> Filters
      </Button>
      <Drawer.Backdrop>
        <Drawer.Content>
          <Drawer.Dialog>
            <Drawer.Handle />
            <Drawer.Body>
              <Filters {...props} className="block!" />
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}

export default FiltersModular;
