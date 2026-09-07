import Link from "next/link";

const users = [
  {
    id: 1,
    name: "Manish",
    role: "Frontend Developer",
  },
  {
    id: 2,
    name: "Rahul",
    role: "UI/UX Designer",
  },
  {
    id: 3,
    name: "Priya",
    role: "Backend Developer",
  },
];

const UsersPage = () => {
  return (
    <section className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-red-500 font-semibold">Our Team</p>

          <h1 className="text-5xl font-bold text-gray-900 mt-4">
            Users Directory
          </h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((user) => (
            <Link
              key={user.id}
              href={`/user/${user.id}`}
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-2xl font-bold mb-6">
                {user.name[0]}
              </div>

              <h2 className="text-2xl font-semibold text-gray-900">
                {user.name}
              </h2>

              <p className="text-gray-600 mt-2">{user.role}</p>

              <button className="mt-6 text-red-500 font-medium">
                View Profile →
              </button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UsersPage;
