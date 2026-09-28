import { cn, FieldError, Input, TextField } from "@heroui/react";
import { optionSchema } from "../schema/quiz";

interface OptionFieldI {
  name: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
}

function OptionField({
  name,
  value,
  onChange,
  className = "",
  inputClassName = "",
  disabled = false,
}: OptionFieldI) {
  return (
    <TextField
      aria-label={name}
      name={name}
      value={value}
      onChange={onChange}
      validate={(value) => {
        const result = optionSchema.safeParse(value);
        return result.success ? null : result.error.issues[0].message;
      }}
      className={cn("flex-1", className)}
      isDisabled={disabled}
    >
      <Input placeholder="Option Value" className={inputClassName} />
      <FieldError />
    </TextField>
  );
}

export default OptionField;
