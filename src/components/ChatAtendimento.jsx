import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { FaComments, FaTimes, FaPaperPlane } from "react-icons/fa";

const ChatAtendimento = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "system",
      text: "Chat de atendimento iniciado. Como posso ajudar?",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text: newMessage }]);
    setNewMessage("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "system",
          text: "Mensagem recebida. Um atendente responderá em breve.",
        },
      ]);
    }, 1000);
  };

  if (user?.role !== "atendente") return null;

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50"
        >
          <FaComments size={24} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
            3
          </span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border dark:border-gray-700 flex flex-col z-50">
          <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div>
              <h3 className="font-bold">Chat de Atendimento</h3>
              <p className="text-xs text-blue-100">UBS Central - Online</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 p-1 rounded"
            >
              <FaTimes />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl ${msg.from === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-sm"}`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={handleSend}
            className="p-4 border-t dark:border-gray-700 flex gap-2"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-full text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatAtendimento;
