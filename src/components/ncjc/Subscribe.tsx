import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export function Subscribe() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setState("loading");
    const { error: insertError } = await supabase.from("subscribers").insert({ email: value });
    if (insertError) {
      if (insertError.code === "23505") {
        setState("done");
        return;
      }
      setError("Something went wrong. Please try again.");
      setState("idle");
      return;
    }
    setState("done");
  };

  return (
    <section className="blob-card-alt border border-border/60 bg-forest/10 p-8 sm:p-12">
      <h2 className="text-3xl font-semibold sm:text-4xl">Get NCJC in your inbox</h2>
      <p className="mt-3 max-w-lg text-foreground/75">
        One calm email each morning. Marketing trends, minus the noise.
      </p>
      {state === "done" ? (
        <p className="mt-6 rounded-full bg-forest px-5 py-3 text-sm text-forest-foreground inline-block">
          You're on the list. See you tomorrow morning.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            aria-label="Email address"
            className="flex-1 rounded-full border border-border bg-card px-5 py-3 text-base outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={state === "loading"}
            className="rounded-full bg-coffee px-6 py-3 text-base font-medium text-coffee-foreground transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {state === "loading" ? "Joining…" : "Subscribe"}
          </button>
        </form>
      )}
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
    </section>
  );
}
