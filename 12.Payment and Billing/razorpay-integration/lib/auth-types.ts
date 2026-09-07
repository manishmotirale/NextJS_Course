// lib/auth-types.ts
import { auth } from "./auth";

declare module "better-auth" {
  interface User {
    plan: string; // or PLAN if you import the enum
  }
}
