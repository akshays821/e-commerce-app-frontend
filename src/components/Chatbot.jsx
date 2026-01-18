import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
      <AnimatePresence>
        {/* FLOATING AI BUTTON */}
        {!isOpen && (
          <motion.button
            key="chat-button"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleChat}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2
                     bg-primary text-primary-foreground
                     px-5 py-3.5 rounded-full font-medium
                     shadow-lg shadow-primary/25
                     hover:shadow-xl hover:shadow-primary/30
                     transition-shadow duration-300"
          >
            <Sparkles
              className={`w-5 h-5 ${isHovered ? "animate-pulse" : ""}`}
            />
            <span>Ask AI</span>

            {/* subtle ping */}
            <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-20 pointer-events-none" />
          </motion.button>
        )}

        {/* CHAT WINDOW */}
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 w-80 h-96 bg-white shadow-xl rounded-2xl flex flex-col z-50 overflow-hidden border border-neutral-200"
          >
            <div className="p-3 bg-primary text-primary-foreground flex justify-between items-center bg-gradient-to-r from-primary to-primary/90">
              <span className="font-semibold flex items-center gap-2">
                <Sparkles size={16} />
                AI Assistant
              </span>
              <button onClick={toggleChat} className="hover:bg-primary-foreground/20 rounded-full p-1 transition-colors">✖</button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-neutral-50/50">
              {messages.map((msg, idx) => {
                if (msg.sender === "product") {
                  return (
                    <div
                      key={idx}
                      className="border p-2 rounded-lg bg-white shadow-sm"
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
                    className={`p-3 rounded-2xl text-sm w-fit max-w-[85%] ${msg.sender === "user"
                      ? "bg-primary text-primary-foreground ml-auto rounded-tr-none"
                      : "bg-white border border-neutral-200 text-foreground rounded-tl-none shadow-sm"
                      }`}
                  >
                    {msg.text}
                  </div>
                );
              })}

              {loading && (
                <div className="text-muted-foreground text-xs flex items-center gap-1 ml-2">
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            <div className="p-3 flex gap-2 border-t bg-white">
              <input
                className="flex-1 bg-neutral-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />
              <button
                onClick={sendMessage}
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-9 h-9 flex items-center justify-center rounded-full transition-colors"
              >
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
