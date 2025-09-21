-- Create chat history table for storing AI chat conversations
CREATE TABLE public.chat_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  response_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- Create policies for chat history
CREATE POLICY "Users can view their own chat history" 
ON public.chat_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat history" 
ON public.chat_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat history" 
ON public.chat_history 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat history" 
ON public.chat_history 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_chat_history_updated_at
BEFORE UPDATE ON public.chat_history
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();