import { randomBytes } from "node:crypto";

export function random(length: number): string {
  return randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}