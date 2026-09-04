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
import {
  confirmPasswordSchema,
  emailSchema,
  otpSchema,
  passwordSchema,
} from "../schema/auth";
import { Eye, EyeOff, Key, Mail } from "lucide-react";

function ForgotPassword() {
  const navigate = useNavigate();
  const timeoutRef = useRef<number | null>(null);
  const [searchParams] = useSearchParams();

  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);
  const [step, setStep] = useState<1 | 2>(1);
  const [codeSent, setCodeSent] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [creds, setCreds] = useState({
    email: "",
    otp: "",
    flow: false,
  });
  const [passwords, setPasswords] = useState({
    default: "",
    confirm: "",
  });

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(60);
  };

  const handleContinue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!codeSent) {
      setCodeSent(true);
      setTimer(60);
      return;
    }
    const result = otpSchema.safeParse(creds.otp);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    } else {
      setError(null);
    }
    setStep(2);
    localStorage.setItem(
      "resetEmail",
      JSON.stringify({ ...creds, date: new Date() }),
    );
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/home");
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
      {step === 1 && (
        <Form
          className="p-10 lg:w-1/3 sm:w-1/2 min-w-96 border rounded-4xl  bg-white! dark:bg-black! animate-step-in"
          onSubmit={handleContinue}
          key="email"
        >
          <div className="flex flex-col gap-4">
            <div className="mb-4">
              <h2 className="font-agdasima text-4xl font-extrabold tracking-tight text-center">
                Forgot Your Password?
              </h2>
              <p className="text-muted text-center">
                Enter your email to receive a verification code
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
            {codeSent && (
              <div className="flex flex-col">
                <Label>
                  OTP <span className="text-danger">*</span>
                </Label>
                <InputOTP
                  value={creds.otp}
                  onChange={(value) =>
                    setCreds((prev) => ({ ...prev, otp: value }))
                  }
                  className="mt-2"
                  maxLength={6}
                  autoFocus
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
            )}
            <div className="flex flex-col gap-2">
              <button className="w-full button ring-visible-offset bg-linear-to-b from-accent/50 via-accent to-accent text-white">
                {codeSent ? "Send Code" : "Continue"}
              </button>
              {codeSent && (
                <Button
                  variant="outline"
                  className="w-full"
                  isDisabled={timer > 0}
                  type="button"
                  onClick={handleResend}
                >
                  Resend Code
                  <span className={timer === 0 ? "hidden" : ""}>
                    (in {timer}s)
                  </span>
                </Button>
              )}
            </div>
          </div>
        </Form>
      )}
      {step === 2 && (
        <Form
          className="p-10 lg:w-1/3 sm:w-1/2 min-w-96 border rounded-4xl bg-white! dark:bg-black! animate-step-in"
          onSubmit={handleUpdate}
          key="password"
        >
          <div className="flex flex-col gap-4">
            <div className="mb-4">
              <h2 className="font-agdasima text-4xl font-extrabold tracking-tight text-center">
                Forgot Your Password?
              </h2>
              <p className="text-muted text-center">
                Enter your password to update it
              </p>
            </div>
            <TextField
              name="password"
              value={passwords.default}
              onChange={(value) =>
                setPasswords((prev) => ({ ...prev, default: value }))
              }
              validate={(value) => {
                const result = passwordSchema.safeParse(value);
                return result.success ? null : result.error.issues[0].message;
              }}
            >
              <Label>
                Password <span className="text-danger">*</span>
              </Label>
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
            <TextField
              name="confirm-password"
              value={passwords.confirm}
              onChange={(value) =>
                setPasswords((prev) => ({ ...prev, confirm: value }))
              }
              validate={(value) => {
                const result = confirmPasswordSchema.safeParse(value);
                return result.success ? null : result.error.issues[0].message;
              }}
            >
              <Label>
                Confirm Password <span className="text-danger">*</span>
              </Label>
              <InputGroup>
                <InputGroup.Prefix>
                  <Key className="size-4 text-muted" />
                </InputGroup.Prefix>
                <InputGroup.Input
                  className="w-full"
                  type={showPwd ? "text" : "password"}
                  placeholder="Confirm Password"
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
              Update
            </button>
          </div>
        </Form>
      )}
    </div>
  );
}

export default ForgotPassword;
