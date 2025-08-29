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
      if (error) console.error(error);

      if (!mounted) return;
      setRole(data?.role ?? "operator");
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut({ scope: "local" });
    window.location.href = "/login";
  }

  if (loading) {
    return <main style={{ padding: 24 }}>Loading…</main>;
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Dashboard</h1>
      <p>User: {user?.email}</p>
      <p>Role: <strong>{role}</strong></p>

      <p><a href="/inventory">Inventory (read-only) →</a></p>
      <p><a href="/admin/inventory">Admin inventory →</a></p>
      <p><a href="/api/inventory">Inventory API (JSON) →</a></p>

      <p>
        <button type="button" onClick={handleSignOut}>Sign out</button>
        {" "}or{" "}
        <a href="/logout">use logout link</a>
      </p>
    </main>
  );
}
