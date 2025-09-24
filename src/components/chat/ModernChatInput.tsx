
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { ArrowUp, Paperclip, X } from "lucide-react";

interface ModernChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  file?: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: () => void;
}

export const ModernChatInput = ({
  input,
  setInput,
  onSend,
  isLoading,
  file,
  onFileChange,
  onFileRemove,
}: ModernChatInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-shrink-0 border-t bg-gradient-to-r from-white/95 via-blue-50/50 to-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-lg">
      <div className="max-w-4xl mx-auto p-4 lg:px-8">
        <PromptInput
          value={input}
          onValueChange={setInput}
          isLoading={isLoading}
          onSubmit={onSend}
          className="w-full border border-gray-200/60 rounded-2xl shadow-xl bg-white/90 backdrop-blur hover:shadow-2xl transition-all duration-300"
        >
          {file && (
            <div className="flex flex-wrap gap-2 pb-3">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/60 flex items-center gap-2 rounded-xl px-3 py-2 text-sm shadow-sm">
                <Paperclip className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="max-w-[150px] sm:max-w-[200px] truncate text-blue-800 font-medium">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onFileRemove}
                  className="h-5 w-5 text-blue-600 hover:bg-blue-100 rounded-full flex-shrink-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          <PromptInputTextarea 
            placeholder="Ask about legal documents, contracts, compliance..." 
            className="text-sm sm:text-base leading-relaxed placeholder:text-muted-foreground min-h-[50px] sm:min-h-[60px] resize-none border-0 focus-visible:ring-0"
          />

          <PromptInputActions className="flex items-center justify-between gap-2 pt-2 sm:pt-3">
            <PromptInputAction tooltip="Attach files">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFileClick}
                className="h-9 w-9 rounded-full hover:bg-blue-50 text-blue-600 transition-all duration-200 hover:scale-105"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </PromptInputAction>

            <PromptInputAction
              tooltip={isLoading ? "AI is thinking..." : "Send message"}
            >
              <Button
                variant="default"
                size="icon"
                className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                onClick={onSend}
                disabled={isLoading || (!input.trim() && !file)}
              >
                <ArrowUp className="h-4 w-4 text-white" />
              </Button>
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>

        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.bmp,.webp"
          className="hidden"
        />
      </div>
    </div>
  );
};
