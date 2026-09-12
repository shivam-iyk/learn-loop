import { Button, Description, Form, Input, Label, TextField } from "@heroui/react";
import React, { useState } from "react";
import { emailSchema } from "../schema/auth";
import useAppStore from "../store";

function UpdateEmail() {
  const { user } = useAppStore();

  const [email, setEmail] = useState({
    current: "",
    new: "",
  });

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col bg-background/50 p-6 gap-6 rounded-xl scroll-mt-20" id="update-email">
      <h5 className="md:text-2xl text-xl font-outfit font-semibold tracking-tight">
        Update Email
      </h5>
      <Form className="flex flex-col gap-4" onSubmit={handleUpdate}>
        <TextField
          name="current-email"
          value={email.current}
          onChange={(value) =>
            setEmail((prev) => ({ ...prev, current: value }))
          }
          validate={(value) => {
            const result = emailSchema.safeParse(value);
            return result.success ? null : result.error.issues[0].message;
          }}
          isDisabled={user.email.length > 0}
        >
          <Label>
            Current Email <span className="text-danger text-sm">*</span>
          </Label>
          <Input placeholder="mail@user.com" />
        </TextField>
        <TextField
          name="new-email"
          value={email.new}
          onChange={(value) => setEmail((prev) => ({ ...prev, new: value }))}
          validate={(value) => {
            const result = emailSchema.safeParse(value);
            return result.success ? null : result.error.issues[0].message;
          }}
        >
          <Label>
            New Email <span className="text-danger text-sm">*</span>
          </Label>
          <Input placeholder="new@user.com" />
          <Description className="text-muted text-xs">
            We'll send you verification code to both the emails to update your
            email
          </Description>
        </TextField>
        <Button>Continue</Button>
      </Form>
    </div>
  );
}

export default UpdateEmail;
