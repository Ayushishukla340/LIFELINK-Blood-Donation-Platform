import { useState, useEffect, useRef } from "react";
import {
  FaComments,
  FaPaperPlane,
  FaPhoneAlt,
  FaHospital,
  FaTint,
  FaTimes,
  FaCheck,
  FaCheckDouble,
  FaUser,
  FaExclamationCircle,
} from "react-icons/fa";
import api from "../../services/api";

const QUICK_CHIPS = [
  "📍 Which hospital ward/room should I visit?",
  "⏰ What time should I arrive today?",
  "📋 Are the blood bank forms & slips ready?",
  "🚗 I'm on my way to the hospital now.",
  "🩸 I have arrived at the hospital blood bank.",
  "📞 Please call me when you are free.",
];

export default function ChatModal({ requestId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [requestInfo, setRequestInfo] = useState(null);
  const [otherParticipant, setOtherParticipant] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChat = async (isBackground = false) => {
    if (!requestId) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      if (!isBackground) setLoading(true);

      const response = await api.get(`/api/chat/${requestId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setMessages(response.data.messages || []);
        setRequestInfo(response.data.request || null);
        setOtherParticipant(response.data.otherParticipant || null);
        setCurrentUser(response.data.currentUser || null);
        setError("");
      }
    } catch (err) {
      console.error("Chat load error:", err);
      if (!isBackground) {
        setError(
          err.response?.data?.message ||
            "Unable to load chat. Only accepted blood requests can be discussed."
        );
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchChat(false);

    // Auto-refresh messages every 3.5 seconds while chat window is active
    const interval = setInterval(() => {
      fetchChat(true);
    }, 3500);

    return () => clearInterval(interval);
  }, [requestId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!text.trim() || sending) return;

    const messageText = text.trim();
    setText("");
    setSending(true);

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await api.post(
        `/api/chat/${requestId}/messages`,
        { text: messageText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setMessages((prev) => [...prev, response.data.message]);
        inputRef.current?.focus();
      }
    } catch (err) {
      console.error("Send message error:", err);
      setError(err.response?.data?.message || "Failed to send message");
      setText(messageText); // restore on failure
    } finally {
      setSending(false);
    }
  };

  const handleQuickChip = (chipText) => {
    setText(chipText);
    inputRef.current?.focus();
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative flex flex-col w-full max-w-2xl h-[90vh] max-h-[700px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-rose-200/90 dark:border-slate-800 overflow-hidden">
        
        {/* ===============================
            CHAT HEADER
        =============================== */}
        <div className="p-4 sm:p-5 border-b border-rose-100 dark:border-slate-800 bg-gradient-to-r from-rose-50/80 via-white to-rose-50/50 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 shrink-0">
          <div className="flex items-center justify-between gap-3">
            
            {/* Left: Avatar & Participant Details */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-md shadow-red-600/30">
                <FaUser className="text-base" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500"></span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm sm:text-base truncate">
                    {otherParticipant?.name || "Direct Chat"}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      otherParticipant?.role === "Blood Donor"
                        ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    }`}
                  >
                    {otherParticipant?.role || "Participant"}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                  <span className="flex items-center gap-1 font-semibold text-red-600 dark:text-red-400">
                    <FaTint className="text-[10px]" />
                    <span>{requestInfo?.bloodGroup || "Blood"} Required</span>
                  </span>
                  <span>•</span>
                  <span className="truncate flex items-center gap-1">
                    <FaHospital className="text-[10px]" />
                    <span>{requestInfo?.hospitalName || "Hospital Coordination"}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Phone Call Button & Close */}
            <div className="flex items-center gap-2 shrink-0">
              {otherParticipant?.phone && (
                <a
                  href={`tel:${otherParticipant.phone}`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 dark:text-emerald-300 text-xs font-bold transition border border-emerald-200 dark:border-emerald-800"
                  title="Direct Phone Call"
                >
                  <FaPhoneAlt className="text-xs" />
                  <span className="hidden sm:inline">Call</span>
                </a>
              )}

              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white transition cursor-pointer"
                aria-label="Close Chat"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </div>

        {/* ===============================
            EMERGENCY QUICK DISCUSSION CHIPS
        =============================== */}
        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-1.5 whitespace-nowrap text-[11px]">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mr-1">
              Quick:
            </span>
            {QUICK_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickChip(chip)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-red-400 hover:text-red-600 dark:hover:text-red-400 transition cursor-pointer shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* ===============================
            MESSAGES CONTAINER
        =============================== */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50 dark:bg-slate-950/60">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-9 h-9 border-3 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Opening secure coordination channel...
                </p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2.5">
              <FaExclamationCircle className="text-base shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Coordination Notice</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {!loading && messages.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 text-2xl mb-3 shadow-inner">
                <FaComments />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                Direct Coordination Chat Started
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                You can now message {otherParticipant?.name} directly to coordinate hospital room, timing, and blood donation formalities.
              </p>
            </div>
          )}

          {!loading &&
            messages.map((msg) => {
              const isMine =
                msg.senderId === currentUser?.id ||
                msg.senderId?.toString() === currentUser?.id?.toString();

              return (
                <div
                  key={msg._id}
                  className={`flex flex-col ${
                    isMine ? "items-end" : "items-start"
                  }`}
                >
                  {/* Sender Role / Name Header */}
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1 px-1">
                    {isMine ? "You" : `${msg.senderName} (${msg.senderRole})`}
                  </span>

                  {/* Message Bubble */}
                  <div
                    className={`relative max-w-[85%] sm:max-w-[75%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isMine
                        ? "bg-red-600 text-white rounded-br-none"
                        : "bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-800 rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                    {/* Time & Read Status */}
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                        isMine
                          ? "text-red-100"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      <span>{formatTime(msg.createdAt)}</span>
                      {isMine && (
                        <span>
                          {msg.isRead ? (
                            <FaCheckDouble className="text-[10px] text-emerald-200" />
                          ) : (
                            <FaCheck className="text-[9px]" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

          <div ref={messagesEndRef} />
        </div>

        {/* ===============================
            INPUT BAR
        =============================== */}
        <form
          onSubmit={handleSend}
          className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message (e.g. Ward 4, Bed 12...)"
            disabled={sending || loading}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm text-slate-800 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800 transition"
          />

          <button
            type="submit"
            disabled={!text.trim() || sending || loading}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-md shadow-red-600/25 transition cursor-pointer"
            aria-label="Send Message"
          >
            <FaPaperPlane className="text-xs" />
          </button>
        </form>
      </div>
    </div>
  );
}
