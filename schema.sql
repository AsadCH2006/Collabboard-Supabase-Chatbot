-- Create Credits tables
CREATE TABLE IF NOT EXISTS public.credits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  credits_count INT NOT NULL DEFAULT 100
);

CREATE TABLE IF NOT EXISTS public."Credits" (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  credits_count INT NOT NULL DEFAULT 100
);

-- Create Workspaces Table
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Columns Table
CREATE TABLE IF NOT EXISTS public.columns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  "position" INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Credits" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.columns ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow individual read/write credits" ON public.credits FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow individual read/write Credits_alt" ON public."Credits" FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow individual read/write workspaces" ON public.workspaces FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow individual read/write activity_logs" ON public.activity_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow access to columns" ON public.columns FOR ALL USING (true);