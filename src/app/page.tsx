"use client";
import { User } from "@/auth";
import { signOut, useSession } from "@/auth-client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user as User | undefined;

  if (isPending) {

    return <div className="min-h-screen bg-gradient-to-tr from-purple-100 to-blue-100 flex items-center justify-center p-6">

      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>

    </div>
  }


  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-100 to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg flex flex-col items-center text-center space-y-6">
        {user?.image && (
          <img
            src={user.image}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-purple-300 shadow-md object-cover"
          />
        )}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            {user?.name || "No Name"}
          </h1>
          <p>
            id: {user?.id}
          </p>
          <p className="text-md text-gray-500">
            <span className="font-medium">Username:</span>{" "}
            {user?.username || "Not provided"}
          </p>

          <p className="text-md text-gray-500">
            <span className="font-medium">Email:</span>{" "}
            {user?.email || "Not provided"}
          </p>
        </div>
        <button
          onClick={() =>
            signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push("/login");
                },
              },
            })
          }
          className="bg-red-500 text-white px-6 py-2 rounded-full shadow hover:bg-red-600 transition duration-200"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
