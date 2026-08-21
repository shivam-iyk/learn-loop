import {
  Button,
  cn,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { ChevronRight } from "lucide-react";
import {
  categorySchema,
  coverSchema,
  descriptionSchema,
  nameSchema,
  priceSchema,
  taglineSchema,
} from "../schema/course";
import RichTextField from "./RichTextField";
import { useState, type ChangeEvent } from "react";
import type { CourseDetailsFormI } from "../types/course";
import SkillField from "./SkillField";

function CourseDetailsForm({
  form,
  cover,
  setForm,
  setCover,
  handleNext,
  headerClassName = "",
  formClassName = "",
  editorClassName = "",
  toolbarClassName = "",
}: {
  cover: { file: File | null; uri: string };
  setCover: (cover: { file: File | null; uri: string }) => void;
  form: CourseDetailsFormI;
  setForm: (form: CourseDetailsFormI) => void;
  handleNext: () => void;
  headerClassName?: string;
  formClassName?: string;
  editorClassName?: string;
  toolbarClassName?: string;
}) {
  const [invalid, setInvalid] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 50_000_000) {
      setFileError("File size must be within 50 MB");
    } else {
      setFileError(null);
    }

    const result = coverSchema.safeParse(file);
    if (result.success) {
      const uri = URL.createObjectURL(file);
      setCover({ file, uri });
      setFileError(null);
    } else {
      setFileError(result.error.issues[0].message);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = descriptionSchema.safeParse(form.description);
    if (!cover) {
      setFileError("Cover image is required");
      return;
    }
    if (result.success) {
      return handleNext();
    }
    setInvalid(true);
  };

  return (
    <Form
      id="course-details"
      className={cn("flex flex-col gap-6 w-full", formClassName)}
      onSubmit={handleSubmit}
      onInvalid={() => setInvalid(true)}
    >
      <div className={headerClassName}>
        <h4 className="text-xl font-poppins font-semibold tracking-tight">
          Course Details
        </h4>
        <p className="text-muted text-sm">Describe your course</p>
      </div>
      <TextField
        name="name"
        type="text"
        value={form.name}
        onChange={(value) => setForm({ ...form, name: value })}
        validate={(value) => {
          const result = nameSchema.safeParse(value);
          return result.success ? null : result.error.issues[0].message;
        }}
        autoComplete="name"
      >
        <Label>
          Name <span className="text-danger">*</span>
        </Label>
        <Input placeholder="Name of the course" />
        <FieldError />
      </TextField>
      <TextField
        name="tagline"
        type="text"
        value={form.tagline}
        onChange={(value) => setForm({ ...form, tagline: value })}
        validate={(value) => {
          const result = taglineSchema.safeParse(value);
          return result.success ? null : result.error.issues[0].message;
        }}
      >
        <Label>
          Tagline <span className="text-danger">*</span>
        </Label>
        <Input placeholder="Describe your course in a line" />
        <FieldError />
      </TextField>
      <RichTextField
        label={
          <>
            Description <span className="text-danger">*</span>
          </>
        }
        className={editorClassName}
        toolbarClassName={toolbarClassName}
        value={form.description}
        onChange={(value) => setForm({ ...form, description: value })}
        invalid={invalid}
        placeholder="Explain this course"
        validate={(value) => {
          const result = descriptionSchema.safeParse(value);
          return result.success ? null : result.error.issues[0].message;
        }}
      />
      <TextField
        name="category"
        type="text"
        value={form.category}
        onChange={(value) => setForm({ ...form, category: value })}
        validate={(value) => {
          const result = categorySchema.safeParse(value);
          return result.success ? null : result.error.issues[0].message;
        }}
      >
        <Label>
          Category <span className="text-danger">*</span>
        </Label>
        <Input placeholder="Provide a category to this course" />
        <FieldError />
      </TextField>
      <div className="flex flex-col gap-1">
        <Label htmlFor="cover">
          Cover Image <span className="text-danger">*</span>
        </Label>
        <input
          id="cover"
          className="input"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFile}
        />
        {fileError && <p className="text-danger text-xs">{fileError}</p>}
      </div>
      <SkillField
        skills={form.skills}
        setSkills={(skills) => setForm({ ...form, skills })}
      />
      <TextField
        name="price"
        type="text"
        value={form.price}
        onChange={(value) => setForm({ ...form, price: value })}
        validate={(value) => {
          const result = priceSchema.safeParse(value);
          return result.success ? null : result.error.issues[0].message;
        }}
      >
        <Label>Price (in )</Label>
        <Input placeholder="Value of this course" />
        <Description>Enter 0 if you want this course to be free</Description>
        <FieldError />
      </TextField>
      <div className="flex justify-end gap-2">
        <Button type="submit">
          Next
          <ChevronRight />
        </Button>
      </div>
    </Form>
  );
}

export default CourseDetailsForm;
