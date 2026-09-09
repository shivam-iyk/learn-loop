import { Button, cn, InputGroup, ComboBox, ListBox, Form } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { getSuggestions } from "../services/courses";
import { useDebounceValue } from "usehooks-ts";

function SearchBar({
  value,
  setValue,
  placeholder = "Search for courses",
  className = "",
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
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const [debouncedSearch] = useDebounceValue(search, 500);

  const { data } = useQuery<{ term: string }[]>({
    queryKey: ["suggestions", debouncedSearch],
    staleTime: 1000 * 60 * 5, // 5 minutes,
    queryFn: () => getSuggestions(debouncedSearch),
    retry: false,
    enabled: () => (debouncedSearch.trim()?.length >= 1 ? true : false),
    placeholderData: (previousData) => previousData,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValue(search.trim());
  };

  useEffect(() => {
    if (debouncedSearch.trim().length >= 2 && data?.length) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [data, debouncedSearch]);

  return (
    <Form
      className={cn("flex items-center gap-2 w-full", className)}
      onSubmit={handleSubmit}
    >
      <ComboBox
        name="suggestions"
        aria-label="suggestions"
        inputValue={search}
        className="md:w-3/5 w-full"
        onInputChange={(value) => setSearch(value?.toString() || "")}
        onChange={(value) => {
          const selected = value?.toString() || "";
          setSearch(selected);
          setValue(selected);
          setOpen(false);
        }}
        allowsCustomValue
      >
        <ComboBox.InputGroup>
          <InputGroup className={"w-full"}>
            <InputGroup.Input name="course-search" placeholder={placeholder} />
            <InputGroup.Suffix className="pe-0">
              {search.length > 0 && (
                <Button
                  aria-label="Clear"
                  className="text-muted"
                  size="sm"
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    setValue("");
                    setSearch("");
                  }}
                  isIconOnly
                >
                  <X className="size-4" />
                </Button>
              )}
            </InputGroup.Suffix>
          </InputGroup>
        </ComboBox.InputGroup>
        <ComboBox.Popover isOpen={open} onOpenChange={setOpen}>
          <ListBox>
            {data?.map(({ term }, index) => (
              <ListBox.Item
                id={term}
                textValue={term}
                key={term + index}
                className="flex items-center gap-2"
              >
                <Search className="text-muted size-4" />
                {term}
              </ListBox.Item>
            ))}
          </ListBox>
        </ComboBox.Popover>
      </ComboBox>
      <Button type="submit" className={buttonClassName}>
        <Search />
        <span className={cn("max-sm:hidden", buttonTextClassName)}>Search</span>
      </Button>
    </Form>
  );
}

export default SearchBar;
