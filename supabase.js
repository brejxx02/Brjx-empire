// ==========================================
// BRJ EMPIRE - SUPABASE DATABASE CONNECTION
// ==========================================

const SUPABASE_URL = "https://yjnyeyvrnytbvcmzxolq.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqbnlleXZybnl0YnZjbXp4b2xxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwNTIwMjIsImV4cCI6MjExMDYyODAyM30.O6HbUrCwUvdizQpiq5xJXqna4TcxzvVg7Sy6IrXH9UI";

// Create Supabase connection
window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY,
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        }
    }
);

// Connection status
window.databaseConnected = true;

console.log("BRJ EMPIRE: Supabase initialized successfully");
