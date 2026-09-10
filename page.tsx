"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? "");
        
        // Fetch current credits from Supabase
        const { data } = await supabase
          .from("Credits")
          .select("credits_count")
          .eq("user_id", user.id)
          .single();

        if (data) {
          setCredits(data.credits_count);
        }
      }
    }
    loadUserData();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    if (credits !== null && credits <= 0) {
      alert("You have 0 credits remaining!");
      return;
    }

    const userText = input;
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: `Error: ${data.error}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: data.reply },
        ]);
        setCredits(data.remainingCredits);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong while connecting." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col h-screen">
      {/* Header bar showing status and credits */}
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <div>
          <h1 className="text-xl font-bold">Chatbot Interface</h1>
          <p className="text-sm text-gray-500">{userEmail}</p>
        </div>
        <div className="bg-slate-100 px-4 py-2 rounded-lg text-right">
          <span className="text-sm text-gray-600 block">Credits Available</span>
          <span className="text-xl font-bold text-indigo-600">
            {credits !== null ? credits : "Loading..."}
          </span>
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2 border rounded-lg">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-xs ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border p-2 rounded-lg"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading || credits === 0}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}