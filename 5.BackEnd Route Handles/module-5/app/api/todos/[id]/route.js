export async function PUT(request, { params }) {
  const data = await request.json();

  const updatedTODO = {
    id: params.id,
    title: data.title,
    completed: data.completed,
  };

  return Response.json({ todo: updatedTODO });
}

export async function PATCH(request, { params }) {
  const data = await request.json();

  const updatedTODO = {
    id: params.id,
    ...data,
  };

  return Response.json({ todo: updatedTODO });
}

export async function DELETE(request, { params }) {
  const id = params.id;

  todos = todos.filter((todo) => todo.id !== id);

  return Response.json({
    message: `Todo ${id} deleted`,
    todos,
  });
}