import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import chatbotAvatar from "../assets/chatbot.png";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hey there! I'm your personal shopping assistant. How can I help you today?"
    }
  ]);

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
      const errorMessage = error.response?.data?.message || "Error contacting assistant.";
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: errorMessage },
      ]);
    }

    setLoading(false);
  };

  // Sparkle component for the 'magic' feel
  const SparklesEffect = () => {
    const sparkles = Array.from({ length: 5 });
    return (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-20 pointer-events-none z-[60]">
        {sparkles.map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 1, scale: 0, x: 0, y: 10 }}
            animate={{
              opacity: 0,
              scale: [0, 1, 0],
              x: (Math.random() - 0.5) * 60,
              y: -Math.random() * 40 - 10
            }}
            transition={{ duration: 0.8, ease: "easeOut", delay: Math.random() * 0.2 }}
            className="absolute top-full left-1/2 w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: Math.random() > 0.5 ? '#7c3aed' : '#d97706', // Violet or Dark Gold
              boxShadow: `0 0 4px ${Math.random() > 0.5 ? '#7c3aed' : '#d97706'}`
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <AnimatePresence>
        {/* FLOATING AI BUTTON */}
        {!isOpen && (
          <motion.button
            key="chat-button"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleChat}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="fixed bottom-6 right-6 z-50 group pointer-events-auto"
          >
            {/* Pulsing outer glow */}
            <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-xl animate-pulse group-hover:bg-indigo-500/50 transition-colors duration-500" />

            {/* Main Container with Gradient */}
            <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 shadow-2xl shadow-indigo-500/40 transform transition-transform duration-300 group-hover:-translate-y-1">

              {/* Inner Glassy Container */}
              <div className="w-full h-full rounded-full bg-black/20 backdrop-blur-sm overflow-hidden border border-white/20 flex items-center justify-center p-1 relative">

                {/* Shiny reflection effect */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent opacity-50 z-10 pointer-events-none rounded-t-full" />

                <img
                  src={chatbotAvatar}
                  alt="Chatbot"
                  className="w-full h-full object-cover rounded-full bg-white/90 shadow-inner"
                />
              </div>

              {/* Online Status */}
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-[3px] border-white rounded-full shadow-md z-20">
                <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></span>
              </span>
            </div>
          </motion.button>
        )}

        {/* CHAT WINDOW */}
        {isOpen && (
          <div className="fixed bottom-6 right-6 z-50">
            <SparklesEffect />
            <motion.div
              key="chat-window"
              initial={{ opacity: 0, y: 100, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: 100, scale: 0.8, rotate: 10 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 300,
                mass: 0.8
              }}
              className="w-80 h-96 bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-neutral-200 relative"
            >
              <div className="p-3 bg-primary text-primary-foreground flex justify-between items-center bg-gradient-to-r from-primary to-primary/90">
                <span className="font-semibold flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/50 bg-white">
                    <img src={chatbotAvatar} alt="AI" className="w-full h-full object-cover" />
                  </div>
                  AI Assistant
                </span>
                <button onClick={toggleChat} className="hover:bg-primary-foreground/20 rounded-full p-1 transition-colors">✖</button>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-neutral-50/50">
                {messages.map((msg, idx) => {
                  if (msg.sender === "product") {
                    return (
                      <div
                        key={idx}
                        className="border p-2 rounded-lg bg-white shadow-sm ml-8"
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

                  if (msg.sender === "bot") {
                    return (
                      <div key={idx} className="flex gap-2 items-end">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1, y: [0, -8, 0] }}
                          transition={{
                            scale: { type: "spring", stiffness: 300, delay: 0.2 },
                            y: { duration: 0.4, ease: "easeInOut", delay: 0.2 }
                          }}
                          className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-indigo-100 border border-indigo-200 shadow-sm"
                        >
                          <img src={chatbotAvatar} alt="Bot" className="w-full h-full object-cover" />
                        </motion.div>
                        <div className="p-3 rounded-2xl rounded-tl-none text-sm bg-white border border-neutral-200 text-foreground shadow-sm">
                          {msg.text}
                          {/* Typing indicator inside recent bot msg if needed, but we have global loading */}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl text-sm w-fit max-w-[85%] bg-primary text-primary-foreground ml-auto rounded-tr-none shadow-sm"
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
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
