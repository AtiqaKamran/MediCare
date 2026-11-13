
import { useState } from "react";
import { X, Send, Stethoscope } from "lucide-react";

export default function DoctorChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-[9999]">

      {/* Floating Mini Doctor */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Doctor Assistant"
          className="group relative flex flex-col items-center animate-[float_3s_ease-in-out_infinite] touch-manipulation"
        >
          {/* Hover Label */}
          <span className="mb-2 rounded-full bg-teal-700 text-white text-xs font-semibold px-3 py-1 shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            Ask your doctor!
          </span>

          {/* Doctor Avatar */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-cyan-100 to-blue-200 border-4 border-white shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">

            {/* Face */}
            <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#F5CBA7] flex items-center justify-center shadow-inner">

              {/* Hair */}
              <div className="absolute -top-1 w-9 h-4 sm:w-12 sm:h-5 bg-gray-800 rounded-t-full" />

              {/* Eyes */}
              <div className="flex gap-3 mt-1">
                <span className="w-1.5 h-1.5 bg-gray-800 rounded-full" />
                <span className="w-1.5 h-1.5 bg-gray-800 rounded-full" />
              </div>

              {/* Smile */}
              <div className="absolute top-7 sm:top-9 w-3 h-1.5 border-b-2 border-gray-700 rounded-full" />

              {/* Doctor Coat */}
              <div className="absolute -bottom-4 sm:-bottom-5 w-10 sm:w-12 h-5 sm:h-6 bg-white rounded-t-xl border border-gray-200 flex items-center justify-center">
                <Stethoscope size={14} className="text-teal-600" />
              </div>
            </div>

            {/* Online Indicator */}
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-green-500 border-2 border-white rounded-full" />
          </div>

          <span className="mt-2 text-[10px] sm:text-xs font-bold text-teal-700 dark:text-teal-300">
            AI Doctor
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[calc(100vw-24px)] sm:w-[380px] max-w-[380px] h-[min(520px,calc(100dvh-32px))] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border dark:border-gray-700 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="bg-teal-700 text-white p-3 sm:p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <Stethoscope size={24} />

              <div>
                <h3 className="font-bold text-sm sm:text-base">
                  AI Doctor Assistant
                </h3>

                <p className="text-xs">
                  Here to help you
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
              className="p-1 hover:bg-teal-600 rounded-lg"
            >
              <X size={22} />
            </button>
          </div>

          {/* Welcome Message */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 text-sm text-gray-700 dark:text-gray-200">

            <div className="bg-teal-50 dark:bg-gray-800 p-3 rounded-xl">
              Assalam-o-Alaikum! How can I help you today?
            </div>

            <p className="text-xs mt-3 text-gray-500">
              I provide general health information, not medical diagnosis.
            </p>
          </div>

          {/* Message Input */}
          <div className="p-3 border-t dark:border-gray-700 flex gap-2 shrink-0">

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 min-w-0 w-0 border rounded-full px-3 sm:px-4 py-2 text-sm outline-none dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />

            <button
              onClick={() => setMessage("")}
              aria-label="Send message"
              className="bg-teal-700 text-white p-3 rounded-full shrink-0 hover:bg-teal-800"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Animation */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>

    </div>
  );
}
