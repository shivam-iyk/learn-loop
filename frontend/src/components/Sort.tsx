import { Button, cn, Drawer } from "@heroui/react";
import { ArrowUpDown } from "lucide-react";
import useAppStore from "../store";
import type { CourseSlice } from "../types/course";

const sorting: { id: CourseSlice["sort"]; title: string }[] = [
  { id: "latest", title: "Latest" },
  { id: "popular", title: "Popularity" },
  { id: "price-low", title: "Price - Low to High" },
  { id: "price-high", title: "Price - High to Low" },
];

function Sorting({ className = "" }: { className?: string }) {
  const { sort, setSort } = useAppStore();

  return (
    <div
      className={cn(
        "flex items-center gap-4 w-full text-sm relative max-w-full",
        className,
      )}
    >
      <h5 className="text-muted whitespace-nowrap max-sm:text-lg max-sm:font-bold max-sm:tracking-tight max-sm:text-black">
        Sort by
      </h5>
      <div className="flex items-center max-sm:flex-col max-sm:w-full max-sm:gap-2">
        {sorting.map(({ id, title }, index) => (
          <Button
            variant="ghost"
            className={`${sort === id ? "text-accent border-accent" : "border-transparent"} sm:border-b-2 hover:sm:bg-transparent sm:rounded-b-none whitespace-nowrap max-sm:w-full max-sm:text-left`}
            onClick={() => setSort(id)}
            slot="close"
            key={index}
          >
            {title}
          </Button>
        ))}
      </div>
    </div>
  );
}

function Sort({ isDrawer = false }: { isDrawer?: boolean }) {
  if (!isDrawer) {
    return <Sorting className="max-sm:hidden" />;
  }

  return (
    <Drawer>
      <Button variant="tertiary" className="w-full sm:hidden">
        <ArrowUpDown /> Sort
      </Button>
      <Drawer.Backdrop>
        <Drawer.Content>
          <Drawer.Dialog>
            <Drawer.Handle />
            <Drawer.Body>
              <Sorting className="flex-col" />
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}

export default Sort;
