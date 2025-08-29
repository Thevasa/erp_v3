import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function AdminInventory() {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");

  async function load() {
    const { data, error } = await supabase.from("inventory").select("*").order("id", { ascending: true });
    if (error) { alert(error.message); return; }
    setItems(data || []);
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = "/login"; return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(user);
      const { data: profile } = await supabase.from("profiles").select("role").eq("user_id", user.id).single();
      if (!mounted) return;
      setRole(profile?.role || "operator");
      await load();
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  async function addItem(e) {
    e.preventDefault();
    const quantity = parseInt(qty, 10) || 0;
    const { error } = await supabase.from("inventory").insert({ name, quantity });
    if (error) return alert(error.message);
    setName(""); setQty("");
    await load();
  }

  async function updateQty(id, quantity) {
    const q = parseInt(quantity, 10);
    const { error } = await supabase.from("inventory").update({ quantity: q }).eq("id", id);
    if (error) return alert(error.message);
    await load();
  }

  async function remove(id) {
    const { error } = await supabase.from("inventory").delete().eq("id", id);
    if (error) return alert(error.message);
    await load();
  }

  if (loading) return <main style={{ padding: 24 }}>Loading…</main>;

  if (role !== "admin") {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
        <h1>Admin Inventory</h1>
        <p>Signed in as {user?.email}</p>
        <p><strong>Not authorized.</strong> You must be admin.</p>
        <p><a href="/inventory">View inventory</a></p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Admin Inventory</h1>
      <p>User: {user?.email} • Role: <strong>{role}</strong></p>
      <form onSubmit={addItem} style={{ margin: "12px 0" }}>
        <input placeholder="Item name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Quantity" type="number" value={qty} onChange={e => setQty(e.target.value)} style={{ marginLeft: 8 }} />
        <button type="submit" style={{ marginLeft: 8 }}>Add</button>
      </form>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead><tr><th>ID</th><th>Name</th><th>Quantity</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>
                <input
                  type="number"
                  defaultValue={row.quantity}
                  onBlur={e => updateQty(row.id, e.target.value)}
                  style={{ width: 80 }}
                />
              </td>
              <td>
                <button onClick={() => remove(row.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: 12 }}><a href="/dashboard">Back to dashboard</a></p>
    </main>
  );
}
