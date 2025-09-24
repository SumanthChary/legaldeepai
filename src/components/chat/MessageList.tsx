
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
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 lg:px-8 py-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-4 sm:gap-6">
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                variant={message.sender === "user" ? "sent" : "received"}
                className={`flex items-start gap-3 sm:gap-4 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <ChatBubbleAvatar
                  className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
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
                    className="text-sm sm:text-base p-3 sm:p-4 rounded-2xl shadow-sm"
                  >
                    <div className="whitespace-pre-wrap leading-relaxed break-words">
                      {message.content}
                    </div>
                    {message.fileName && (
                      <div className={`text-xs sm:text-sm mt-3 pt-2 border-t border-current/10 flex items-center gap-2 opacity-80`}>
                        <Paperclip className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate max-w-[200px]">{message.fileName}</span>
                      </div>
                    )}
                    <div className={`text-xs mt-2 opacity-60 ${
                      message.sender === "user" ? "text-right" : "text-left"
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
              <ChatBubble variant="received" className="flex items-start gap-3 sm:gap-4">
                <ChatBubbleAvatar
                  className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=64&h=64&q=80&crop=faces&fit=crop"
                  fallback="AI"
                />
                <div className="max-w-[75%] sm:max-w-[80%]">
                  <ChatBubbleMessage isLoading className="text-sm sm:text-base p-3 sm:p-4 rounded-2xl shadow-sm" />
                </div>
              </ChatBubble>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
