import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.js";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const userMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    res.status(401).json({
      message: "Authorization header is required",
    });
    return;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({
      message: "Use Authorization: Bearer <token>",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_PASSWORD);

    if (typeof decoded === "string" || !decoded.id) {
      res.status(403).json({
        message: "Invalid authentication token",
      });
      return;
    }

    req.userId = decoded.id as string;
    next();
  } catch {
    res.status(403).json({
      message: "You are not logged in",
    });
  }
};