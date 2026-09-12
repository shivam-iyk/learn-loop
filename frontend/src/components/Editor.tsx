import { forwardRef, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "../config/quill-icons";
import { cn } from "@heroui/styles";
import EditorToolbar from "./EditorToolbar";

interface EditorProps {
  id?: string;
  value?: string;
  readOnly?: boolean;
  className?: string;
  toolbarClassName?: string;
  isInvalid?: boolean;
  placeholder?: string;
  onBlur?: () => void;
  onChange?: (content: string) => void;
}

const Editor = forwardRef<Quill, EditorProps>(
  (
    {
      id = "",
      value = "",
      isInvalid,
      readOnly = false,
      placeholder = "Write something...",
      className = "",
      toolbarClassName = "",
      onBlur,
      onChange,
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);

    const editorRef = useRef<HTMLDivElement>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);
    const onChangeRef = useRef(onChange);
    const onBlurRef = useRef(onBlur);

    useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
      if (!editorRef.current || quillRef.current) return;

      const editorElement = document.createElement("div");
      editorRef.current.appendChild(editorElement);

      const quill = new Quill(editorElement, {
        theme: "snow",
        modules: {
          toolbar: {
            container: toolbarRef.current,
          },
          keyboard: {
            bindings: {
              tab: {
                key: "Tab",
                handler: function () {
                  return true;
                },
              },
            },
          },
        },
        placeholder,
        readOnly,
      });

      quillRef.current = quill;

      if (value) {
        quill.root.innerHTML = value;
      }
      quill.container.querySelector("input")?.setAttribute("name", "editor");

      quill.on("text-change", () => {
        onChangeRef.current?.(quill.root.innerHTML);
      });

      quill.keyboard.addBinding({ ctrlKey: true, key: "[" }, () => {
        quill.format("indent", "-1");
        return true;
      });

      quill.keyboard.addBinding({ ctrlKey: true, key: "]" }, () => {
        quill.format("indent", "+1");
        return true;
      });

      if (typeof ref === "function") ref(quill);
      else if (ref) ref.current = quill;

      return () => {
        quillRef.current = null;
        editorRef.current?.replaceChildren();
      };
    }, []);

    useEffect(() => {
      quillRef.current?.enable(!readOnly);
    }, [readOnly]);

    useEffect(() => {
      const quill = quillRef.current;
      if (!quill) return;
      if (quill.root.innerHTML !== value) {
        quill.root.innerHTML = value;
      }
    }, [value]);

    return (
      <div
        data-invalid={isInvalid}
        className={`shadow-sm bg-field transition-colors rounded-field ring-2 ${focused ? "ring-accent data-[invalid='true']:ring-danger bg-field" : "ring-transparent data-[invalid='true']:ring data-[invalid='true']:ring-danger hover:bg-field-hover"}`}
      >
        <EditorToolbar ref={toolbarRef} className={toolbarClassName} />
        <div
          id={id}
          ref={editorRef}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            const next = e.relatedTarget as Node | null;
            if (next && e.currentTarget.contains(next)) return;

            setFocused(false);
            onBlurRef.current?.();
          }}
          aria-label="description"
          className={cn("editor-container max-h-[60vh]! overflow-auto scrollbar-thin", className)}
        />
      </div>
    );
  },
);

export default Editor;
