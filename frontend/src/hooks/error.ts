import { useCallback, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "../services/api";

export type ParsedError = {
  message: string;
  description?: string;
  errorCode?: string;
  invalidate?: readonly unknown[];
};

const DEFAULT_MESSAGE = "Something went wrong";
const TRY_LATER = "Please try again later!";

const ERROR_MAP: Record<string, ParsedError> = {
  EMAIL_ALREADY_REGISTERED: {
    message: "Email already registered",
    description: "Please use another email",
  },
  MAIL_SEND_FAILED: {
    message: "Failed to send mail",
    description: TRY_LATER,
  },
  ACCOUNT_NOT_FOUND: {
    message: "Account does not exists with this email",
    description: "Try using another email",
  },
  EMAIL_NOT_VERIFIED: {
    message: "Email not verified",
    description: "Please verify your email to login",
    invalidate: [["user"]],
  },
  INCORRECT_PASSWORD: {
    message: "Incorrect password entered",
    description: "Please enter correct password",
  },
  USER_NOT_FOUND: {
    message: "Something went wrong",
    description: "Please login again",
    invalidate: [["user"]],
  },
  INVALID_CODE: {
    message: "Invalid verification code",
    description: "Please enter a valid code",
  },
  CODE_EXPIRED: {
    message: "Verification code expired",
    description: "Please request a new code",
  },
  TOKEN_REQUIRED: {
    message: "Something went wrong",
    invalidate: [["user"]],
  },
  INVALID_TOKEN: {
    message: "Something went wrong",
    invalidate: [["user"]],
  },
  UNAUTHORIZED: {
    message: "Something went wrong",
    description: "Unauthorized request",
    invalidate: [["user"]],
  },
  COVER_IMAGE_REQUIRED: {
    message: "Please upload cover image",
  },
  UPLOAD_FAILED: {
    message: "Image upload failed",
    description: TRY_LATER,
  },
  COURSE_NOT_FOUND: {
    message: "Course doesn't exist",
    description: TRY_LATER,
    invalidate: [["courses"]],
  },
  NOT_DRAFT: {
    message: "Course not a draft",
    invalidate: [["courses"]],
  },
  NOT_ENROLLED: {
    message: "You are not enrolled in this course",
    invalidate: [["my-courses"]],
  },
  ALREADY_ENROLLED: {
    message: "Already enrolled to this course",
    invalidate: [["my-courses"]],
  },
  CANNOT_ENROLL: {
    message: "You cannot enroll to this course",
    description: TRY_LATER,
    invalidate: [["courses"]],
  },
  INSTRUCTOR_NOT_FOUND: {
    message: "Instructor not found",
    description: TRY_LATER,
    invalidate: [["instructors"]],
  },
  VIDEO_NOT_FOUND: {
    message: "Video not found",
    description: "Make sure the video is public or unlisted",
  },
  INVALID_VIDEO_STATUS: {
    message: "Invalid video status",
    description: "Please keep the video public or unlisted",
  },
  LESSONS_BELONG_TO_OTHER_COURSES: {
    message: "Something went wrong",
    description: "Lessons belong to other courses",
    invalidate: [["lessons"]],
  },
  LESSONS_NOT_OWNED_BY_USER: {
    message: "Something went wrong",
    description: "Some lessons do not belong to you",
    invalidate: [["lessons"]],
  },
  COURSE_ID_REQUIRED: {
    message: "Something went wrong",
    description: "Course Id is missing",
  },
  MESSAGE_REQUIRED: {
    message: "Message is required",
    description: "Please enter some message or attachment",
  },
  MESSAGE_NOT_FOUND: {
    message: "Something went wrong",
    description: TRY_LATER,
    invalidate: [["messages"]],
  },
  QUIZ_NOT_FOUND: {
    message: "Quiz not found",
    invalidate: [["lessons"]],
  },
  IMAGE_SIZE: {
    message: "Image larger than 50MB",
    description: "Use smaller image size",
  },
  ALREADY_REVIEWED: {
    message: "You have already reviewed this course",
    invalidate: [["reviews"]],
  },
  REVIEW_NOT_FOUND: {
    message: "Something went wrong",
    description: "Review not found",
    invalidate: [["reviews"]],
  },
  PAYMENT_NOT_REQUIRED: {
    message: "Payment not required",
    invalidate: [["courses"]],
  },
  TRANSACTION_NOT_UPDATED: {
    message: "Something went wrong",
    description: "Failed to update payment status",
    invalidate: [["my-course"]],
  },
  ENROLLMENT_NOT_CREATED: {
    message: "Something went wrong",
    description: "Failed to enroll",
  },
  ALREADY_AN_INSTRUCTOR: {
    message: "You are already an instructor",
    invalidate: [["user"]],
  },
  COURSE_BANNED: {
    message: "Course not available",
    description: "",
    invalidate: [["courses"]],
  }
};

export function parseApiError(error: ApiError | null | undefined): ParsedError {
  const fallback = error?.message || DEFAULT_MESSAGE;
  const errorCode = error?.errors?.[0];

  if (error?.message === "Validation Error") {
    return { message: errorCode || fallback, errorCode: "VALIDATION" };
  }

  if (error?.message === "Network Error") {
    return {
      message: "You are offline",
      description: "Please connect to a network",
    };
  }

  if (errorCode === "ACTION_FAILED") {
    return {
      message: fallback,
      description: TRY_LATER,
      errorCode,
    };
  }

  if (errorCode === "NOT_FOUND") {
    return {
      message: "Not found",
      errorCode,
    };
  }

  if (errorCode && ERROR_MAP[errorCode]) {
    return ERROR_MAP[errorCode];
  }

  return { message: fallback };
}

export function useApiErrorHandler() {
  const queryClient = useQueryClient();

  return useCallback(
    (error: ApiError | null | undefined): ParsedError => {
      const parsed = parseApiError(error);
      if (parsed?.invalidate) {
        queryClient.invalidateQueries({ queryKey: parsed?.invalidate });
      }
      return parsed;
    },
    [queryClient],
  );
}

export function useParsedQueryError(error: ApiError | null | undefined) {
  const queryClient = useQueryClient();
  const parsed = useMemo(() => (error ? parseApiError(error) : null), [error]);

  useEffect(() => {
    if (parsed?.invalidate) {
      queryClient.invalidateQueries({ queryKey: parsed.invalidate });
    }
  }, [parsed, queryClient]);

  return parsed;
}
