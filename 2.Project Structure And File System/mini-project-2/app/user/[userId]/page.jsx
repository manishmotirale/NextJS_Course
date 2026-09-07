const users = {
  1: {
    name: "Manish",
    role: "Frontend Developer",
    bio: "Passionate about React, Next.js, and UI design.",
  },

  2: {
    name: "Rahul",
    role: "UI/UX Designer",
    bio: "Creates modern and user-friendly interfaces.",
  },

  3: {
    name: "Priya",
    role: "Backend Developer",
    bio: "Works with APIs, databases, and server-side logic.",
  },
};

const UserProfile = ({ params }) => {
  const user = users[params.userId];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
        User Not Found
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-red-50 to-red-100 py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
          <div className="w-28 h-28 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-5xl font-bold mx-auto mb-8">
            {user.name[0]}
          </div>

          <h1 className="text-5xl font-bold text-gray-900">{user.name}</h1>

          <p className="text-red-500 text-xl mt-3">{user.role}</p>

          <p className="text-gray-600 leading-relaxed mt-8 text-lg">
            {user.bio}
          </p>

          <button className="mt-10 bg-red-500 hover:bg-red-600 transition text-white px-8 py-3 rounded-full">
            Contact User
          </button>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
