// ============================================================
// CONFIG — Supabase project settings.
// Values can be overridden with Vite env vars (VITE_SUPABASE_URL, etc.)
// in a .env.local file. The anon key is the PUBLIC key — safe to expose.
// ============================================================

export const CONFIG = {
  SUPABASE_URL:
    import.meta.env.VITE_SUPABASE_URL ??
    "https://liqqvcaihvuvoddqismh.supabase.co",

  SUPABASE_ANON_KEY:
    import.meta.env.VITE_SUPABASE_ANON_KEY ??
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpcXF2Y2FpaHZ1dm9kZHFpc21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NjM4MjAsImV4cCI6MjA5OTQzOTgyMH0.Avs2foEgcUFn-IP9KYOauus0RiS8ts0PfUxyEO2uwYI",

  EDGE_FUNCTION:
    import.meta.env.VITE_EDGE_FUNCTION ?? "generer-feuille-de-route",
}
