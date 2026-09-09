import Editor from "./Editor";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type Quill from "quill";

function RichTextField({
  label,
  placeholder,
  className = "",
  toolbarClassName = "",
  value,
  onChange,
  invalid = false,
  validate,
  resetKey = 0,
}: {
  label?: string | ReactNode;
  placeholder?: string;
  className?: string;
  hideToolbar?: boolean;
  toolbarClassName?: string;
  value: string;
  onChange: (description: string) => void;
  invalid?: boolean;
  validate?: (value: string) => null | string;
  resetKey?: number;
}) {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const handleChange = (value: string) => {
    if (validate) {
      const error = validate(value);
      if (error) setError(error);
      else setError(null);
    }
    onChange(value);
  };

  const editorRef = useRef<Quill>(null);

  useEffect(() => {
    setTouched(false);
    setError(null);
  }, [resetKey]);

  useEffect(() => {
    if (!invalid) return;
    if (validate) {
      const error = validate(value);
      if (error) setError(error);
      else setError(null);
    }
    setTouched(true);
  }, [invalid]);

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <span
          className={`${error && touched ? "text-danger" : ""} label cursor-default`}
          onClick={() => editorRef.current?.focus()}
        >
          {label}
        </span>
      ) : null}
      <Editor
        id="description"
        className={className}
        ref={editorRef}
        value={value}
        onChange={handleChange}
        isInvalid={touched && !!error}
        onBlur={() => setTouched(true)}
        toolbarClassName={toolbarClassName}
        placeholder={placeholder}
      />
      {error && touched && <p className="mt-1 text-danger text-xs">{error}</p>}
    </div>
  );
}

export default RichTextField;
