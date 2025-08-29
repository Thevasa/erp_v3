export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>ERP starter ✅</h1>
      <p><a href="/login">Sign in →</a></p>
      <p><a href="/dashboard">Dashboard →</a></p>
      <p><a href="/inventory">Inventory (read-only) →</a></p>
      <p><a href="/admin/inventory">Admin Inventory →</a></p>
      <p><a href="/api/inventory">Inventory API (JSON) →</a></p>
    </main>
  );
}

