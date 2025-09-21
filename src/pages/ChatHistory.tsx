import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type ChatHistoryItem = {
  id: string;
  message_text: string;
  response_text: string;
  created_at: string;
};

const ChatHistory = () => {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState<ChatHistoryItem | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        throw error;
      }

      setChatHistory(data || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load chat history"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = chatHistory.filter(chat =>
    chat.message_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.response_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const continueChat = (chat: ChatHistoryItem) => {
    // Store the selected chat in sessionStorage to continue the conversation
    sessionStorage.setItem('continueChat', JSON.stringify({
      message: chat.message_text,
      response: chat.response_text,
      timestamp: chat.created_at
    }));
    navigate('/chat');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/10 p-4 lg:p-6">
        <div className="container mx-auto max-w-6xl">
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/10 p-2 sm:p-4 lg:p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-2rem)] sm:h-[calc(100vh-4rem)] lg:h-[calc(100vh-6rem)]">
          {/* History List */}
          <Card className="lg:w-1/2 flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Chat History
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/chat')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Chat
                </Button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search chat history..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-auto">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No chat history</h3>
                  <p className="text-muted-foreground mb-4">
                    Start a conversation to see your chat history here.
                  </p>
                  <Button onClick={() => navigate('/chat')}>
                    Start Chatting
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredHistory.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedChat?.id === chat.id ? 'bg-muted border-primary' : ''
                      }`}
                      onClick={() => setSelectedChat(chat)}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-medium text-sm line-clamp-2">
                          {chat.message_text}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(chat.created_at), 'MMM d')}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {chat.response_text}
                      </p>
                      <div className="flex justify-end mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            continueChat(chat);
                          }}
                        >
                          Continue Chat
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected Chat Detail */}
          <Card className="lg:w-1/2 flex flex-col">
            <CardHeader>
              <CardTitle>Chat Details</CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-auto">
              {selectedChat ? (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">You</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(selectedChat.created_at), 'MMM d, yyyy at h:mm a')}
                      </span>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="whitespace-pre-wrap">{selectedChat.message_text}</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">AI</span>
                      </div>
                      <span className="text-sm text-muted-foreground">AI Assistant</span>
                    </div>
                    <div className="bg-gray-50 border rounded-lg p-4">
                      <p className="whitespace-pre-wrap">{selectedChat.response_text}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={() => continueChat(selectedChat)}>
                      Continue This Conversation
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Select a chat from the history to view details
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;