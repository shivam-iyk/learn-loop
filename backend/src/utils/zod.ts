import z from "zod";

z.config({
  customError: (issue) => {
    if (issue.code === "invalid_type") {
      switch (issue.expected) {
        case "string":
          return { message: "Please enter a valid value" };
        case "number":
          return { message: "Please enter a valid number" };
        case "email":
          return { message: "Please enter a valid email address" };
        case "nan":
          return { message: "Please enter a valid number" };
        case "int":
          return { message: "Please enter a valid number" };
        default:
          return { message: "Please enter a valid value" };
      }
    } else if (issue.code === "too_small") {
      if (issue.minimum === 0 && issue.origin === "number") {
        return { message: "Value cannot be negative" };
      } else if (issue.minimum === 1 && issue.origin === "string") {
        return { message: "Value is required" };
      }
      return {
        message: `Value must be at least ${issue.minimum}`,
      };
    } else if (issue.code === "too_big") {
      return {
        message: `Value must be at most ${issue.maximum}`,
      };
    }
  },
});
