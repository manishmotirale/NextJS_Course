export default async function Home() {
  const res = await fetch("https://api.github.com/users/manishmotirale");
  const user = await res.json();
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{JSON.stringify(user)}</p>

      <button>Click Me</button>
    </div>
  );
}
