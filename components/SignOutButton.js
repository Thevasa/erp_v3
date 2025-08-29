import { supabase } from "../lib/supabaseClient";

export default function SignOutButton({ redirectTo = "/login" }) {
  return (
    <button
      type="button"
      onClick={async () => {
        await supabase.auth.signOut({ scope: "local" });
        window.location.href = redirectTo;
      }}
    >
      Sign out
    </button>
  );
}
