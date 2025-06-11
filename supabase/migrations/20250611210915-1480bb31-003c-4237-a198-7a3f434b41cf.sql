
-- Create table for report requests
CREATE TABLE IF NOT EXISTS public.report_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  number_of_crops INTEGER NOT NULL CHECK (number_of_crops IN (1, 2, 3)),
  cost NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on report_requests table
ALTER TABLE public.report_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for report_requests
CREATE POLICY "Users can view their own report requests" 
  ON public.report_requests 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own report requests" 
  ON public.report_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own report requests" 
  ON public.report_requests 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_report_requests_updated_at
  BEFORE UPDATE ON public.report_requests
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
