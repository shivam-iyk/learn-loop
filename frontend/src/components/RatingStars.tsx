import { cn } from "@heroui/styles";
import { Star, StarHalf } from "lucide-react";
import { useMemo } from "react";

function RatingStars({
  stars,
  size = 16,
  subText = "",
  className = "",
  starsClassName = "",
  subTextClassName = "",
}: {
  stars: number;
  size?: number;
  subText?: string;
  className?: string;
  starsClassName?: string;
  subTextClassName?: string;
}) {
  const fullStars = useMemo(() => {
    return parseInt(stars.toString().split(".")[0]);
  }, [stars]);
  const halfStars = useMemo(() => {
    if (stars >= 5) return false;
    const value = parseInt(stars.toString().split(".")[1] || "0");
    if (value < 5) return false;
    return true;
  }, [stars]);

  return (
    <div className={cn("flex items-center gap-1 text-warning", className)}>
      {Array.from({
        length: fullStars,
      }).map((_, index) => (
        <Star
          size={size}
          fill="currentColor"
          className={starsClassName}
          key={index}
        />
      ))}
      {halfStars && (
        <div className={cn("relative size-4", starsClassName)}>
          <Star className="absolute top-0 left-0" size={size} />
          <StarHalf
            className="absolute top-0 left-0"
            size={size}
            fill="currentColor"
          />
        </div>
      )}
      {fullStars < 5 &&
        Array.from({ length: 5 - fullStars - (halfStars ? 1 : 0) }).map(
          (_, index) => (
            <Star
              size={size}
              fill="none"
              className={starsClassName}
              key={index}
            />
          ),
        )}
      <span className={cn("text-foreground", subTextClassName)}>
        {stars.toLocaleString("en-IN", {
          style: "decimal",
          maximumFractionDigits: 1,
        })}
        {subText.length > 0 && " "}
        {subText}
      </span>
    </div>
  );
}

export default RatingStars;
