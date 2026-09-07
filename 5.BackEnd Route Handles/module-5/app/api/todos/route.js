export async function POST(request) {
  // 1. Parse the json body fro the client
  const body = await request.json();

  const { title, completed } = body;

  // You can do database logic here - etc

  return Response.json({
    success: true,
    message: "Todo Created Successfully",
    todo: {
      title,
      completed,
    },
  });
}
