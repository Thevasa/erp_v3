import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Login() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session || null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
        <h1>Signed in</h1>
        <p><Link href="/dashboard">Go to dashboard →</Link></p>
        <button onClick={() => supabase.auth.signOut()}>Sign out</button>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 420, margin: "0 auto" }}>
      <h1>Sign in</h1>
      <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} />
    </main>
  );
}
