import { connectDB } from "@/lib/db";
import { Note } from "@/lib/models/Note";

export async function DELETE(req, { params }) {
  await connectDB();

  const { id } = await params;

  await Note.findByIdAndDelete(id);

  return Response.json({ message: "Deleted" });
}

export async function PUT(req, { params }) {
  await connectDB();

  const { id } = await params;
  const { title, content } = await req.json();
  const note = await Note.findByIdAndUpdate(
    id,
    { title, content },
    { returnDocument: "after" },
  );

  return Response.json(note);
}
