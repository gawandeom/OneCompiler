import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Generation does not need a live database. Database commands still require
    // DATABASE_URL, and use this harmless local URL only when it is absent.
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/postgres",
  },
});
