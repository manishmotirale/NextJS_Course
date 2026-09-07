import { redirect } from "next/navigation";

export default function Home() {
  const isLoggedIn = false;

  if (!isLoggedIn) {
    redirect("/login");
  }

  return <h1>Home Page</h1>;
}