import { cn } from "@heroui/styles";

function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      loading="eager"
      className={cn("w-10 object-contain", className)}
      draggable={false}
    />
  );
}

export default Logo;
