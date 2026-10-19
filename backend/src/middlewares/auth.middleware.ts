import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { User } from "../utils/types";
import ApiError from "../utils/ApiError";
import { verifyToken } from "../utils/token";

const verifyJWT = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Token is required", ["TOKEN_REQUIRED"]);
    }

    const data = (await verifyToken(token)) as JwtPayload;
    req.user = data as User;

    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return next(new ApiError(401, "Invalid token", ["INVALID_TOKEN"]));
    }
    next(error);
  }
};

export const identifyUser = async (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    const data = (await verifyToken(token)) as JwtPayload;
    req.user = data as User;

    if (!token) return next();
  } catch (error) {
    console.log(error);
  }

  next();
};

export default verifyJWT;
