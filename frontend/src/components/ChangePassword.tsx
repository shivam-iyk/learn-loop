import {
  Button,
  Description,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { useState } from "react";
import { passwordSchema } from "../schema/auth";

function ChangePassword() {
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleUpdate = () => {};

  return (
    <div
      className="space-y-4 border border-default p-6 rounded-xl scroll-mt-20"
      id="change-password"
    >
      <h5 className="md:text-2xl text-xl font-outfit font-semibold tracking-tight">
        Change Password
      </h5>
      <Form className="space-y-4" onSubmit={handleUpdate}>
        <TextField
          name="current-password"
          value={password.current}
          onChange={(value) =>
            setPassword((prev) => ({ ...prev, current: value }))
          }
          validate={(value) => {
            const result = passwordSchema.safeParse(value);
            return result.success ? null : result.error.issues[0].message;
          }}
        >
          <Label>
            Current Password <span className="text-danger text-sm">*</span>
          </Label>
          <Input placeholder="Current Password" />
        </TextField>
        <TextField
          name="new-password"
          value={password.new}
          onChange={(value) => setPassword((prev) => ({ ...prev, new: value }))}
          validate={(value) => {
            const result = passwordSchema.safeParse(value);
            return result.success ? null : result.error.issues[0].message;
          }}
        >
          <Label>
            New Password <span className="text-danger text-sm">*</span>
          </Label>
          <Input placeholder="New Password" />
        </TextField>
        <TextField
          name="new-password"
          value={password.new}
          onChange={(value) => setPassword((prev) => ({ ...prev, new: value }))}
          validate={(value) => {
            const result = passwordSchema.safeParse(value);
            return result.success ? null : result.error.issues[0].message;
          }}
        >
          <Label>
            Confirm Password <span className="text-danger text-sm">*</span>
          </Label>
          <Input placeholder="Confirm New Password" />
          <Description className="text-muted text-xs">
            We'll send you a verification code to verify it&apos;s you
          </Description>
        </TextField>
        <Button>Next</Button>
      </Form>
    </div>
  );
}

export default ChangePassword;
