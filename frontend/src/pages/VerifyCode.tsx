import {
  Form,
  TextField,
  Label,
  InputOTP,
  FieldError,
  Button,
  InputGroup,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { emailSchema, otpSchema } from "../schema/auth";
import { Mail } from "lucide-react";

function VerifyCode() {
  const navigate = useNavigate();
  const timeoutRef = useRef<number | null>(null);
  const [searchParams] = useSearchParams();

  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);
  const [creds, setCreds] = useState({
    email: "",
    otp: "",
    flow: false,
  });

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(60);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = otpSchema.safeParse(creds.otp);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    } else {
      setError(null);
    }
    navigate({ pathname: "/home", search: "?upgrade=true" });
  };

  useEffect(() => {
    const email = searchParams.get("email");
    setCreds((prev) => ({ ...prev, flow: !!email, email: email || "" }));
  }, [searchParams]);

  useEffect(() => {
    timeoutRef.current = setInterval(
      () =>
        setTimer((prev) => {
          if (prev > 0) {
            return prev - 1;
          }
          if (timeoutRef.current) {
            clearInterval(timeoutRef.current);
          }
          return prev;
        }),
      1000,
    );

    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen relative">
      <Form
        className="p-10 lg:w-1/3 sm:w-1/2 min-w-96 border rounded-4xl bg-white dark:bg-black animate-step-in"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4">
          <div className="mb-4">
            <h2 className="font-agdasima text-4xl font-extrabold tracking-tight text-center">
              Verify Your Email
            </h2>
            <p className="text-muted text-center">
              Enter the verification code sent to your email to continue
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
          <div className="flex flex-col">
            <span className="label">
              OTP <span className="text-danger">*</span>
            </span>
            <InputOTP
              name="otp"
              value={creds.otp}
              onChange={(value) =>
                setCreds((prev) => ({ ...prev, otp: value }))
              }
              className="mt-2"
              maxLength={6}
            >
              <InputOTP.Group className="flex justify-evenly gap-4 w-full">
                <InputOTP.Slot index={0} className="font-normal" />
                <InputOTP.Slot index={1} className="font-normal" />
                <InputOTP.Slot index={2} className="font-normal" />
                <InputOTP.Slot index={3} className="font-normal" />
                <InputOTP.Slot index={4} className="font-normal" />
                <InputOTP.Slot index={5} className="font-normal" />
              </InputOTP.Group>
            </InputOTP>
            {error && <p className="text-xs text-danger">{error}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <button className="w-full button ring-visible-offset bg-linear-to-b from-accent/50 via-accent to-accent text-white">
              Verify
            </button>
            <Button
              variant="outline"
              className="w-full"
              isDisabled={timer > 0}
              type="button"
              onClick={handleResend}
            >
              Resend Code
              <span className={timer === 0 ? "hidden" : ""}>(in {timer}s)</span>
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default VerifyCode;
