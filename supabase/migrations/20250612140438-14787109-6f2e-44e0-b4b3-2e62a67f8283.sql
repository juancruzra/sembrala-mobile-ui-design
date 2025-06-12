
-- Create table for storing invitation codes used during registration
CREATE TABLE IF NOT EXISTS public.invitation_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invitation_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on invitation_codes table
ALTER TABLE public.invitation_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for invitation_codes
CREATE POLICY "Users can insert their own invitation codes" 
  ON public.invitation_codes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own invitation codes" 
  ON public.invitation_codes 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create index for better performance when querying by user_id
CREATE INDEX idx_invitation_codes_user_id ON public.invitation_codes(user_id);
