import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Logout() {
  useEffect(() => {
    (async () => {
      try {
        await supabase.auth.signOut({ scope: "local" });
      } finally {
        window.location.replace("/login");
      }
    })();
  }, []);
  return <main style={{ padding: 24 }}>Signing out…</main>;
}
