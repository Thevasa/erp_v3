import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        setUser(session.user);
      } else {
        router.push("/login");
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      if (data.session?.user) {
        setUser(data.session.user);
      } else {
        router.push("/login");
      }
    });

    return () => {
      isMounted = false;
      if (authListener?.subscription) authListener.subscription.unsubscribe();
    };
  }, [router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <p className="mb-4">Welcome, {user.email}</p>
      <button
        onClick={() => router.push("/logout")}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Sign Out
      </button>
    </div>
  );
}
