import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { ModernChatInput } from "@/components/chat/ModernChatInput";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Plus, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  fileUrl?: string;
  fileName?: string;
};
const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: "welcome",
    content: "Hello! I'm your AI assistant. I can help you with legal questions, document analysis, general inquiries, and much more. How can I assist you today?",
    sender: "ai",
    timestamp: new Date()
  }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    const loadUser = async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (user) {
        const {
          data: profile
        } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setCurrentUser({
          ...user,
          profile
        });
      }
    };

    // Check if we should continue a chat from history
    const continueChat = sessionStorage.getItem('continueChat');
    if (continueChat) {
      try {
        const chatData = JSON.parse(continueChat);
        setMessages([{
          id: "welcome",
          content: "Hello! I'm your AI assistant. I can help you with legal questions, document analysis, general inquiries, and much more. How can I assist you today?",
          sender: "ai",
          timestamp: new Date()
        }, {
          id: "previous-user",
          content: chatData.message,
          sender: "user",
          timestamp: new Date(chatData.timestamp)
        }, {
          id: "previous-ai",
          content: chatData.response,
          sender: "ai",
          timestamp: new Date(chatData.timestamp)
        }]);
        sessionStorage.removeItem('continueChat');
      } catch (error) {
        console.error('Error parsing continue chat data:', error);
      }
    }
    loadUser();
  }, []);
  const handleSend = async () => {
    if (!input.trim() && !file) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
      fileName: file?.name
    };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Please sign in to use the AI chat");
      }
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const {
          data: uploadResult,
          error: uploadError
        } = await supabase.functions.invoke('analyze-document', {
          body: formData
        });
        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }
        toast({
          title: "File uploaded and analyzed",
          description: `${file.name} has been processed successfully.`
        });
        setFile(null);
      }
      const {
        data: chatResult,
        error: chatError
      } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: currentInput || `I just uploaded a file: ${file?.name}. Please analyze it and tell me about it.`,
          userId: user.id
        }
      });
      if (chatError) {
        throw new Error(`Chat failed: ${chatError.message}`);
      }
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: chatResult.response,
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I apologize, but I encountered an error: ${error.message}. Please try again or contact support if the issue persists.`,
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast({
        variant: "destructive",
        title: "Chat Error",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const startNewChat = () => {
    setMessages([{
      id: "welcome",
      content: "Hello! I'm your AI assistant. I can help you with legal questions, document analysis, general inquiries, and much more. How can I assist you today?",
      sender: "ai",
      timestamp: new Date()
    }]);
  };
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl h-screen flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between p-4 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">AI Assistant</h1>
                <p className="text-sm text-muted-foreground">Legal AI Chat & Document Analysis</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/chat-history')} 
                className="hidden sm:flex items-center gap-2"
              >
                <History className="h-4 w-4" />
                History
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={startNewChat} 
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <MessageList messages={messages} isLoading={isLoading} />
          <ModernChatInput 
            input={input} 
            setInput={setInput} 
            onSend={handleSend} 
            isLoading={isLoading} 
            file={file} 
            onFileChange={handleFileChange} 
            onFileRemove={removeFile} 
          />
        </div>
      </div>
    </div>
  );
};
export default ChatPage;