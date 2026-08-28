import { JwtPayload } from "jsonwebtoken";

type AuthPayload = JwtPayload & {
  id: number;
  name: string;
  email: string;
  role: "instructor" | "student";
  is_verified: boolean;
  is_banned: boolean;
  login_type: "email" | "google";
};

export function isAuthPayload(payload: JwtPayload): payload is AuthPayload {
  return (
    typeof payload.id === "number" &&
    typeof payload.name === "string" &&
    typeof payload.email === "string" &&
    (payload.role === "instructor" || payload.role === "student") &&
    typeof payload.is_verified === "boolean" &&
    typeof payload.is_banned === "boolean" &&
    (payload.login_type === "email" || payload.login_type === "google")
  );
}
