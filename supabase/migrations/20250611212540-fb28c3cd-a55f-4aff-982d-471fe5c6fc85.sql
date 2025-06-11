
-- Create table for tracking button clicks
CREATE TABLE IF NOT EXISTS public.click_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  click_counter TEXT NOT NULL CHECK (click_counter IN ('billetera', 'ventas', 'costos')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on click_tracking table
ALTER TABLE public.click_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for click_tracking
CREATE POLICY "Users can insert their own click tracking" 
  ON public.click_tracking 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Only admins should be able to view click tracking data
-- For now, we'll allow users to view their own data but this can be restricted later
CREATE POLICY "Users can view their own click tracking" 
  ON public.click_tracking 
  FOR SELECT 
  USING (auth.uid() = user_id);
