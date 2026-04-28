"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search, MoreVertical, Paperclip, Smile, Send, Sparkles, MapPin, X, ArrowLeft
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";

const conversations = [
  { id: 1, name: "Kamal Hossain", lastMsg: "Sure, you can visit tomorrow at 5pm", time: "2m", unread: 2, active: true },
  { id: 2, name: "Nasrin Akter", lastMsg: "The room is still available", time: "1h", unread: 0 },
  { id: 3, name: "Arif Hasan", lastMsg: "Price is negotiable for long term", time: "3h", unread: 1 },
  { id: 4, name: "Fatima Rahman", lastMsg: "I'll send more photos tonight", time: "5h", unread: 0 },
  { id: 5, name: "Sajid Ahmed", lastMsg: "Thanks for your interest!", time: "1d", unread: 0 },
];

const messages = [
  { id: 1, from: "rahim", text: "Assalamu Alaikum, I saw your listing for the bachelor seat in Mirpur-10. Is it still available?", time: "10:30 AM" },
  { id: 2, from: "kamal", text: "Walaikum Assalam! Yes, the seat is still available. Are you interested in visiting?", time: "10:32 AM" },
  { id: 3, from: "rahim", text: "Yes! I'm a student at BRAC University. Can you tell me more about the WiFi speed and if meals are included?", time: "10:35 AM" },
  { id: 4, from: "kamal", text: "WiFi is 20 Mbps, shared between 4 tenants. Meals are not included but there are many restaurants nearby. You can also use the shared kitchen.", time: "10:38 AM" },
  { id: 5, from: "ai", text: "", time: "" },
  { id: 6, from: "rahim", text: "That sounds good. Is the price negotiable? I was hoping to stay within 3,000 taka.", time: "10:42 AM" },
  { id: 7, from: "kamal", text: "The listed price is 3,500 but I can offer 3,200 if you commit to at least 6 months. That's the best I can do.", time: "10:45 AM" },
  { id: 8, from: "rahim", text: "3,200 for 6 months sounds fair. Can I visit tomorrow around 5 PM?", time: "10:47 AM" },
  { id: 9, from: "kamal", text: "Sure, you can visit tomorrow at 5pm. I'll be there. The address is House 42, Road 7, Block C, Mirpur-10.", time: "10:48 AM" },
  { id: 10, from: "rahim", text: "Thank you! I'll be there. See you tomorrow.", time: "10:50 AM" },
];

const quickReplies = [
  "Is the room still available?",
  "Can I visit tomorrow?",
  "What is included in the rent?",
];

export function MessagingPage() {
  const [selectedConvo, setSelectedConvo] = useState(1);
  const [msgInput, setMsgInput] = useState("");
  const [showConvoList, setShowConvoList] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const router = useRouter();

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
                {c.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">{c.name}</span>
                  <span className="text-[10px] text-muted-foreground shrink-0">{c.time}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{c.lastMsg}</p>
              </div>
              {c.unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center shrink-0">
                  {c.unread}
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
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">K</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Kamal Hossain</span>
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[10px] text-green-400">Online</span>
            </div>
            <p className="text-[10px] text-muted-foreground truncate">Re: Bachelor Seat — Mirpur-10</p>
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
            if (m.from === "ai") {
              return (
                <div key={m.id} className="max-w-[90%] md:max-w-[75%] mx-auto bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 rounded-lg p-3 ring-1 ring-blue-500/20">
                  <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 mb-2">
                    <Sparkles className="w-3 h-3" />
                    BashaAI Suggests
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Based on your conversation, here are 2 similar listings you might also like:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { title: "Bachelor Seat — Mohammadpur", price: "৳2,800", match: "91%" },
                      { title: "Single Room — Farmgate", price: "৳4,200", match: "87%" },
                    ].map((s) => (
                      <div key={s.title} className="bg-background/50 rounded-md p-2 border border-border/50">
                        <p className="text-xs font-medium">{s.title}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-bold text-primary">{s.price}/mo</span>
                          <Badge className="bg-blue-500/20 text-blue-400 text-[10px] px-1 py-0">AI {s.match}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            const isSent = m.from === "rahim";
            return (
              <div key={m.id} className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] md:max-w-[70%] ${
                  isSent
                    ? "bg-primary text-primary-foreground rounded-lg rounded-tr-none"
                    : "bg-muted rounded-lg rounded-tl-none"
                } px-3 py-2`}>
                  <p className={`text-[10px] mb-0.5 ${isSent ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {isSent ? "Rahim" : "Kamal"}
                  </p>
                  <p className="text-sm">{m.text}</p>
                  <p className={`text-[10px] mt-1 ${isSent ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
                    {m.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input bar */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-accent transition-colors">
              <Paperclip className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="p-2 rounded-full hover:bg-accent transition-colors">
              <Smile className="w-4 h-4 text-muted-foreground" />
            </button>
            <Input
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full bg-muted border-border"
            />
            <button className="w-9 h-9 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0">
              <Send className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel — Context */}
      <div className={`${showContext ? "flex" : "hidden"} lg:flex w-full lg:w-64 flex-col border-l border-border bg-background absolute lg:relative right-0 z-10 h-full`}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">About This Listing</h3>
          <button className="lg:hidden" onClick={() => setShowContext(false)}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Listing card */}
          <div className="bg-muted rounded-lg aspect-video flex items-center justify-center text-[10px] text-muted-foreground mb-2">
            Image
          </div>
          <div>
            <p className="text-sm font-medium">Bachelor Seat — Mirpur-10</p>
            <p className="text-xs font-bold text-primary mt-1">৳3,500/month</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <MapPin className="w-3 h-3" /> Mirpur-10, Dhaka
            </div>
            <Button variant="outline" size="sm" className="w-full mt-2 text-xs">View Listing</Button>
          </div>

          {/* Quick replies */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2">Quick Replies</h4>
            <div className="space-y-1.5">
              {quickReplies.map((q) => (
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

          {/* Seeker profile */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2">Seeker Profile</h4>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">R</div>
              <div>
                <p className="text-sm font-medium">Rahim Uddin</p>
                <Badge variant="secondary" className="text-[10px]">Verified Seeker</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}