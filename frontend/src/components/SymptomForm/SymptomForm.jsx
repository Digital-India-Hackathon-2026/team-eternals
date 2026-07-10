import { useState, useRef, useEffect } from "react";
import {
  FaBrain,
  FaUser,
  FaHeartbeat,
  FaStethoscope,
  FaSpinner,
  FaUserMd,
  FaPaperPlane,
  FaCheckCircle,
} from "react-icons/fa";
import { symptomChat } from "../../lib/api";

function SymptomForm({ setReport }) {
  // Information states
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [severity, setSeverity] = useState(3);
  const [loading, setLoading] = useState(false);

  // Chat/Conversation states
  const [step, setStep] = useState("info"); // "info" or "chat"
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [chatInput, setChatInput] = useState("");
  
  const chatEndRef = useRef(null);

  const quickSymptoms = [
    "Chest Pain",
    "Fever",
    "Headache",
    "Difficulty Breathing",
    "Abdominal Pain",
    "Dizziness",
    "Vomiting",
    "Cough",
  ];

  const appendSymptom = (item) => {
    setSymptoms((current) => {
      if (!current.trim()) return item;
      return `${current.trim()}, ${item}`;
    });
  };

  // Auto scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleStartConsultation = async () => {
    if (!symptoms.trim()) {
      alert("Please describe your symptoms first.");
      return;
    }

    setLoading(true);
    setStep("chat");

    const initialMessages = [
      { role: "user", content: `Initial Symptoms: ${symptoms}` }
    ];
    setMessages(initialMessages);

    try {
      const data = await symptomChat({
        messages: initialMessages,
        age,
        gender,
        severity
      });

      if (data.status === "interviewing") {
        setCurrentQuestion(data.question);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.question }
        ]);
      } else {
        // Direct complete (e.g. emergency detected)
        setReport(data.report);
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to start consultation. Please try again.");
      setStep("info");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || loading) return;

    const userMessage = { role: "user", content: chatInput.trim() };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setChatInput("");
    setLoading(true);

    try {
      const data = await symptomChat({
        messages: nextMessages,
        age,
        gender,
        severity
      });

      if (data.status === "interviewing") {
        setCurrentQuestion(data.question);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.question }
        ]);
      } else {
        // Intake complete
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Thank you. I have gathered all required information and created your triage report." }
        ]);
        setTimeout(() => {
          setReport(data.report);
        }, 1200);
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="symptom-form"
      className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-6 shadow-2xl shadow-slate-200/80 backdrop-blur-xl sm:p-8 lg:p-10 min-h-[600px] flex flex-col justify-between"
    >
      <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-purple-200/40 blur-3xl"></div>
      <div className="absolute -bottom-24 left-8 h-56 w-56 rounded-full bg-indigo-200/40 blur-3xl"></div>

      <div className="relative flex-1 flex flex-col justify-between">
        
        {/* Top Header */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-purple-700 ring-1 ring-purple-100 animate-fade-in">
            <FaBrain />
            Qwen 2.5 7B Clinical Intake
          </span>

          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950">
            {step === "info" ? "AI Symptom Intake" : "Intake Interview"}
          </h2>

          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            {step === "info"
              ? "Share your basic details and symptoms. We'll ask a few follow-up questions to understand your condition perfectly."
              : "Please answer the doctor's follow-up questions to refine your clinical triage recommendation."}
          </p>
        </div>

        {/* STEP 1: Basic Information Input */}
        {step === "info" && (
          <div className="flex-1 flex flex-col justify-between space-y-6">
            
            {/* Patient Info */}
            <div className="rounded-3xl bg-slate-50/80 p-5 ring-1 ring-slate-100 sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                  <FaUser />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Patient Info</p>
                  <h3 className="text-lg font-extrabold text-slate-950">Demographics</h3>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Age</label>
                  <input
                    type="number"
                    placeholder="e.g. 45"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 font-semibold text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Symptoms Input */}
            <div className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/60 ring-1 ring-slate-100 sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 ring-1 ring-purple-100">
                  <FaStethoscope />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-purple-700">Clinical details</p>
                  <h3 className="text-lg font-extrabold text-slate-950">Primary Symptoms</h3>
                </div>
              </div>

              <textarea
                rows="4"
                placeholder="Example: I have sudden pain in my chest that spreads to my shoulder..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/80 p-4 font-semibold leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />

              <div className="mt-4 rounded-2xl bg-indigo-50/70 p-4 ring-1 ring-indigo-100">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-indigo-700">
                    <FaHeartbeat /> Severity
                  </label>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-indigo-700 shadow-sm">
                    {severity} / 5
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="mt-3 w-full accent-indigo-600"
                />
              </div>
            </div>

            {/* Quick Chips */}
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Quick Symptoms</p>
              <div className="flex flex-wrap gap-2">
                {quickSymptoms.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => appendSymptom(item)}
                    className="rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:-translate-y-0.5 hover:bg-purple-50 hover:text-purple-700 hover:ring-purple-100 transition"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartConsultation}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-6 py-4 text-base font-extrabold text-white shadow-xl shadow-indigo-200 transition hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Starting AI Intake...
                </>
              ) : (
                <>
                  <FaUserMd />
                  Start Consultation with Qwen
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 2: Conversational Chat Interface */}
        {step === "chat" && (
          <div className="flex-1 flex flex-col justify-between h-[450px]">
            
            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[360px] border border-slate-100 rounded-3xl p-4 bg-slate-50/50 mb-4 scrollbar-thin">
              {messages.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={index}
                    className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}
                  >
                    <div
                      className={`max-w-[85%] rounded-[1.25rem] px-4 py-3 text-sm font-semibold shadow-sm leading-relaxed ${
                        isUser
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white text-slate-800 ring-1 ring-slate-200 rounded-bl-none"
                      }`}
                    >
                      {!isUser && (
                        <p className="text-[10px] font-black text-purple-600 uppercase tracking-wide mb-1 flex items-center gap-1">
                          <FaBrain /> Qwen Triage AI
                        </p>
                      )}
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              
              {loading && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-white text-slate-500 rounded-[1.25rem] rounded-bl-none px-4 py-3 text-xs font-bold ring-1 ring-slate-200 flex items-center gap-2">
                    <FaSpinner className="animate-spin text-purple-600" />
                    Analyzing symptoms with Qwen 2.5 7B...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Field */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                id="chat-user-response"
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your response here..."
                disabled={loading}
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
              <button
                type="submit"
                id="btn-send-chat"
                disabled={loading || !chatInput.trim()}
                className="btn btn-primary px-4 py-3 rounded-2xl flex items-center justify-center disabled:opacity-60"
              >
                <FaPaperPlane size={14} />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

export default SymptomForm;
