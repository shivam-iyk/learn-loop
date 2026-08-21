import { cn, EmptyState } from "@heroui/react";
import { Package2, type LucideIcon } from "lucide-react";

function CustomEmptyState({
  icon = Package2,
  title,
  description,
  iconSize = 24,
  containerClassName = "",
  actions,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  iconSize?: number;
  containerClassName?: string;
  actions?: React.ReactNode;
}) {
  const Icon = icon;

  return (
    <EmptyState
      className={cn(
        "text-foreground flex min-h-40 w-full flex-col items-center justify-center gap-4 text-center",
        containerClassName,
      )}
    >
      <span className="p-2 rounded-2xl bg-background-secondary">
        <Icon size={iconSize} />
      </span>
      <div>
        <h4 className="text-xl text-foreground font-outfit font-medium">
          {title}
        </h4>
        <span className="text-sm text-muted">{description}</span>
      </div>
      <div className="mt-2">{actions}</div>
    </EmptyState>
  );
}

export default CustomEmptyState;
