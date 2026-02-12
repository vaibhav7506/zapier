function getJwtPassword(): string {
  const password = process.env.JWT_PASSWORD;
  if (process.env.NODE_ENV === "production" && !password) {
    throw new Error("JWT_PASSWORD must be set in production");
  }
  return password || "dev-only-secret-change-in-production";
}

export const JWT_PASSWORD = getJwtPassword();