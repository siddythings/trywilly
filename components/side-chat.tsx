import React, { useRef, useEffect, useState } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { SendIcon, PaperclipIcon, SparklesIcon } from "lucide-react";
import { X, PlusIcon } from "lucide-react"
import ReactMarkdown from 'react-markdown';
// Create a new context for the side chat
const SideChatContext = React.createContext<{
  isOpen: boolean;
  toggle: () => void;
} | null>(null);

type ChatMessage = { 
  sender: string; 
  text: string;
  isStreaming?: boolean;
};

type Message = {
  role: "user" | "assistant" | "tool";
  content: string;
};

type ToolUse = {
  id: string;
  name: string;
  input: {
    query: string;
  };
  type: "tool_use";
};

type MessageContent = {
  citations: null;
  text: string;
  type: "text";
} | ToolUse;

type MessageStop = {
  type: "message_stop";
  message: {
    id: string;
    content: MessageContent[];
    model: string;
    role: string;
    stop_reason: string;
    stop_sequence: null;
    type: string;
    usage: {
      input_tokens: number;
      output_tokens: number;
    };
  };
};

export function useSideChat() {
  const context = React.useContext(SideChatContext);
  if (!context) {
    throw new Error("useSideChat must be used within a SideChatProvider");
  }
  return context;
}

export function SideChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(true);
  const toggle = React.useCallback(() => setIsOpen(prev => !prev), []);

  return (
    <SideChatContext.Provider value={{ isOpen, toggle }}>
      {children}
    </SideChatContext.Provider>
  );
}

export function SideChat() {
  const { isOpen, toggle } = useSideChat();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  // Example data for suggested actions and recent chats
  const suggested = [
    { icon: <SparklesIcon className="w-4 h-4 text-primary" />, label: "List recent users" },
    { icon: <SparklesIcon className="w-4 h-4 text-primary" />, label: "Any failed payments?" },
    { icon: <SparklesIcon className="w-4 h-4 text-primary" />, label: "Check my tickets" },
  ];
  const recent = [
    { title: "Read Last Email Aloud", time: "5h" },
    { title: "Daily workflow management agent", time: "1d" },
    { title: "Okay, I'm ready. Please provide the user query.", time: "1d" },
  ];

  // Find if there is any user message
  const hasUserMessage = messages.some(m => m.sender === "user");

  // Convert chat messages to API message format
  const getMessageHistory = (): Message[] => {
    return messages.map(msg => ({
      role: msg.sender === "user" ? "user" : msg.sender === "assistant" ? "assistant" : "tool",
      content: msg.text
    }));
  };

  const handleToolUse = async (toolUse: ToolUse, messageHistory: Message[]) => {
    try {
      // Make API call to get tool results
      const toolResponse = await fetch('http://localhost:8000/tool/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool_name: toolUse.name,
          input: toolUse.input
        })
      });

      if (!toolResponse.ok) {
        throw new Error('Tool execution failed');
      }

      const toolResult = await toolResponse.json();

      // Add tool result to message history with proper typing
      const updatedHistory: Message[] = [
        ...messageHistory,
        { role: "assistant", content: JSON.stringify(toolUse) },
        { role: "user", content: JSON.stringify(toolResult.data) }
      ];

      // Continue the conversation with the tool result
      await streamChat("", updatedHistory);
    } catch (error) {
      console.error('Error executing tool:', error);
      setMessages(prev => [...prev, { 
        sender: "assistant", 
        text: "Sorry, there was an error executing the tool." 
      }]);
    }
  };

  const streamChat = async (userMessage: string, existingHistory?: Message[]) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // Get the conversation history
    const messageHistory = existingHistory || getMessageHistory();
    // Add the new user message if provided
    if (userMessage) {
      messageHistory.push({ role: "user", content: userMessage });
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messageHistory,
          tools: [] // Add any tools if needed
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      // Add assistant message placeholder
      setMessages(prev => [...prev, { sender: "assistant", text: "", isStreaming: true }]);

      let currentText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.type === 'content_block_delta' && data.delta?.text) {
              currentText += data.delta.text;
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.sender === 'assistant') {
                  lastMessage.text = currentText;
                }
                return newMessages;
              });
            } else if (data.type === 'message_stop') {
              const messageStop = data as MessageStop;
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.sender === 'assistant') {
                  lastMessage.isStreaming = false;
                }
                return newMessages;
              });

              // Handle tool use if that's why the message stopped
              if (messageStop.message.stop_reason === 'tool_use') {
                const toolUse = messageStop.message.content.find(
                  content => content.type === 'tool_use'
                ) as ToolUse | undefined;

                if (toolUse) {
                  await handleToolUse(toolUse, messageHistory);
                }
              }
            }
          } catch (e) {
            console.error('Error parsing chunk:', e);
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Stream aborted');
      } else {
        console.error('Error:', error);
        setMessages(prev => [...prev, { 
          sender: "assistant", 
          text: "Sorry, there was an error processing your request." 
        }]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  async function handleSend(e?: React.FormEvent | React.KeyboardEvent) {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // Add user message to the chat
    setMessages(prev => [...prev, { sender: "user", text: trimmed }]);
    setInput("");
    
    // Stream the response with conversation history
    await streamChat(trimmed);
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  }

  function handleNewChat() {
    setMessages([]);
    setInput("");
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }

  return (
    <SidebarInset className="flex flex-col flex-1 bg-background border-l">
      {/* Header */}
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <h1 className="text-base font-medium">Documents</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" asChild size="sm" className="hidden sm:flex"></Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={handleNewChat}
          >
            <PlusIcon className="h-4 w-4" />
            <span className="sr-only">New Chat</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={toggle}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Toggle Side Chat</span>
          </Button>
        </div>
      </header>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.sender === "user"
                ? "flex justify-end"
                : "flex justify-start"
            }
          >
            <div
              className={
                "max-w-[75%] px-4 py-2 rounded-2xl text-sm " +
                (msg.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted border text-foreground rounded-bl-sm shadow-sm") +
                (msg.isStreaming ? " animate-pulse" : "")
              }
            >
              {msg.sender === "user" ? (
                msg.text
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown 
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded text-sm">{children}</code>,
                      pre: ({ children }) => <pre className="bg-muted p-2 rounded-lg mb-2 overflow-x-auto">{children}</pre>,
                    }}
                  >
                    {msg.text || (msg.isStreaming ? "..." : "")}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested actions and Recent chats: only show if no user message */}
      {!hasUserMessage && (
        <>
          {/* Suggested actions */}
          <div className="px-4 pt-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">Suggested</div>
            <div className="flex flex-col gap-2 mb-4">
              {suggested.map((s, i) => (
                <Button key={i} variant="ghost" className="justify-start gap-2 px-2 py-1 text-sm">
                  {s.icon}
                  {s.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Recent chats */}
          <div className="px-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">Recent chats</div>
            <div className="flex flex-col gap-1 mb-2">
              {recent.map((r, i) => (
                <div key={i} className="flex items-center justify-between rounded px-2 py-1 hover:bg-accent cursor-pointer">
                  <span className="truncate text-sm">{r.title}</span>
                  <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">{r.time}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Input area */}
      <form className="sticky bottom-0 left-0 w-full border-t px-4 pt-3 pb-2 z-10" onSubmit={handleSend}>
        <div className="rounded-xl border shadow bg-background p-4 flex flex-col gap-2">
          {/* Input */}
          <textarea
            rows={1}
            placeholder="Type @ to mention anything"
            className="w-full resize-none border-0 bg-transparent focus:outline-none focus:ring-0 focus:border-transparent text-base placeholder:text-muted-foreground p-0 mb-1"
            style={{ minHeight: '28px', maxHeight: '80px' }}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            disabled={isLoading}
          />
          {/* Checkbox */}
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none mb-1">
            <input type="checkbox" className="form-checkbox rounded border-muted-foreground" defaultChecked />
            Include current document
          </label>
          {/* Bottom row: icons left, send right */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Button variant="ghost" size="icon" type="button" className="size-6 p-0">
                <PaperclipIcon className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" type="button" className="size-6 p-0">
                @
              </Button>
              <Button variant="ghost" size="icon" type="button" className="size-6 p-0">
                <SparklesIcon className="w-4 h-4" />
              </Button>
              <Button variant="link" size="sm" className="p-0 h-auto text-xs">+ Add integrations</Button>
            </div>
            <Button 
              type="submit" 
              size="icon" 
              variant="ghost"
              className="size-7 p-0 bg-black text-white"
              disabled={isLoading || !input.trim()}
            >
              <SendIcon className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      </form>
    </SidebarInset>
  );
} 