// ===================================
// BRJ EMPIRE - SUPABASE CONFIGURATION
// ===================================

// Apne Supabase project ki details yahan dalein.

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";

const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

// Supabase connection
if (
    SUPABASE_URL === "YOUR_SUPABASE_PROJECT_URL" ||
    SUPABASE_ANON_KEY === "YOUR_SUPABASE_ANON_KEY"
) {
    console.warn("BRJ EMPIRE: Supabase credentials are not configured.");
} else {
    window.brjSupabase = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true
            }
        }
    );

    console.log("BRJ EMPIRE: Database client initialized.");
}
