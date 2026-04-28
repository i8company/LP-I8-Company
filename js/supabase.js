
// Supabase configuration
// Replace these with your actual Supabase Project URL and Anon Key
// You can find them in your Supabase Dashboard under Project Settings > API
const SUPABASE_URL = "https://jxyshhhxuubkgzixyqpg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_sY4MIDDhRy5Poon3dHPMFg_lBJ0L5H6"; // <-- This looks like a placeholder, replace with your actual Anon Key

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.supabaseClient = supabaseClient;
