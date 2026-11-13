
import { useState } from "react";
import { X, Send, Stethoscope } from "lucide-react";

export default function DoctorChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    // AI connection will be added in the next step.
    setMessage("");
  };

  return (
    <>
      {/* Floating Mini Doctor */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Doctor"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-cyan-100 to-blue-200 border-4 border-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform animate-[float_3s_ease-in-out_infinite]"
        >
          <div className="relative flex flex-col items-center">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#F5CBA7] flex items-center justify-center">
              <Stethoscope size={27} className="text-teal-700" />
            </div>
            <span className="absolute -bottom-3 text-[9px] font-bold text-teal-800">
              DOCTOR
            </span>
          </div>
          <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div
          className="
            fixed z-[9999]
            inset-0
            sm:inset-auto
            sm:bottom-6 sm:right-6
            w-full h-[100dvh]
            sm:w-[min(400px,calc(100vw-32px))]
            sm:h-[min(600px,calc(100dvh-48px))]
            bg-white dark:bg-gray-900
            sm:rounded-2xl
            shadow-2xl
            border-0 sm:border
            dark:border-gray-700
            flex flex-col
            overflow-hidden
          "
        >
          {/* Header */}
          <div className="bg-teal-700 text-white px-4 py-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-teal-700 flex items-center justify-center">
                <Stethoscope size={23} />
              </div>

              <div>
                <h3 className="font-bold text-base">
                  AI Doctor Assistant
                </h3>
                <p className="text-xs text-teal-100">
                  Here to help you
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
              className="p-2 rounded-full hover:bg-teal-600"
            >
              <X size={23} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4">
            <div className="max-w-[85%] bg-teal-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-3 rounded-2xl rounded-tl-none text-sm">
              Assalam-o-Alaikum! How can I help you today?
            </div>

            <p className="text-xs text-gray-500 mt-4">
              I provide general health information, not medical diagnosis.
            </p>
          </div>

          {/* Input Area */}
          <div className="shrink-0 p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Type your message..."
                className="flex-1 min-w-0 w-0 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-500"
              />

              <button
                onClick={handleSend}
                aria-label="Send message"
                className="w-11 h-11 shrink-0 rounded-full bg-teal-700 text-white flex items-center justify-center hover:bg-teal-800"
              >
                <Send size={19} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </>
  );
}
