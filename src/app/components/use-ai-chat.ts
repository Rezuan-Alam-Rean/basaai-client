import { useEffect, useRef, useState } from "react";
import { 
  useGetAiHistoryQuery, 
  useSecureChatMutation 
} from "../redux/features/ai/aiApi";
import type { ListingData } from "./listing-card";

export type ChatMessage = {
  id: number;
  from: "user" | "ai";
  text: string;
  time: string;
  listings?: ListingData[];
};

type ChatHistoryRow = {
  id: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
  content: string;
  createdAt: string;
  listings?: ListingData[];
};

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    from: "ai",
    text: "Hi! I'm BashaAI. Tell me your budget, location, and preferences, and I'll help you find rooms.",
    time: "",
  },
];

export function useAiChat(isAuthenticated: boolean) {
  const [chatInput, setChatInput] = useState("");
  const [listingPageByMsg, setListingPageByMsg] = useState<Record<number, number>>({});
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  useEffect(() => {
    // Set initial message time on mount to avoid hydration mismatch
    setMessages(prev => prev.map(m => 
      m.id === 1 && m.time === "" 
        ? { ...m, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
        : m
    ));
  }, []);
  const [isTyping, setIsTyping] = useState(false);
  const streamTimerRef = useRef<number | null>(null);

  const { data: historyData } = useGetAiHistoryQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [secureChat] = useSecureChatMutation();

  useEffect(() => {
    if (historyData?.messages && Array.isArray(historyData.messages)) {
      const history = historyData.messages as ChatHistoryRow[];
      if (history.length > 0) {
        const listingPages: Record<number, number> = {};
        const mapped: ChatMessage[] = history.map((row, index) => {
          const id = index + 1;
          const listings = Array.isArray(row.listings) ? row.listings : [];
          if (listings.length > 0) {
            listingPages[id] = 1;
          }

          return {
            id,
            from: row.role === "USER" ? "user" : "ai",
            text: row.content,
            time: new Date(row.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            listings,
          };
        });

        setMessages(mapped);
        setListingPageByMsg(listingPages);
      }
    }
  }, [historyData]);

  useEffect(() => () => {
    if (streamTimerRef.current !== null) {
      window.clearInterval(streamTimerRef.current);
    }
  }, []);

  const handleSend = async (text?: string) => {
    if (!isAuthenticated) return;
    const msg = (text ?? chatInput).trim();
    if (!msg) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      from: "user",
      text: msg,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    if (streamTimerRef.current !== null) {
      window.clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }

    try {
      const response = await secureChat({ message: msg }).unwrap();
      const replyText = response?.reply || "I couldn't generate a response. Please try again.";
      const listings = Array.isArray(response?.listings) ? response.listings : [];
      const aiMsgId = Date.now() + 1;
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        from: "ai",
        text: "",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        listings,
      };
      setMessages((prev) => [...prev, aiMsg]);
      if (listings.length > 0) {
        setListingPageByMsg((prev) => ({ ...prev, [aiMsgId]: 1 }));
      }

      const tokens = replyText.split(/(\s+)/).filter(Boolean);
      let index = 0;

      streamTimerRef.current = window.setInterval(() => {
        index += 1;
        setMessages((prev) =>
          prev.map((message) =>
            message.id === aiMsgId
              ? { ...message, text: tokens.slice(0, index).join("") }
              : message
          )
        );

        if (index >= tokens.length) {
          if (streamTimerRef.current !== null) {
            window.clearInterval(streamTimerRef.current);
            streamTimerRef.current = null;
          }
          setIsTyping(false);
        }
      }, 28);
    } catch (error: any) {
      if (streamTimerRef.current !== null) {
        window.clearInterval(streamTimerRef.current);
        streamTimerRef.current = null;
      }
      setIsTyping(false);
      if (error?.status === 401) {
        const aiMsg: ChatMessage = {
          id: Date.now() + 1,
          from: "ai",
          text: "Please log in to use BashaAI chat.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const aiMsg: ChatMessage = {
          id: Date.now() + 1,
          from: "ai",
          text: "Sorry, I couldn't reach the AI service right now. Please try again in a moment.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } finally {
      if (streamTimerRef.current === null) {
        setIsTyping(false);
      }
    }
  };

  return {
    chatInput,
    setChatInput,
    messages,
    setMessages,
    isTyping,
    listingPageByMsg,
    setListingPageByMsg,
    handleSend,
  };
}
