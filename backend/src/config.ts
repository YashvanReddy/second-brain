import "dotenv/config";

const jwtPassword = process.env.JWT_PASSWORD;

if (!jwtPassword) {
  throw new Error("JWT_PASSWORD is not defined");
}

export const JWT_PASSWORD = jwtPassword;