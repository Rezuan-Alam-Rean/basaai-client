import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search, MoreVertical, Paperclip, Smile, Send, MapPin, X, ArrowLeft
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "../redux/hooks";
import { 
  useGetConversationsQuery, 
  useGetMessagesQuery, 
  useSendMessageMutation,
  useLazyGetConversationWithQuery
} from "../redux/features/chat/messagingApi";
import { useGetListingQuery } from "../redux/features/listing/listingApi";
import { getSocket } from "@/lib/socket";

type ConversationSummary = {
  id: string;
  otherUser: { id: string; name: string; avatarUrl?: string | null; role?: string | null };
  lastMessageText?: string | null;
  lastMessageAt?: string | null;
  lastSenderId?: string | null;
  unreadCount: number;
};

type MessageItem = {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  text: string;
  createdAt: string;
  attachments?: Array<{
    id: string;
    url: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    kind: "IMAGE" | "FILE";
  }>;
};

const defaultQuickReplies = [
  "Is the room still available?",
  "Can I visit tomorrow?",
  "What is included in the rent?",
];

const seekerQuickReplies = [
  "Is the room still available?",
  "Can I visit tomorrow?",
  "What is included in the rent?",
];

const listerQuickReplies = [
  "Yes it's available — when would you like to visit?",
  "I can share more photos, which part do you want to see?",
  "The rent includes utilities / or specify what's included",
];

function TypingDots({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      {label ? <span>{label}</span> : null}
      <span className="typing-dots">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </span>
    </span>
  );
}

export function MessagingPage() {
  const user = useAppSelector((state) => state.auth.user);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [msgInput, setMsgInput] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [typingByConversation, setTypingByConversation] = useState<Record<string, boolean>>({});
  const [presenceByUser, setPresenceByUser] = useState<Record<string, boolean>>({});
  const [showConvoList, setShowConvoList] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);
  const selectedConvoRef = useRef<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const pendingMessagesRef = useRef<Record<string, MessageItem[]>>({});
  const emojiList = ["😀", "😁", "😂", "🤣", "😊", "😍", "😘", "😎", "🤔", "😴", "😭", "😡", "👍", "🙏", "🎉", "❤️", "🔥", "✅", "📎", "🏠"];
  
  const listingId = searchParams.get("listingId");
  const { data: listingData } = useGetListingQuery(listingId || "", { skip: !listingId });
  const activeListing = listingData?.listing;

  const dynamicQuickReplies = useMemo(() => {
    if (user?.role === "LISTER") return listerQuickReplies;
    if (user?.role === "SEEKER") return seekerQuickReplies;
    return defaultQuickReplies;
  }, [user?.role]);

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConvo) || null,
    [conversations, selectedConvo]
  );

  const shortTime = (value?: string | null) => {
    if (!value) return "";
    const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  useEffect(() => {
    selectedConvoRef.current = selectedConvo;
  }, [selectedConvo]);

  const { data: conversationsData } = useGetConversationsQuery();
  const [getConversationWith] = useLazyGetConversationWithQuery();
  const [sendMessage] = useSendMessageMutation();

  useEffect(() => {
    if (conversationsData?.conversations) {
      setConversations(conversationsData.conversations);
      if (!selectedConvo && conversationsData.conversations.length > 0) {
        setSelectedConvo(conversationsData.conversations[0].id);
      }
    }
  }, [conversationsData]);

  useEffect(() => {
    if (!user?.id) return;
    const ownerId = searchParams.get("ownerId");
    if (!ownerId || ownerId === user.id) return;

    const ensure = async () => {
      try {
        const response = await getConversationWith(ownerId).unwrap();
        const conversation = response?.conversation;
        if (!conversation?.id) return;

        setConversations((prev) => {
          const exists = prev.some((c) => c.id === conversation.id);
          if (exists) {
             // If exists, just ensure it's at the top or updated if needed
             return prev;
          }
          const otherUser = conversation.otherUser || { id: ownerId, name: "User" };
          return [
            {
              id: conversation.id,
              otherUser,
              lastMessageText: conversation.lastMessageText,
              lastMessageAt: conversation.lastMessageAt,
              lastSenderId: conversation.lastSenderId,
              unreadCount: 0,
            },
            ...prev,
          ];
        });
        setSelectedConvo(conversation.id);
      } catch { /* Ignore */ }
    };
    ensure();
  }, [searchParams, user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = getSocket(token);
    socket.connect();
    socketRef.current = socket;

    socket.emit("presence:active", { isActive: true });

    socket.on("message:new", (payload) => {
      const conversation = payload?.conversation as {
        id: string;
        user1: { id: string; name: string; avatarUrl?: string | null };
        user2: { id: string; name: string; avatarUrl?: string | null };
        user1Id: string;
        user2Id: string;
        lastMessageText?: string | null;
        lastMessageAt?: string | null;
        lastSenderId?: string | null;
      } | undefined;
      const message = payload?.message as MessageItem | undefined;

      if (!conversation || !message) return;

      const otherUser = conversation.user1Id === user?.id
        ? conversation.user2
        : conversation.user1;

      setConversations((prev) => {
        const existing = prev.find((c) => c.id === conversation.id);
        const unreadDelta = message.recipientId === user?.id && selectedConvoRef.current !== conversation.id ? 1 : 0;
        
        // Prevent duplicate conversations in the list
        const updated = existing
          ? prev.map((c) =>
              c.id === conversation.id
                ? {
                    ...c,
                    otherUser,
                    lastMessageText: conversation.lastMessageText,
                    lastMessageAt: conversation.lastMessageAt,
                    lastSenderId: conversation.lastSenderId,
                    unreadCount: c.id === conversation.id ? c.unreadCount + unreadDelta : c.unreadCount,
                  }
                : c
            )
          : [
              {
                id: conversation.id,
                otherUser,
                lastMessageText: conversation.lastMessageText,
                lastMessageAt: conversation.lastMessageAt,
                lastSenderId: conversation.lastSenderId,
                unreadCount: unreadDelta,
              },
              ...prev,
            ];

        return [...updated].sort((a, b) =>
          new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime()
        );
      });

      // Store message in pending for this conversation
      if (!pendingMessagesRef.current[conversation.id]) {
        pendingMessagesRef.current[conversation.id] = [];
      }
      
      // Add message to pending if not already there
      if (!pendingMessagesRef.current[conversation.id].some(m => m.id === message.id)) {
        pendingMessagesRef.current[conversation.id].push(message);
      }

      // If this is the selected conversation, update messages immediately
      if (selectedConvoRef.current === conversation.id) {
        setMessages((prev) => {
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }

      setTypingByConversation((prev) => ({
        ...prev,
        [conversation.id]: false,
      }));
    });

    socket.on("typing", (payload) => {
      const conversationId = payload?.conversationId as string | undefined;
      const isTyping = Boolean(payload?.isTyping);
      if (!conversationId) return;
      setTypingByConversation((prev) => ({
        ...prev,
        [conversationId]: isTyping,
      }));
      if (conversationId !== selectedConvoRef.current) return;
      setIsOtherTyping(isTyping);
    });

    socket.on("presence", (payload) => {
      const userId = payload?.userId as string | undefined;
      const status = payload?.status as "online" | "offline" | undefined;
      if (!userId || !status) return;
      setPresenceByUser((prev) => ({
        ...prev,
        [userId]: status === "online",
      }));
    });

    return () => {
      socket.emit("presence:active", { isActive: false });
      socket.off("message:new");
      socket.off("typing");
      socket.off("presence");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.id]);

  useEffect(() => {
    document.body.classList.add("floating-chat-left");
    return () => document.body.classList.remove("floating-chat-left");
  }, []);

  useEffect(() => {
    document.body.classList.add("hide-floating-chat");
    return () => document.body.classList.remove("hide-floating-chat");
  }, []);

  const { data: messagesData, refetch: refetchMessages } = useGetMessagesQuery(selectedConvo || "", {
    skip: !selectedConvo || !user?.id,
  });

  useEffect(() => {
    if (messagesData?.messages) {
      // Merge API messages with any pending messages from socket
      const pendingForConvo = pendingMessagesRef.current[selectedConvo || ""] || [];
      const merged = [...messagesData.messages];
      
      // Add pending messages that aren't already in the API response
      for (const pending of pendingForConvo) {
        if (!merged.some(m => m.id === pending.id)) {
          merged.push(pending);
        }
      }
      
      // Sort by createdAt to maintain order
      merged.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
      setMessages(merged);
      setConversations((prev) =>
        prev.map((c) => (c.id === selectedConvo ? { ...c, unreadCount: 0 } : c))
      );
      
      // Clear pending messages for this conversation
      if (selectedConvo) {
        pendingMessagesRef.current[selectedConvo] = [];
      }
    }
  }, [messagesData, selectedConvo]);

  useEffect(() => {
    setIsOtherTyping(false);
    setTypingByConversation((prev) => ({
      ...prev,
      [selectedConvo || ""]: false,
    }));

    // Refetch messages when switching conversations to ensure fresh data
    if (selectedConvo) {
      refetchMessages();
    }
  }, [selectedConvo, refetchMessages]);

  // Revoke preview URLs for pending files when previews change (cleans up previous URLs)
  useEffect(() => {
    const current = pendingPreviews;
    return () => {
      current.forEach((u) => {
        try { URL.revokeObjectURL(u); } catch {}
      });
    };
  }, [pendingPreviews]);

  useEffect(() => {
    requestAnimationFrame(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }, [messages, isOtherTyping, selectedConvo]);

  useEffect(() => {
    if (!socketRef.current || !selectedConversation) return;

    const sendTyping = (isTyping: boolean) => {
      socketRef.current?.emit("typing", {
        conversationId: selectedConversation.id,
        recipientId: selectedConversation.otherUser.id,
        isTyping,
      });
    };

    if (msgInput.trim().length === 0) {
      sendTyping(false);
      if (typingTimeoutRef.current !== null) {
        window.clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      return;
    }

    sendTyping(true);
    if (typingTimeoutRef.current !== null) {
      window.clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = window.setTimeout(() => {
      sendTyping(false);
      typingTimeoutRef.current = null;
    }, 1500);
  }, [msgInput, selectedConversation]);

  const handleSend = async () => {
    const text = msgInput.trim();
    if (!selectedConversation) return;
    if (!text && pendingFiles.length === 0) return;
    const recipientId = selectedConversation.otherUser.id;

    socketRef.current?.emit("typing", {
      conversationId: selectedConversation.id,
      recipientId,
      isTyping: false,
    });

    if (pendingFiles.length > 0) {
      const payload = new FormData();
      payload.append("recipientId", recipientId);
      if (text) {
        payload.append("text", text);
      }
      pendingFiles.forEach((file) => payload.append("files", file));
      try {
        await sendMessage(payload).unwrap();
      } catch {
        // Ignore and let socket fall back on future sends.
      }
      // revoke previews
      pendingPreviews.forEach((u) => {
        try { URL.revokeObjectURL(u); } catch {}
      });
      setPendingFiles([]);
      setPendingPreviews([]);
      setMsgInput("");
      return;
    }

    if (socketRef.current) {
      socketRef.current.emit("message:send", { recipientId, text }, (ack: any) => {
        if (!ack?.ok) return;
      });
    } else {
      sendMessage({ recipientId, text }).unwrap().catch(() => undefined);
    }

    setMsgInput("");
    setIsOtherTyping(false);
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left Panel — Conversations */}
      <div className={`${showConvoList ? "flex" : "hidden"} md:flex w-full md:w-72 flex-col border-r border-border bg-background absolute md:relative z-10 h-full`}>
        <div className="p-3 border-b border-border space-y-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-9 bg-muted border-border text-sm" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => { setSelectedConvo(c.id); setShowConvoList(false); }}
              className={`w-full text-left p-3 flex items-start gap-3 border-b border-border/50 hover:bg-accent/50 transition-colors ${
                selectedConvo === c.id ? "bg-accent" : ""
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold shrink-0">
                {c.otherUser.avatarUrl ? (
                  <img src={c.otherUser.avatarUrl} alt={c.otherUser.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  c.otherUser.name[0]
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">{c.otherUser.name}</span>
                  <span className="text-[10px] text-muted-foreground shrink-0">{shortTime(c.lastMessageAt)}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {typingByConversation[c.id]
                    ? <TypingDots label="Typing" />
                    : (c.lastMessageText || "")}
                </p>
                <div className="text-[10px] text-muted-foreground">
                  {presenceByUser[c.otherUser.id] ? "Online" : "Offline"}
                </div>
              </div>
              {c.unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center shrink-0">
                  {c.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Center Panel — Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center gap-3 p-3 border-b border-border">
          <button className="md:hidden p-1" onClick={() => setShowConvoList(true)}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
            {selectedConversation?.otherUser.avatarUrl ? (
              <img
                src={selectedConversation.otherUser.avatarUrl}
                alt={selectedConversation.otherUser.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              selectedConversation?.otherUser.name?.[0] || "?"
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{selectedConversation?.otherUser.name || "Conversation"}</span>
              <span className={`w-2 h-2 rounded-full ${presenceByUser[selectedConversation?.otherUser.id || ""] ? "bg-green-500" : "bg-muted-foreground"}`} />
              <span className={`text-[10px] ${presenceByUser[selectedConversation?.otherUser.id || ""] ? "text-green-400" : "text-muted-foreground"}`}>
                {presenceByUser[selectedConversation?.otherUser.id || ""] ? "Online" : "Offline"}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground truncate">
              {selectedConversation?.lastMessageText ? `Re: ${selectedConversation.lastMessageText}` : "Re: Conversation"}
            </p>
          </div>
          <button className="p-1.5 rounded hover:bg-accent transition-colors lg:hidden" onClick={() => setShowContext(!showContext)}>
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 rounded hover:bg-accent transition-colors hidden lg:block">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m) => {
            const isSent = m.senderId === user?.id;
            return (
              <div key={m.id} className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] md:max-w-[70%] ${
                  isSent
                    ? "bg-primary text-primary-foreground rounded-lg rounded-tr-none"
                    : "bg-muted rounded-lg rounded-tl-none"
                } px-3 py-2`}>
                  <p className={`text-[10px] mb-0.5 ${isSent ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {isSent ? (user?.name || "Me") : (selectedConversation?.otherUser.name || "User")}
                  </p>
                  {m.text && <p className="text-sm">{m.text}</p>}
                  {m.attachments && m.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {m.attachments.map((att) => (
                        att.kind === "IMAGE" ? (
                          <img
                            key={att.id}
                            src={att.url}
                            alt={att.fileName}
                            className="max-w-[220px] rounded-md border border-border"
                          />
                        ) : (
                                  <a
                                    key={att.id}
                                    href={att.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block rounded-md border border-border px-3 py-2 text-xs text-foreground hover:bg-accent"
                                  >
                                    <span className="font-medium">{att.fileName}</span>
                                    <span className="ml-2 text-muted-foreground">({Math.ceil(att.fileSize / 1024)} KB)</span>
                                  </a>
                        )
                      ))}
                    </div>
                  )}
                  <p className={`text-[10px] mt-1 ${isSent ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })}
          {isOtherTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg rounded-tl-none px-3 py-2">
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input bar */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-full hover:bg-accent transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-accent transition-colors"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            >
              <Smile className="w-4 h-4 text-muted-foreground" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              onChange={(event) => {
                const files = Array.from(event.target.files || []);
                if (files.length > 0) {
                  const newPreviews = files.map((f) => {
                    try {
                      return URL.createObjectURL(f);
                    } catch {
                      return "";
                    }
                  });
                  setPendingFiles((prev) => [...prev, ...files]);
                  setPendingPreviews((prev) => [...prev, ...newPreviews]);
                }
                event.target.value = "";
              }}
            />
            <Input
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 rounded-full bg-muted border-border"
            />
            <button
              onClick={handleSend}
              className="w-9 h-9 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0"
            >
              <Send className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
          {showEmojiPicker && (
            <div className="mt-2 flex flex-wrap gap-1 rounded-lg border border-border bg-card p-2">
              {emojiList.map((emoji) => (
                <button
                  key={emoji}
                  className="text-lg hover:bg-accent rounded"
                  onClick={() => setMsgInput((prev) => prev + emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
          {pendingFiles.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {pendingFiles.map((file, index) => {
                const preview = pendingPreviews[index];
                const isImage = file.type?.startsWith("image/");
                return (
                  <div key={`${file.name}-${index}`} className="relative flex items-center gap-2 rounded-md border border-border px-2 py-1">
                    {isImage && preview ? (
                      <img src={preview} alt={file.name} className="w-16 h-10 object-cover rounded-sm" />
                    ) : (
                      <div className="text-[11px] text-muted-foreground">{file.name}</div>
                    )}
                    <button
                      onClick={() => {
                        // remove file and revoke preview
                        setPendingFiles((prev) => prev.filter((_, i) => i !== index));
                        setPendingPreviews((prev) => {
                          const url = prev[index];
                          if (url) URL.revokeObjectURL(url);
                          return prev.filter((_, i) => i !== index);
                        });
                      }}
                      className="ml-1 text-xs text-muted-foreground hover:text-destructive"
                      aria-label={`Remove ${file.name}`}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel — Context */}
      <div className={`${showContext ? "flex" : "hidden"} lg:flex w-full lg:w-64 flex-col border-l border-border bg-background absolute lg:relative right-0 z-10 h-full`}>
          <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">
            {(activeListing && selectedConversation?.otherUser.role === "LISTER") ? "About This Listing" : "About This User"}
          </h3>
          <button className="lg:hidden" onClick={() => setShowContext(false)}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Listing card */}
          {/* Listing details */}
          {activeListing ? (
            <>
              <div className="bg-muted rounded-lg aspect-video flex items-center justify-center overflow-hidden mb-2">
                {activeListing.images?.[0] ? (
                  <img src={activeListing.images[0]} alt={activeListing.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-muted-foreground">No Image</span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{activeListing.title}</p>
                <p className="text-xs font-bold text-primary mt-1">৳{activeListing.price.toLocaleString()}/month</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <MapPin className="w-3 h-3" /> {activeListing.location}
                </div>
                <Link href={`/listing/${activeListing.id}`}>
                  <Button variant="outline" size="sm" className="w-full mt-2 text-xs">View Listing</Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-xs text-muted-foreground italic">No listing context</p>
            </div>
          )}

          {/* Quick replies */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2">Quick Replies</h4>
            <div className="space-y-1.5">
              {dynamicQuickReplies.map((q) => (
                <button
                  key={q}
                  onClick={() => setMsgInput(q)}
                  className="w-full text-left text-xs px-3 py-2 rounded-md bg-muted hover:bg-accent transition-colors text-muted-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* User profile */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2">
              {selectedConversation?.otherUser.role === "LISTER" ? "Lister Profile" : "User Profile"}
            </h4>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold overflow-hidden">
                {selectedConversation?.otherUser.avatarUrl ? (
                  <img src={selectedConversation.otherUser.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  selectedConversation?.otherUser.name[0]
                )}
              </div>
              <div>
                <p className="text-sm font-medium truncate max-w-[120px]">{selectedConversation?.otherUser.name}</p>
                <Badge variant="secondary" className="text-[10px] uppercase">{selectedConversation?.otherUser.role || "User"}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .typing-dots {
          display: inline-flex;
          gap: 3px;
          align-items: center;
        }
        .typing-dot {
          width: 4px;
          height: 4px;
          border-radius: 9999px;
          background: currentColor;
          opacity: 0.6;
          animation: typingBounce 1.1s infinite ease-in-out;
        }
        .typing-dot:nth-child(2) {
          animation-delay: 0.15s;
        }
        .typing-dot:nth-child(3) {
          animation-delay: 0.3s;
        }
        @keyframes typingBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}
