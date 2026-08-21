import { Button, Form, Input, Label, TextField } from "@heroui/react";
import { useState } from "react";
import { nameSchema } from "../schema/course";
import RichTextField from "../components/RichTextField";
import SkillField from "./SkillField";
import { bioSchema } from "../schema/user";

interface FormI {
  name: string;
  email: string;
  bio: string;
  skills: string[];
}

function BasicDetailsForm() {
  const [form, setForm] = useState<FormI>({
    name: "",
    email: "",
    bio: "",
    skills: [],
  });

  return (
    <Form className="flex flex-col gap-6 scroll-mt-20" id="basic-details">
      <TextField
        name="name"
        autoComplete="name"
        value={form.name}
        onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
        validate={(value) => {
          const result = nameSchema.safeParse(value);
          return result.success ? null : result.error.issues[0].message;
        }}
      >
        <Label>
          Name <span className="text-danger text-sm">*</span>
        </Label>
        <Input placeholder="Your full name" />
      </TextField>
      <RichTextField
        value={form.bio}
        onChange={(value) => setForm((prev) => ({ ...prev, bio: value }))}
        label="Bio"
        placeholder="Tell about you"
        validate={(value) => {
          const result = bioSchema.safeParse(value);
          return result.success ? null : result.error.issues[0].message;
        }}
      />
      <SkillField
        skills={form.skills}
        setSkills={(skills) => setForm((prev) => ({ ...prev, skills }))}
      />
      <Button>Update</Button>
    </Form>
  );
}

export default BasicDetailsForm;
