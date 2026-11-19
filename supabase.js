// ===================================
// BRJ EMPIRE - SUPABASE CONFIGURATION
// ===================================

// Apne Supabase project ki details yahan dalein.

const SUPABASE_URL = "https://yjnyeyvrnytbvcmzxolq.supabase.co/rest/v1/";

const SUPABASE_ANON_KEY = "sb_publishable_GNZINkAOvLVp_6RIXEzenQ_3r5w5qHH";

// Supabase connection
if (
    SUPABASE_URL === "https://yjnyeyvrnytbvcmzxolq.supabase.co/rest/v1/" ||
    SUPABASE_ANON_KEY === "sb_publishable_GNZINkAOvLVp_6RIXEzenQ_3r5w5qHH"
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
