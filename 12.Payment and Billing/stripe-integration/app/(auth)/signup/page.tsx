// app/signup/page.tsx

import { requireUnAuth } from "@/lib/auth-guard";
import { SignupForm } from "@/components/signup-form";

export default async function SignupPage() {
  await requireUnAuth();

  return <SignupForm />;
}
