import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = "/login"; return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(user);
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();
      if (!mounted) return;
      setRole(data?.role ?? "operator");
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <main style={{ padding: 24 }}>Loading…</main>;

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Dashboard</h1>
      <p>User: {user?.email}</p>
      <p>Role: <strong>{role}</strong></p>
      <p><a href="/api/inventory">View inventory JSON →</a></p>
      {role === "admin" ? (
        <p>You are admin. Here you could add CRUD UI for inventory.</p>
      ) : (
        <p>You are operator. Read-only access enforced by RLS.</p>
      )}
      import SignOutButton from "../components/SignOutButton";
// ...
<button onClick={() => {}} style={{ display: "none" }} />
<SignOutButton />

    </main>
  );
}
