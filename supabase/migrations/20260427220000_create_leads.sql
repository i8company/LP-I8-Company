
-- Create the leads table to store contact form submissions
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    empresa TEXT,
    mensagem TEXT,
    solucoes TEXT, -- Stores comma-separated solutions or JSON
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert data (for the contact form)
-- In a production environment, you might want to add rate limiting or captcha checks via Supabase functions
CREATE POLICY "Allow public inserts" ON public.leads
    FOR INSERT 
    WITH CHECK (true);

-- Optional: Allow authenticated users (like yourself) to view the leads
CREATE POLICY "Allow authenticated users to select" ON public.leads
    FOR SELECT
    USING (auth.role() = 'authenticated');
