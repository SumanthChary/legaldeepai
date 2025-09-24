
import { useEffect, useRef } from "react";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { LoadingMessage } from "./LoadingMessage";
import { Bot, User, Paperclip } from "lucide-react";

type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  fileUrl?: string;
  fileName?: string;
};

type MessageListProps = {
  messages: Message[];
  isLoading: boolean;
};

export const MessageList = ({ messages, isLoading }: MessageListProps) => {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 lg:px-8 py-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-6 sm:gap-8">
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                variant={message.sender === "user" ? "sent" : "received"}
                className={`flex items-start gap-4 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"} animate-in slide-in-from-bottom-2 duration-500`}
              >
                <ChatBubbleAvatar
                  className={`h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 ring-2 transition-all duration-300 ${
                    message.sender === "user" 
                      ? "ring-blue-200 bg-gradient-to-br from-blue-500 to-purple-600" 
                      : "ring-purple-200 bg-gradient-to-br from-purple-500 to-pink-500"
                  }`}
                  src={
                    message.sender === "user"
                      ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&crop=faces&fit=crop"
                      : "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=64&h=64&q=80&crop=faces&fit=crop"
                  }
                  fallback={message.sender === "user" ? "US" : "AI"}
                />
                <div className="flex flex-col min-w-0 max-w-[75%] sm:max-w-[80%]">
                  <ChatBubbleMessage
                    variant={message.sender === "user" ? "sent" : "received"}
                    className={`text-sm sm:text-base p-4 sm:p-5 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0"
                        : "bg-white border border-gray-100 text-gray-800 hover:border-purple-200"
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed break-words">
                      {message.content}
                    </div>
                    {message.fileName && (
                      <div className={`text-xs sm:text-sm mt-3 pt-3 border-t flex items-center gap-2 opacity-90 ${
                        message.sender === "user" 
                          ? "border-white/20 text-blue-100" 
                          : "border-gray-200 text-gray-600"
                      }`}>
                        <Paperclip className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate max-w-[200px] font-medium">{message.fileName}</span>
                      </div>
                    )}
                    <div className={`text-xs mt-3 opacity-70 font-medium ${
                      message.sender === "user" ? "text-right text-blue-100" : "text-left text-gray-500"
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </ChatBubbleMessage>
                </div>
              </ChatBubble>
            ))}
            
            {isLoading && (
              <ChatBubble variant="received" className="flex items-start gap-4 animate-in slide-in-from-bottom-2 duration-500">
                <ChatBubbleAvatar
                  className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 ring-2 ring-purple-200 bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse"
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=64&h=64&q=80&crop=faces&fit=crop"
                  fallback="AI"
                />
                <div className="max-w-[75%] sm:max-w-[80%]">
                  <ChatBubbleMessage isLoading className="text-sm sm:text-base p-4 sm:p-5 rounded-2xl shadow-lg bg-white border border-gray-100" />
                </div>
              </ChatBubble>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
