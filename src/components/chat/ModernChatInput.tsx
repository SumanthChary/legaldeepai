
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
    <div className="flex-shrink-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-4xl mx-auto p-4 lg:px-8">
        <PromptInput
          value={input}
          onValueChange={setInput}
          isLoading={isLoading}
          onSubmit={onSend}
          className="w-full border rounded-2xl shadow-sm"
        >
          {file && (
            <div className="flex flex-wrap gap-2 pb-2 sm:pb-3">
              <div className="bg-blue-50 border border-blue-200 flex items-center gap-1.5 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm">
                <Paperclip className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                <span className="max-w-[120px] sm:max-w-[200px] truncate text-blue-800 font-medium">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onFileRemove}
                  className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600 hover:bg-blue-100 flex-shrink-0"
                >
                  <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
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
                className="h-9 w-9 rounded-full hover:bg-muted"
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
                className="h-9 w-9 rounded-full"
                onClick={onSend}
                disabled={isLoading || (!input.trim() && !file)}
              >
                <ArrowUp className="h-4 w-4" />
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
