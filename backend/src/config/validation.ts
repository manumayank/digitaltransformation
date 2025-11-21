export function initializeConfig() {
  const config = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: parseInt(process.env.PORT || "3001"),
  };
  if (!process.env.DATABASE_URL) throw new Error("Missing DATABASE_URL");
  console.log("Config validated");
  return config;
}
