import { createUser, createManyUsers, getAllUsers } from "@/actions/action";

import {
  createPost,
  getAllPost,
  deletePostById,
  updatePost,
} from "@/actions/post-action";

export default async function Home() {
  const users = await getAllUsers();

  const posts = await getAllPost();

  return (
    <div style={{ padding: "20px" }}>
      {/* USERS SECTION */}
      <h1>Prisma Users</h1>

      {/* Create Single User */}
      <form action={createUser} style={{ marginBottom: "20px" }}>
        <input type="text" name="name" placeholder="Enter Name" required />

        <input type="email" name="email" placeholder="Enter Email" required />

        <button type="submit">Create User</button>
      </form>

      {/* Create Many Users */}
      <form action={createManyUsers} style={{ marginBottom: "20px" }}>
        <button type="submit">Create Many Users</button>
      </form>

      {/* Get All Users */}
      <div>
        <h2>All Users</h2>

        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              style={{
                border: "1px solid gray",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <p>
                <strong>Name:</strong> {user.name}
              </p>

              <p>
                <strong>Email:</strong> {user.email}
              </p>

              <p>
                <strong>Created:</strong>{" "}
                {new Date(user.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      <hr style={{ margin: "40px 0" }} />

      {/* POSTS SECTION */}
      <h1>Prisma Posts</h1>

      {/* Create Post */}
      <form action={createPost} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="title"
          placeholder="Enter Post Title"
          required
          style={{
            width: "300px",
            padding: "8px",
            marginBottom: "10px",
          }}
        />

        <br />

        <textarea
          name="content"
          placeholder="Enter Post Content"
          rows={5}
          cols={50}
          style={{
            padding: "8px",
            marginBottom: "10px",
          }}
        />

        <br />

        <button type="submit">Create Post</button>
      </form>

      {/* Get All Posts */}
      <div>
        <h2>All Posts</h2>

        {posts.length === 0 ? (
          <p>No posts found</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              style={{
                border: "1px solid black",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "5px",
              }}
            >
              <p>
                <strong>Title:</strong> {post.title}
              </p>

              <p>
                <strong>Content:</strong> {post.content}
              </p>

              <p>
                <strong>Updated At:</strong>{" "}
                {new Date(post.updatedAt).toLocaleString()}
              </p>

              {/* Update Post */}
              <form
                action={updatePost.bind(null, post.id)}
                style={{ marginTop: "15px" }}
              >
                <input
                  type="text"
                  name="title"
                  defaultValue={post.title}
                  required
                  style={{
                    width: "250px",
                    padding: "5px",
                    marginBottom: "10px",
                  }}
                />

                <br />

                <textarea
                  name="content"
                  defaultValue={post.content || ""}
                  rows={3}
                  cols={40}
                  style={{
                    padding: "5px",
                    marginBottom: "10px",
                  }}
                />

                <br />

                <button
                  type="submit"
                  style={{
                    marginRight: "10px",
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                >
                  Update
                </button>
              </form>

              {/* Delete Post */}
              <form
                action={deletePostById.bind(null, post.id)}
                style={{ marginTop: "10px" }}
              >
                <button
                  type="submit"
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
