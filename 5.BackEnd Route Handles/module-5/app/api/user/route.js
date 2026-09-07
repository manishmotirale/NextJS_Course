import { headers, cookies } from "next/headers";

export async function GET(request) {
  //   const reqHeaders = new Headers(request.headers);
  //   const username = request.cookies.get("username");
  const reqHeaders = await headers();
  const cookieStore = await cookies();

  cookieStore.set("theme", "dark");
  const theme = cookieStore.get("theme");
  console.log(theme);

  console.log(reqHeaders.get("Authorization"));
  console.log(reqHeaders.get("user-agent"));

  return Response.json("<h1>HELLO WORLD</h1>", {
    headers: {
      "content-type": "text/html",
      "set-cookie": "username=manish",
    },
  });
}
