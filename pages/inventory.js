import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = "/login"; return; }
      const { data, error } = await supabase.from("inventory").select("*").order("id", { ascending: true });
      if (error) { console.error(error); alert(error.message); return; }
      setItems(data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <main style={{ padding: 24 }}>Loading…</main>;

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Inventory (read-only)</h1>
      <p><a href="/dashboard">Back to dashboard</a></p>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead><tr><th>ID</th><th>Name</th><th>Quantity</th><th>Created</th></tr></thead>
        <tbody>
          {items.map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.quantity}</td>
              <td>{new Date(row.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
