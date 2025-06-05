import React, { useRef, useEffect, useState } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { SendIcon, PaperclipIcon, SparklesIcon } from "lucide-react";
import { X, PlusIcon } from "lucide-react"
import ReactMarkdown from 'react-markdown';
import { addConversation, getConversations, Conversation } from "@/lib/conversationsRealtime";
import { addMessage, getMessages } from "@/lib/messagesRealtime";
// Create a new context for the side chat
const SideChatContext = React.createContext<{
  isOpen: boolean;
  toggle: () => void;
  sendMessage: (msg: string) => void;
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

type RTDBMessage = { id: string; sender: string; text: string; timestamp?: number };

// Module-level ref for sendMessage handler
let globalSendMessageHandlerRef: React.MutableRefObject<(msg: string) => void> | null = null;

declare global {
  interface Window {
    api?: {
      openExternal: (url: string) => void;
    };
  }
}

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

  // Expose sendMessage as a stable function that calls the global ref
  const sendMessage = React.useCallback((msg: string) => {
    if (globalSendMessageHandlerRef) {
      globalSendMessageHandlerRef.current(msg);
    }
  }, []);

  return (
    <SideChatContext.Provider value={{ isOpen, toggle, sendMessage }}>
      {children}
    </SideChatContext.Provider>
  );
}

// Add Integration type
export type Integration = {
  name: string;
  icon: string;
  connected: boolean;
  provider?: string;
};

export function SideChat() {
  const { isOpen, toggle } = useSideChat();
  const sendMessageHandlerRef = React.useRef<(msg: string) => void>(() => {});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [chatId, setChatId] = useState<string>("");
  const [recentChats, setRecentChats] = useState<Conversation[]>([]);
  const [isRecentLoading, setIsRecentLoading] = useState(false);

  // On mount, load chatId from localStorage if available
  useEffect(() => {
    const savedId = localStorage.getItem("currentChatId");
    if (savedId) {
      setChatId(savedId);
    }
  }, []);

  useEffect(() => {
    async function fetchMessages() {
      if (!chatId || chatId === "default") return;
      setIsFetching(true);
      try {
        const msgs = await getMessages(chatId);
        setMessages(
          (msgs as RTDBMessage[]).map((m) => ({ sender: m.sender, text: m.text }))
        );
      } catch (e) {
        console.error("Error fetching messages from RTDB:", e);
      } finally {
        setIsFetching(false);
      }
    }
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch recent chats on mount
  useEffect(() => {
    async function fetchRecentChats() {
      setIsRecentLoading(true);
      try {
        const conversations = await getConversations();
        // Sort by createdAt descending and take the most recent 5
        const sorted = conversations.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
        setRecentChats(sorted);
      } catch (e) {
        console.error("Error fetching recent chats:", e);
      } finally {
        setIsRecentLoading(false);
      }
    }
    fetchRecentChats();
  }, []);

  // Example data for suggested actions and recent chats
  const suggested = [
    { icon: <SparklesIcon className="w-4 h-4 text-primary" />, label: "List recent users" },
    { icon: <SparklesIcon className="w-4 h-4 text-primary" />, label: "Any failed payments?" },
    { icon: <SparklesIcon className="w-4 h-4 text-primary" />, label: "Check my tickets" },
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

  const handleToolUse = async (toolUse: ToolUse, messageHistory: Message[]): Promise<unknown | undefined> => {
    try {
      // Make API call to get tool results
      const userData = JSON.parse(localStorage.getItem("user") || "{}")
      const toolResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tool/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.data.access_token}`
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

      if (toolUse.name === "tool_finder") {
        // For tool_finder, return the tool result for use in tools array
        return toolResult.data;
      } else {
        // Default behavior for other tools: update history and return undefined
        const updatedHistory: Message[] = [
          ...messageHistory,
          { role: "assistant", content: JSON.stringify(toolUse) },
          { role: "user", content: JSON.stringify(toolResult.data) }
        ];
        // Call streamChatLoop recursively for this tool result
        await streamChatLoop("", updatedHistory);
        return undefined;
      }
    } catch (error) {
      console.error('Error executing tool:', error);
      setMessages(prev => [...prev, {
        sender: "assistant",
        text: "Sorry, there was an error executing the tool."
      }]);
      return undefined;
    }
  };
  const connectIntegration = async (provider: string) => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    const user_id = userData.data.id
    const URL = `${process.env.NEXT_PUBLIC_API_URL}/connect?_id=${user_id}&type=${provider}`;
    if (window.api?.openExternal) {
      window.api.openExternal(URL);
    } else {
      window.open(URL, "_blank");
    }
  };
  const streamChat = async (
    userMessage: string,
    existingHistory?: Message[],
    currentChatIdOverride?: string,
    tools: unknown[] = []
  ): Promise<null | { toolUse: ToolUse; messageHistory: Message[] }> => {
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
      const userData = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.data.access_token}`
        },
        body: JSON.stringify({
          messages: messageHistory,
          tools
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
      let toolUseToReturn: ToolUse | undefined = undefined;
      let toolUseMessageHistory: Message[] | undefined = undefined;
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

              // Store assistant response in RTDB
              if (currentText.trim()) {
                try {
                  await addMessage(currentChatIdOverride || chatId || localStorage.getItem("currentChatId") || "default", { sender: "assistant", text: currentText });
                } catch (err) {
                  console.error("Failed to save assistant message to RTDB", err);
                }
              }

              // Handle tool use if that's why the message stopped
              if (messageStop.message.stop_reason === 'tool_use') {
                const toolUse = messageStop.message.content.find(
                  content => content.type === 'tool_use'
                ) as ToolUse | undefined;

                if (toolUse) {
                  toolUseToReturn = toolUse;
                  toolUseMessageHistory = messageHistory;
                }
              }
            }
          } catch (e) {
            console.error('Error parsing chunk:', e);
          }
        }
      }
      if (toolUseToReturn && toolUseMessageHistory) {
        return { toolUse: toolUseToReturn, messageHistory: toolUseMessageHistory };
      }
      return null;
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
      return null;
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // New function to handle chained tool use
  const streamChatLoop = async (
    userMessage: string,
    existingHistory?: Message[],
    currentChatIdOverride?: string,
    tools: unknown[] = []
  ) => {
    let nextUserMessage = userMessage;
    let nextHistory = existingHistory;
    let nextTools = tools;
    let currentChatId = currentChatIdOverride;

    while (true) {
      const result = await streamChat(nextUserMessage, nextHistory, currentChatId, nextTools);
      if (result && result.toolUse) {
        const toolResult = await handleToolUse(result.toolUse, result.messageHistory);
        if (result.toolUse.name === "tool_finder" && toolResult !== undefined) {
          // For tool_finder, pass tool result as tools array
          nextUserMessage = "";
          nextHistory = result.messageHistory;
          nextTools = toolResult as unknown[] || [];
          // Continue loop
        } else {
          // For other tools, handleToolUse already called streamChatLoop recursively
          break;
        }
      } else {
        break;
      }
    }
  };

  // Helper to fetch auto title from API
  async function fetchAutoTitle(userMessage: string): Promise<string> {
    const TITLE_PROMPT = `Generate a concise, specific title (3-4 words max) that accurately captures the main topic or purpose of this conversation. Use key technical terms when relevant.
                      Avoid giving title regarding the finding tools for performing a task. Just pick the title based on the user's query.
                      Avoid generic words like 'conversation', 'chat', or 'help'.`;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/stream/title`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text" as const,
                  text: `${TITLE_PROMPT} \n\n  User message: ${userMessage} \n\n Format: Only output the title, no quotes or explanation"`,
                },
              ],
            },
          ]
        }),
      });
      if (!response.ok) throw new Error('Failed to fetch title');
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');
      let currentText = "";
      while (true) {
        const { done, value } = await reader.read();
        console.log("done", currentText);
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());
        console.log("lines", lines);
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.type === 'content_block_delta' && data.delta?.text) {
              currentText += data.delta.text;
              console.log("currentText", currentText);
            }
          } catch (e) {
            console.error('Error parsing chunk:', e);
          }
        }
      }
      return currentText.trim() || 'New Chat';
    } catch (e) {
      console.error('Auto title fetch failed:', e);
      return 'New Chat';
    }
  }

  // Remove manual prompt from handleNewChat
  async function handleNewChat() {
    console.log("handleNewChat called");
    setMessages([]);
    setInput("");
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsFetching(true);
    // Do not create conversation here; will be created on first message
    localStorage.removeItem("currentChatId");
    setChatId("");
  }

  async function handleSend(e?: React.FormEvent | React.KeyboardEvent, overrideInput?: string) {
    if (e) e.preventDefault();
    const trimmed = (overrideInput !== undefined ? overrideInput : input).trim();
    if (!trimmed || isLoading) return;

    const currentChatId = chatId || localStorage.getItem("currentChatId") || "";

    // If this is a new conversation (no chatId or no messages yet)
    if (!currentChatId || messages.length === 0) {
      setIsLoading(true);
      const autoTitle = await fetchAutoTitle(trimmed);
      const newId = await addConversation({ title: autoTitle });
      const newCurrentChatId = newId || "";
      setChatId(newCurrentChatId);
      if (newId) localStorage.setItem("currentChatId", newId);
      setIsLoading(false);
      // Only proceed if we have a real chatId
      if (!newCurrentChatId || newCurrentChatId === "default") return;
      setMessages(prev => {
        const updated = [...prev, { sender: "user", text: trimmed }];
        streamChatLoop(trimmed, prev.map(msg => ({
          role: msg.sender === "user" ? "user" : msg.sender === "assistant" ? "assistant" : "tool",
          content: msg.text
        })), newCurrentChatId);
        return updated;
      });
      setInput("");
      try {
        setIsFetching(false);
        await addMessage(newCurrentChatId, { sender: "user", text: trimmed });
      } catch (err) {
        console.error("Failed to save message to RTDB", err);
      }
      return;
    }

    // Only proceed if we have a real chatId
    if (!currentChatId || currentChatId === "default") return;

    setMessages(prev => {
      const updated = [...prev, { sender: "user", text: trimmed }];
      // Call streamChatLoop with the previous history (before adding the new message)
      streamChatLoop(trimmed, prev.map(msg => ({
        role: msg.sender === "user" ? "user" : msg.sender === "assistant" ? "assistant" : "tool",
        content: msg.text
      })), currentChatId);
      return updated;
    });
    setInput("");

    // Save to Realtime Database
    try {
      setIsFetching(false); // Ensure loading state is cleared after first message
      await addMessage(currentChatId, { sender: "user", text: trimmed });
    } catch (err) {
      console.error("Failed to save message to RTDB", err);
    }
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  }

  // Helper to format relative time
  function formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const min = 60 * 1000;
    const hour = 60 * min;
    const day = 24 * hour;
    const week = 7 * day;
    if (diff < min) return 'Just now';
    if (diff < hour) return `${Math.floor(diff / min)}m`;
    if (diff < day) return `${Math.floor(diff / hour)}h`;
    if (diff < 2 * day) return 'Yesterday';
    if (diff < week) return 'This week';
    return 'Last week';
  }

  // Ensure useEffect is always called at the top level
  React.useEffect(() => {
    globalSendMessageHandlerRef = sendMessageHandlerRef;
    sendMessageHandlerRef.current = (msg: string) => {
      handleSend(undefined, msg);
    };
    // Cleanup on unmount
    return () => {
      if (globalSendMessageHandlerRef === sendMessageHandlerRef) {
        globalSendMessageHandlerRef = null;
      }
    };
  }, [handleSend]);

  // Use conditional rendering in the return statement
  return !isOpen ? null : (
    <SidebarInset className="flex flex-col flex-1 bg-background border-l">
      {/* Header */}
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <h1 className="text-base font-medium">Chats</h1>
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
        {isFetching && chatId ? (
          <div className="flex justify-center items-center py-8">
            <span className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : messages.length === 0 && !isFetching ? null : (
          messages.map((msg, i) => (
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
          ))
        )}
        {/* Show empty state only after loading and if there are no messages */}
        {/* {!isFetching && messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">No messages yet. Start the conversation!</div>
        )} */}
        {/* Loader for assistant response */}
        {isLoading && !isFetching && (
          <div className="flex justify-center items-center py-4">
            <span className="inline-block w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
          </div>
        )}
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
                <Button
                  key={i}
                  variant="ghost"
                  className="justify-start gap-2 px-2 py-1 text-sm"
                  type="button"
                  onClick={async () => {
                    await handleSend(undefined, s.label);
                  }}
                >
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
              {isRecentLoading ? (
                <div className="text-muted-foreground text-xs py-2">Loading recent chats...</div>
              ) : recentChats.length === 0 ? (
                <div className="text-muted-foreground text-xs py-2">No recent chats</div>
              ) : (
                recentChats.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded px-2 py-1 hover:bg-accent cursor-pointer"
                    onClick={() => {
                      setChatId(r.id);
                      localStorage.setItem("currentChatId", r.id);
                      setInput("");
                      setIsFetching(true);
                    }}
                  >
                    <span className="truncate text-sm">{r.title}</span>
                    <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">{formatRelativeTime(r.createdAt)}</span>
                  </div>
                ))
              )}
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
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto text-xs"
                type="button"
                onClick={() => setShowIntegrations(true)}
              >
                + Add integrations
              </Button>
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
      {/* Integrations Modal */}
      <IntegrationsModal open={showIntegrations} onClose={() => setShowIntegrations(false)} connectIntegration={connectIntegration} />
    </SidebarInset>
  );
}

// Modal component for integrations
function IntegrationsModal({ open, onClose, connectIntegration }: { open: boolean, onClose: () => void, connectIntegration: (provider: string) => void }) {
  const [integrations, setIntegrations] = React.useState<Integration[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get-integrations`, {
      headers: {
        'Authorization': `Bearer ${userData.data.access_token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setIntegrations(data.data || []);
      })
      .catch(() => setIntegrations([]))
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-popover text-popover-foreground rounded-2xl shadow-2xl w-full max-w-lg p-0 relative flex flex-col border border-border max-h-[80vh] h-[500px]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-lg font-semibold text-foreground">Add integrations</h2>
          <button
            className="text-muted-foreground hover:text-foreground text-2xl font-bold"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {/* Search input */}
        <div className="px-6 pb-2">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
        </div>
        {/* Integrations list */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 min-h-0">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <span className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
            </div>
          ) : integrations.length === 0 ? (
            <div className="text-muted-foreground text-xs py-2">No integrations found</div>
          ) : (
            integrations.map((integration) => (
              <div key={integration.name} className="flex items-center bg-card rounded-lg border border-border mb-3 px-3 py-2 shadow-sm">
                <img src={integration.icon} alt={integration.name} className="w-7 h-7 rounded mr-3 object-contain" />
                <span className="flex-1 text-base font-medium text-foreground">{integration.name}</span>
                {integration.connected ? (
                  <button className="bg-muted text-foreground border border-border rounded px-2 py-0.5 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition min-h-0">Disconnect</button>
                ) : (
                  <button className="bg-primary text-primary-foreground rounded px-2 py-0.5 text-xs font-medium hover:bg-primary/90 transition min-h-0" onClick={() => {
                    if (integration.provider) {
                      connectIntegration(integration.provider);
                    }
                  }}>Connect</button>
                )}
              </div>
            ))
          )}
        </div>
        {/* Footer */}
        <div className="flex justify-end px-6 pb-4">
          <button
            className="bg-muted text-foreground border border-border rounded px-3 py-1 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition min-h-0"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 