import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Sparkles } from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const bottomRef = useRef(null);

  const toggleChat = () => setIsOpen((prev) => !prev);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const text = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chatbot`,
        { message: text }
      );

      if (res.data.type === "search") {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: res.data.message },
        ]);

        res.data.products.forEach((product) => {
          setMessages((prev) => [
            ...prev,
            { sender: "product", product },
          ]);
        });
      }

      if (res.data.type === "chat") {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: res.data.reply },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error contacting assistant." },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* FLOATING AI BUTTON */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2
                     bg-primary text-primary-foreground
                     px-5 py-3.5 rounded-full font-medium
                     shadow-lg shadow-primary/25
                     hover:shadow-xl hover:shadow-primary/30
                     hover:scale-105 transition-all duration-300"
        >
          <Sparkles
            className={`w-5 h-5 ${isHovered ? "animate-pulse" : ""}`}
          />
          <span>Ask AI</span>

          {/* subtle ping */}
          <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-20 pointer-events-none" />
        </button>
      )}

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white shadow-xl rounded-lg flex flex-col z-50">
          <div className="p-3 bg-blue-600 text-white flex justify-between items-center rounded-t-lg">
            <span>AI Assistant</span>
            <button onClick={toggleChat}>✖</button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, idx) => {
              if (msg.sender === "product") {
                return (
                  <div
                    key={idx}
                    className="border p-2 rounded-lg bg-gray-100"
                  >
                    <img
                      src={msg.product.image}
                      alt={msg.product.title}
                      className="w-full h-24 object-cover rounded"
                    />
                    <div className="mt-2 font-semibold">
                      {msg.product.title}
                    </div>
                    <div className="text-sm text-gray-700">
                      ₹{msg.product.price}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className={`p-2 rounded-lg text-sm w-fit ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.text}
                </div>
              );
            })}

            {loading && (
              <div className="text-gray-500 text-sm">AI typing...</div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="p-3 flex gap-2 border-t">
            <input
              className="flex-1 border rounded p-2 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 rounded"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
