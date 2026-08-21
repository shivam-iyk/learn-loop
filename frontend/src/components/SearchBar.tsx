import { Button, cn, Input } from "@heroui/react";
import { Search } from "lucide-react";

function SearchBar({
  value,
  setValue,
  placeholder = "",
  className = "",
  inputClassName = "",
  buttonClassName = "",
  buttonTextClassName = "",
}: {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  buttonTextClassName?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 w-full", className)}>
      <Input
        name="course search"
        placeholder={placeholder ?? "Search for Courses"}
        className={cn("bg-background/50 md:w-3/5 w-full", inputClassName)}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button className={buttonClassName}>
        <Search />
        <span className={cn("max-sm:hidden", buttonTextClassName)}>Search</span>
      </Button>
    </div>
  );
}

export default SearchBar;
