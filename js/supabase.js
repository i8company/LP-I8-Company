
// Supabase configuration
// Replace these with your actual Supabase Project URL and Anon Key
// You can find them in your Supabase Dashboard under Project Settings > API
const SUPABASE_URL = "https://jxyshhhxuubkgzixyqpg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4eXNoaGh4dXVia2d6aXh5cXBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNTE2NzAsImV4cCI6MjA5MTkyNzY3MH0.vGgE2XhJ0wTBcT5fv_KUzKoKOyoO-0WTdaCRODmRc6k";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.supabaseClient = supabaseClient;
