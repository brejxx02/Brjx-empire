// ==========================================
// BRJ EMPIRE - SUPABASE CONNECTION
// ==========================================

const SUPABASE_URL = "https://yjnyeyvrnytbvcmzxolq.supabase.co";

const SUPABASE_KEY = "sb_publishable_GNZINkAOvLVp_6RIXEzenQ_3r5w5qHH";

// Initialize Supabase
window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// Legacy compatibility
window.brjSupabase = window.supabaseClient;

console.log("BRJ EMPIRE: Database initialized");
