// BRJ EMPIRE - SUPABASE CONNECTION DIAGNOSTIC

const SUPABASE_URL = "https://yjnyeyvrnytbvcmzxolq.supabase.co";

const SUPABASE_KEY = "sb_publishable_GNZINkAOvLVp_6RIXEzenQ_3r5w5qHH";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

window.brjSupabase = window.supabaseClient;

window.checkBRJConnection = async function () {
    try {
        const response = await fetch(
            SUPABASE_URL + "/auth/v1/health",
            {
                headers: {
                    apikey: SUPABASE_KEY
                }
            }
        );

        console.log("BRJ HTTP STATUS:", response.status);
        console.log("BRJ RESPONSE:", await response.text());

    } catch (error) {
        console.error("BRJ CONNECTION ERROR:", error);
    }
};

console.log("BRJ CLIENT:", !!window.brjSupabase);
window.checkBRJConnection();
