"use client";

import { useState, useEffect, useRef } from "react";

const ChatPanel = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, isUser: true }]);
      setIsLoading(true);

      const currentMessageIndex = messages.length; // Track the index for the AI response
      setMessages((prev) => [
        ...prev,
        { text: "", isUser: false }, // Placeholder for AI response
      ]);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_message: input }),
        });

        const reader = response.body?.getReader();
        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;
          const decoded = new TextDecoder("utf-8").decode(value);
          const lines = decoded
            .replaceAll(/^data: /gm, "")
            .split("\n")
            .filter((c) => c);

          for (let line of lines) {
            if (line !== "[DONE]") {
              try {
                const chunk = line;
                if (chunk) {
                  console.log('chunk', chunk);
                  setMessages((prev) => {
                    const updatedMessages = [...prev];
                    const length = chunk.length
                    if (updatedMessages[currentMessageIndex + 1].text.slice(-length) !== chunk) {
                      updatedMessages[currentMessageIndex + 1].text += chunk;
                      console.log('cur', updatedMessages[currentMessageIndex + 1].text)
                    }
                    return updatedMessages;
                  });
                }
              } catch (error) {
                console.error("Error parsing JSON line:", error, line);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }

      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="h-screen pb-20 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 p-2 rounded-lg max-w-[80%] ${message.isUser
              ? "ml-auto bg-blue-500 text-white"
              : "mr-auto bg-gray-200"
              }`}
          >
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 fixed bottom-0 ">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your sheet or formulas..."
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;
