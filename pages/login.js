import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function Login() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) setSession(data.session || null);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut({ scope: "local" });
    window.location.href = "/login";
  }

  if (session) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
        <h1>Signed in</h1>
        <p><a href="/dashboard">Go to dashboard →</a></p>
        <p><a href="/inventory">Inventory (read-only) →</a></p>
        <p><a href="/admin/inventory">Admin inventory →</a></p>
        <p>
          <button type="button" onClick={handleSignOut}>Sign out</button>
          {" "}or{" "}
          <a href="/logout">use logout link</a>
        </p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 420, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>Sign in</h1>
      <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} />
      <p style={{ marginTop: 12 }}><a href="/">Back home</a></p>
    </main>
  );
}
