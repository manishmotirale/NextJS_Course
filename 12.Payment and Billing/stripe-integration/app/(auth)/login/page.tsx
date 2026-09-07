// app/login/page.tsx

import { requireUnAuth } from "@/lib/auth-guard";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage() {
  await requireUnAuth();

  return <LoginForm />;
}
