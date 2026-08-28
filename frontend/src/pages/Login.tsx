import {
  Button,
  FieldError,
  Form,
  InputGroup,
  Label,
  Separator,
  TextField,
} from "@heroui/react";
import { Eye, EyeOff, Key, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { emailSchema, passwordSchema } from "../schema/auth";

function Login() {
  const navigate = useNavigate();

  const [showPwd, setShowPwd] = useState(false);
  const [creds, setCreds] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate({
      pathname: "/home",
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative py-10">
      <Form
        className="p-10 lg:w-1/3 sm:w-1/2 min-w-96 border rounded-4xl bg-white dark:bg-black animate-step-in"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4">
          <div className="mb-4">
            <h2 className="font-agdasima text-4xl font-extrabold tracking-tight text-center">
              Welcome Back
            </h2>
            <p className="text-muted text-center">
              Continue your Learning Journey
            </p>
          </div>
          <TextField
            name="email"
            value={creds.email}
            autoComplete="email"
            onChange={(value) =>
              setCreds((prev) => ({ ...prev, email: value }))
            }
            validate={(value) => {
              const result = emailSchema.safeParse(value);
              return result.success ? null : result.error.issues[0].message;
            }}
          >
            <Label>
              Email <span className="text-danger">*</span>
            </Label>
            <InputGroup>
              <InputGroup.Prefix>
                <Mail className="size-4 text-muted" />
              </InputGroup.Prefix>
              <InputGroup.Input
                className="w-full"
                placeholder="name@email.com"
              />
            </InputGroup>
            <FieldError />
          </TextField>
          <TextField
            name="password"
            value={creds.password}
            onChange={(value) =>
              setCreds((prev) => ({ ...prev, password: value }))
            }
            validate={(value) => {
              const result = passwordSchema.safeParse(value);
              return result.success ? null : result.error.issues[0].message;
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <Label>
                Password <span className="text-danger">*</span>
              </Label>
              <Link
                to="/forgot-password"
                className="text-sm text-muted hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <InputGroup>
              <InputGroup.Prefix>
                <Key className="size-4 text-muted" />
              </InputGroup.Prefix>
              <InputGroup.Input
                className="w-full"
                type={showPwd ? "text" : "password"}
                placeholder="Password"
              />
              <InputGroup.Suffix className="p-1">
                <Button
                  aria-label={showPwd ? "Hide password" : "Show password"}
                  size="sm"
                  variant="ghost"
                  onPress={() => setShowPwd(!showPwd)}
                  isIconOnly
                >
                  {showPwd ? (
                    <Eye className="size-4" />
                  ) : (
                    <EyeOff className="size-4" />
                  )}
                </Button>
              </InputGroup.Suffix>
            </InputGroup>
            <FieldError />
          </TextField>
          <button className="w-full button ring-visible-offset bg-linear-to-b from-accent/50 via-accent to-accent text-white">
            Login
          </button>

          <div className="relative">
            <Separator />
            <span className="absolute text-muted bg-white dark:bg-black font-huninn uppercase tracking-tight text-xs left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 px-2">
              or
            </span>
          </div>
          <button className="w-full button button--outline ring-visible-offset">
            <img src="/google-icon.svg" className="size-5" /> Continue with
            Google
          </button>
          <p className="text-center text-muted text-sm">
            Don&apos;t have an account.
            <Link
              to="/register"
              className="hover:text-accent hover:underline px-1 py-2"
            >
              Create One
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
}

export default Login;
