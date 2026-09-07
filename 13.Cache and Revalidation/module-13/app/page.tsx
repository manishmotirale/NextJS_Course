// Lecture 1
// import { getUsers, updateList } from "@/actions";
// import Image from "next/image";

import UserList from "@/components/user-list";

// export default async function Home() {
//   const data = await getUsers();

//   return (
//     <>
//       <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//         <h1 className="text-2xl font-bold mb-4">Users List</h1>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//           {data.map((user: any, index: number) => (
//             <div key={user.id}>
//               <p>{index + 1}</p>
//               <img
//                 src={user.avatar}
//                 alt={`${user.name}'s avatar`}
//                 width={100}
//                 height={100}
//                 className="rounded-full mb-4"
//               />

//               <h2 className="text-xl font-bold">{user.name}</h2>
//               <p className="text-white-600 dark:text-gray-400">
//                 {user.createdAt}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div>
//         <form action={updateList}>
//           <button type="submit">Update List</button>
//         </form>
//       </div>
//     </>
//   );
// }


// Lecture 2
import { Suspense } from "react";
import {UserList} from "@/components/user-list";

export default function Home() {
  return (
    <>
      <h1>User Directory</h1>
      <Suspense fallback={<p>Loading users...</p>}>
        <UserList />
      </Suspense>
    </>
  );
}