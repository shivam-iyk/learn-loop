import React, { lazy, Suspense } from "react";
import { ToolbarButton } from "./ToolbarButton";
import { cn, Skeleton } from "@heroui/react";

const EditorInfo = lazy(() => import("./EditorInfo"));

function EditorToolbar({
  ref,
  className = "",
}: {
  ref: React.RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  const handleToolbarKeys = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
      return;
    }

    const items = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>("button, .ql-picker-label"),
    );

    if (!items.length) return;

    const current = (document.activeElement as HTMLElement)?.closest(
      "button, .ql-picker-label, .ql-picker-item",
    ) as HTMLElement | null;

    if (!current) return;

    const index = items.indexOf(current);

    if (index === -1) return;

    e.preventDefault();

    let nextIndex = index;

    switch (e.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % items.length;
        break;

      case "ArrowLeft":
        nextIndex = (index - 1 + items.length) % items.length;
        break;

      case "Home":
        nextIndex = 0;
        break;

      case "End":
        nextIndex = items.length - 1;
        break;
    }

    items.forEach((item) => (item.tabIndex = -1));

    const next = items[nextIndex];
    next.tabIndex = 0;
    next.focus();
  };

  return (
    <div
      className={cn(
        "flex! flex-wrap justify-end border-none! w-full! gap-4 max-lg:flex-nowrap",
        className,
      )}
      ref={ref}
      aria-label="Formatting Toolbar"
    >
      <div
        className="flex flex-wrap flex-1 gap-2 border-none! p-0! px-1! py-2! max-lg:flex-nowrap max-lg:overflow-x-auto scrollbar-thin"
        aria-label="Text Formatting"
        onKeyDown={handleToolbarKeys}
      >
        <div className="rounded-3xl h-9 inline-flex">
          <ToolbarButton
            className="ql-bold rounded-l-3xl"
            separator={true}
            tabIndex={0}
          />
          <ToolbarButton className="ql-italic" separator={true} tabIndex={-1} />
          <ToolbarButton
            className="ql-underline"
            separator={true}
            tabIndex={-1}
          />
          <ToolbarButton className="ql-strike rounded-r-3xl" tabIndex={-1} />
        </div>
        <div className="rounded-3xl h-9 inline-flex">
          <ToolbarButton
            className="ql-align rounded-l-3xl"
            value=""
            separator={true}
            tabIndex={-1}
          />
          <ToolbarButton
            className="ql-align"
            value="center"
            separator={true}
            tabIndex={-1}
          />
          <ToolbarButton
            className="ql-align"
            value="right"
            separator={true}
            tabIndex={-1}
          />
          <ToolbarButton
            className="ql-align rounded-r-3xl"
            value="justify"
            tabIndex={-1}
          />
        </div>
        <div className="rounded-3xl h-9 inline-flex">
          <ToolbarButton
            className="ql-header rounded-l-3xl"
            value="1"
            separator={true}
            tabIndex={-1}
          />
          <ToolbarButton
            className="ql-header"
            value="2"
            separator={true}
            tabIndex={-1}
          />
          <ToolbarButton
            className="ql-header rounded-r-3xl"
            value="3"
            tabIndex={-1}
          />
        </div>
        <div className="rounded-3xl h-9 inline-flex">
          <ToolbarButton
            className="ql-list rounded-l-3xl"
            value="ordered"
            separator={true}
            tabIndex={-1}
          />
          <ToolbarButton
            className="ql-list rounded-r-3xl"
            value="bullet"
            tabIndex={-1}
          />
        </div>
        <div className="rounded-3xl h-9 inline-flex">
          <ToolbarButton
            className="ql-link rounded-l-3xl"
            separator={true}
            tabIndex={-1}
          />
          <ToolbarButton
            className="ql-code-block rounded-r-3xl"
            tabIndex={-1}
          />
        </div>
      </div>
      <div className="flex py-2 gap-2" aria-label="Formatting Toolbar">
        <select
          className="ql-size"
          aria-label="Text Size"
          name="text-size"
          role="toolbar"
          defaultValue=""
        >
          <option value="small">S</option>
          <option value="">M</option>
          <option value="large">L</option>
          <option value="huge">XL</option>
        </select>
        <Suspense fallback={<Skeleton className="size-9 rounded-3xl" />}>
          <EditorInfo />
        </Suspense>
      </div>
    </div>
  );
}

export default EditorToolbar;
