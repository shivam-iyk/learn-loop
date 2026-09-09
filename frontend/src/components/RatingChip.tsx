import { Chip, cn } from "@heroui/react";
import { Star } from "lucide-react";

function RatingChip({
  rating,
  size = 16,
  strokeWidth = 2,
  fill = "none",
  className = "",
  starClassName = "",
}: {
  rating: number;
  size?: number;
  strokeWidth?: number;
  fill?: string;
  className?: string;
  starClassName?: string;
}) {
  if (rating <= 0 || isNaN(rating)) return null;

  return (
    <Chip className={cn("flex items-center rounded-full flex-nowrap h-fit", className)}>
      {rating.toLocaleString("en-IN", {
        style: "decimal",
        maximumFractionDigits: 1,
      })}
      <Star
        size={size}
        strokeWidth={strokeWidth}
        fill={fill}
        className={cn("text-warning", starClassName)}
      />
    </Chip>
  );
}

export default RatingChip;
