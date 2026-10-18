const { PORT, DATABASE_URL, JWT_SECRET, NODE_ENV, CLIENT_URL } = process.env;

if (!DATABASE_URL) throw new Error("Missing required environment variable: DATABASE_URL");
if (!JWT_SECRET) throw new Error("Missing required environment variable: JWT_SECRET");

export const config = {
  port: Number(PORT || 3001),
  databaseUrl: DATABASE_URL,
  jwtSecret: JWT_SECRET,
  nodeEnv: NODE_ENV || "development",
  clientUrl: CLIENT_URL || "http://localhost:5173",
};
