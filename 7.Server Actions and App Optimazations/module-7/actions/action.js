"use server";

export async function createTodo(formData) {
  const title = formData.get("title");

  console.log("Creating a Todo:", title);

  // Example DB call
  // await db.todo.create({ data: { title } });

  return {
    success: true,
    message: "Todo created successfully",
  };
}

export async function updateTodo(title, desc, isComp) {
  const newData = {
    title,
    desc,
    isComp,
  };

  console.log(newData);

  // Example DB call
  // await db.todo.update(...)

  return {
    success: true,
    message: "Updated Successfully",
  };
}

export async function submitUser(formData) {
  const name = formData.get("name");
  const email = formData.get("email");

  console.log("Submitting user Data", name, email);

  // db logic
}
