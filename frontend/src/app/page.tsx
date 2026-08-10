"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageSquare, CheckSquare, Activity, Mic, Square, Sparkles, CheckCircle2, Circle, Flame, Code, BookOpen, HeartPulse, Layers, Clock, Cpu, Database, GitBranch, ShieldCheck, BarChart3, PieChart as PieIcon, TrendingUp, ScatterChart as ScatterIcon, Calculator } from "lucide-react";

// Performance Dataset for Statistics & Graphs
const performanceData = [
  { day: "Mon", studyHours: 2, score: 65, tasksCompleted: 4 },
  { day: "Tue", studyHours: 4, score: 78, tasksCompleted: 7 },
  { day: "Wed", studyHours: 3, score: 72, tasksCompleted: 5 },
  { day: "Thu", studyHours: 5, score: 88, tasksCompleted: 9 },
  { day: "Fri", studyHours: 6, score: 95, tasksCompleted: 11 },
  { day: "Sat", studyHours: 4, score: 82, tasksCompleted: 6 },
  { day: "Sun", studyHours: 5, score: 90, tasksCompleted: 8 },
];

const categoryDistribution = [
  { name: "Coding", value: 40, color: "#06b6d4" },
  { name: "Study", value: 30, color: "#a855f7" },
  { name: "Health", value: 15, color: "#10b981" },
  { name: "General", value: 15, color: "#3b82f6" },
];

// Pure SVG Analytics Component (Zero Dependencies Required)
function StatsDashboard() {
  const [activeTab, setActiveTab] = useState<"bar" | "line" | "pie" | "scatter">("bar");

  // Core Statistics Calculations
  const scores = performanceData.map(d => d.score);
  const meanScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  const sortedScores = [...scores].sort((a, b) => a - b);
  const medianScore = sortedScores[Math.floor(sortedScores.length / 2)];
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const range = maxScore - minScore;

  return (
    <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col h-full text-slate-100">
      
      {/* Header & View Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2 text-cyan-400 uppercase tracking-wider">
            <BarChart3 size={20} /> Analytics & Statistical Core
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Real-time telemetry, descriptive statistics, and multi-format visualizations.</p>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/10">
          <button onClick={() => setActiveTab("bar")} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${activeTab === 'bar' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'text-slate-400 hover:text-white'}`}>
            <BarChart3 size={14} /> Bar Graph
          </button>
          <button onClick={() => setActiveTab("line")} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${activeTab === 'line' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : 'text-slate-400 hover:text-white'}`}>
            <TrendingUp size={14} /> Line Graph
          </button>
          <button onClick={() => setActiveTab("pie")} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${activeTab === 'pie' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-400 hover:text-white'}`}>
            <PieIcon size={14} /> Pie Chart
          </button>
          <button onClick={() => setActiveTab("scatter")} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${activeTab === 'scatter' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:text-white'}`}>
            <ScatterIcon size={14} /> Scatter Plot
          </button>
        </div>
      </div>

      {/* Statistical Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 border border-white/10 p-3.5 rounded-2xl backdrop-blur-md">
          <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1"><Calculator size={12} className="text-cyan-400"/> Mean Value</span>
          <p className="text-xl font-black text-cyan-300 mt-1">{meanScore}</p>
        </div>
        <div className="bg-slate-800/50 border border-white/10 p-3.5 rounded-2xl backdrop-blur-md">
          <span className="text-[10px] font-mono uppercase text-slate-400">Median Score</span>
          <p className="text-xl font-black text-purple-300 mt-1">{medianScore}</p>
        </div>
        <div className="bg-slate-800/50 border border-white/10 p-3.5 rounded-2xl backdrop-blur-md">
          <span className="text-[10px] font-mono uppercase text-slate-400">Data Spread (Range)</span>
          <p className="text-xl font-black text-emerald-300 mt-1">{range} <span className="text-xs font-normal text-slate-400">({minScore}-{maxScore})</span></p>
        </div>
        <div className="bg-slate-800/50 border border-white/10 p-3.5 rounded-2xl backdrop-blur-md">
          <span className="text-[10px] font-mono uppercase text-slate-400">Probability Metric</span>
          <p className="text-xl font-black text-blue-300 mt-1">88.5%</p>
        </div>
      </div>

      {/* Custom SVG Render Container */}
      <div className="flex-1 min-h-[280px] w-full bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
        
        {/* BAR GRAPH VIEW */}
        {activeTab === "bar" && (
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-end justify-between h-48 gap-4 px-2 pt-6">
              {performanceData.map((d, i) => {
                const heightPercent = (d.tasksCompleted / 12) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">{d.tasksCompleted}</span>
                    <motion.div initial={{ height: 0 }} animate={{ height: `${heightPercent}%` }} transition={{ duration: 0.6, delay: i * 0.05 }}
                      className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-xl shadow-[0_0_15px_rgba(6,182,212,0.4)]" />
                    <span className="text-xs font-mono text-slate-400">{d.day}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-center text-[11px] font-mono text-slate-500 mt-2">Metric: Tasks Completed per Day (Bar Graph)</p>
          </div>
        )}

        {/* LINE GRAPH VIEW */}
        {activeTab === "line" && (
          <div className="flex flex-col h-full justify-between">
            <div className="relative h-48 w-full flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200">
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Background gridlines */}
                <line x1="0" y1="40" x2="700" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                <line x1="0" y1="100" x2="700" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                <line x1="0" y1="160" x2="700" y2="160" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                
                {/* Area fill */}
                <path d="M 50 140 Q 150 60, 250 90 T 450 40 T 650 20 L 650 180 L 50 180 Z" fill="url(#lineGrad)" />
                {/* Line path */}
                <path d="M 50 140 Q 150 60, 250 90 T 450 40 T 650 20" fill="none" stroke="#a855f7" strokeWidth="3" />
                
                {/* Data points */}
                {[
                  { cx: 50, cy: 140, day: "Mon", score: 65 },
                  { cx: 150, cy: 95, day: "Tue", score: 78 },
                  { cx: 250, cy: 90, day: "Wed", score: 72 },
                  { cx: 350, cy: 60, day: "Thu", score: 88 },
                  { cx: 450, cy: 40, day: "Fri", score: 95 },
                  { cx: 550, cy: 75, day: "Sat", score: 82 },
                  { cx: 650, cy: 50, day: "Sun", score: 90 },
                ].map((pt, idx) => (
                  <g key={idx} className="cursor-pointer group">
                    <circle cx={pt.cx} cy={pt.cy} r="6" fill="#a855f7" className="transition-all group-hover:scale-125" />
                    <circle cx={pt.cx} cy={pt.cy} r="10" fill="none" stroke="#a855f7" strokeOpacity="0.4" />
                  </g>
                ))}
              </svg>
            </div>
            <div className="flex justify-between px-4 text-xs font-mono text-slate-400 mt-2">
              {performanceData.map((d, i) => <span key={i}>{d.day}</span>)}
            </div>
          </div>
        )}

        {/* PIE CHART VIEW */}
        {activeTab === "pie" && (
          <div className="flex flex-col md:flex-row items-center justify-center h-full gap-8">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#06b6d4" strokeWidth="20" strokeDasharray="100.5 251.2" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#a855f7" strokeWidth="20" strokeDasharray="75.4 251.2" strokeDashoffset="-100.5" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="20" strokeDasharray="37.7 251.2" strokeDashoffset="-175.9" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="20" strokeDasharray="37.7 251.2" strokeDashoffset="-213.6" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-mono uppercase text-slate-400">Total</span>
                <span className="text-lg font-black text-white">100%</span>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              {categoryDistribution.map((cat, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs font-medium text-slate-300">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span>{cat.name}</span>
                  <span className="font-mono text-slate-400 ml-auto">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCATTER PLOT VIEW */}
        {activeTab === "scatter" && (
          <div className="flex flex-col h-full justify-between">
            <div className="relative h-48 w-full border-b border-l border-white/10 p-2">
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
                <div className="border-r border-b border-white/5" /><div className="border-r border-b border-white/5" /><div className="border-r border-b border-white/5" /><div className="border-b border-white/5" />
                <div className="border-r border-b border-white/5" /><div className="border-r border-b border-white/5" /><div className="border-r border-b border-white/5" /><div className="border-b border-white/5" />
                <div className="border-r border-b border-white/5" /><div className="border-r border-b border-white/5" /><div className="border-r border-b border-white/5" /><div className="border-b border-white/5" />
              </div>
              {performanceData.map((d, i) => {
                const left = (d.studyHours / 7) * 90 + 5;
                const bottom = ((d.score - 60) / 40) * 85 + 5;
                return (
                  <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }}
                    className="absolute w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white shadow-[0_0_10px_rgba(59,130,246,0.8)] cursor-pointer group"
                    style={{ left: `${left}%`, bottom: `${bottom}%` }}>
                    <span className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/20 text-[10px] font-mono text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {d.day}: {d.studyHours}h study, {d.score} score
                    </span>
                  </motion.div>
                );
              })}
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2 px-1">
              <span>X: Study Hours (2h - 6h)</span>
              <span>Y: Score Matrix (65 - 95)</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Main Home Component
export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [activeTab, setActiveTab] = useState<"copilot" | "stats">("copilot");
  
  const [reasoningNodes, setReasoningNodes] = useState<any[]>([
    { id: "intent", label: "Intent & Sentiment", status: "idle", detail: "Awaiting directive" },
    { id: "rag", label: "Qdrant Vector Memory", status: "idle", detail: "Standby" },
    { id: "dag", label: "Multi-Agent DAG", status: "idle", detail: "Standby" },
    { id: "db", label: "PostgreSQL Sync", status: "idle", detail: "Standby" }
  ]);
  
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const API_BASE = "http://localhost:8000/api/v1";

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory, isThinking]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      const data = await res.json();
      setTasks(data.filter((t: any) => !t.done));
    } catch (error) { console.error(error); }
  };

  const completeTask = async (id: number, text: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    await fetch(`${API_BASE}/tasks/${id}/complete`, { method: "PUT" });
    
    setIsThinking(true);
    setReasoningNodes([
      { id: "intent", label: "Intent & Sentiment", status: "completed", detail: "Completion logged" },
      { id: "rag", label: "Qdrant Vector Memory", status: "completed", detail: "Behavioral delta embedded" },
      { id: "dag", label: "Multi-Agent DAG", status: "completed", detail: "Reinforcement triggered" },
      { id: "db", label: "PostgreSQL Sync", status: "completed", detail: "Archived success" }
    ]);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `[SYSTEM NOTIFICATION] I just completed the task: "${text}".` }),
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { role: "assistant", content: data.reply }]);
      if (data.telemetry) setReasoningNodes(data.telemetry);
    } catch (error) { console.error(error); }
    setIsThinking(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.onstop = async () => {
        setIsThinking(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "voice.webm");

        try {
          const res = await fetch(`${API_BASE}/audio`, { method: "POST", body: formData });
          const data = await res.json();
          if (data.transcribed) setChatHistory(prev => [...prev, { role: "user", content: `🎤 ${data.transcribed}` }]);
          setChatHistory(prev => [...prev, { role: "assistant", content: data.reply }]);
          if (data.telemetry) setReasoningNodes(data.telemetry);
          fetchTasks();
        } catch (error) { console.error(error); }
        setIsThinking(false);
        stream.getTracks().forEach(track => track.stop());
      };
      recorder.start();
      setIsRecording(true);
    } catch (err) { alert("Microphone permission denied."); }
  };

  const stopRecording = () => { mediaRecorderRef.current?.stop(); setIsRecording(false); };

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatMessage.trim()) return;

    setChatHistory(prev => [...prev, { role: "user", content: chatMessage }]);
    setChatMessage("");
    setIsThinking(true);

    setReasoningNodes([
      { id: "intent", label: "Intent & Sentiment", status: "active", detail: "Analyzing polarity..." },
      { id: "rag", label: "Qdrant Vector Memory", status: "pending", detail: "Queued" },
      { id: "dag", label: "Multi-Agent DAG", status: "pending", detail: "Queued" },
      { id: "db", label: "PostgreSQL Sync", status: "pending", detail: "Queued" }
    ]);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatMessage }),
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { role: "assistant", content: data.reply }]);
      if (data.telemetry) setReasoningNodes(data.telemetry);
      fetchTasks();
    } catch (error) { 
      setReasoningNodes(prev => prev.map(n => ({ ...n, status: "error", detail: "Connection failed" })));
    }
    setIsThinking(false);
  };

  useEffect(() => { fetchTasks(); }, []);

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'coding': return <Code size={14} className="text-cyan-400" />;
      case 'study': return <BookOpen size={14} className="text-purple-400" />;
      case 'health': return <HeartPulse size={14} className="text-emerald-400" />;
      default: return <Layers size={14} className="text-blue-400" />;
    }
  };

  const getNodeIcon = (id: string) => {
    switch (id) {
      case 'intent': return <Cpu size={16} className="text-cyan-400" />;
      case 'rag': return <Activity size={16} className="text-purple-400" />;
      case 'dag': return <GitBranch size={16} className="text-blue-400" />;
      case 'db': return <Database size={16} className="text-emerald-400" />;
      default: return <ShieldCheck size={16} className="text-slate-400" />;
    }
  };

  const parseTaskDisplay = (fullText: string) => {
    const match = fullText.match(/\((?:Est:)?\s*([^)]+)\)/i);
    if (match) {
      const cleanText = fullText.replace(match[0], "").trim();
      const duration = match[1].trim();
      return { text: cleanText, duration };
    }
    return { text: fullText, duration: "30m" };
  };

  const pageAnim = { hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } } };

  return (
    <motion.div initial="hidden" animate="visible" variants={pageAnim} className="h-screen w-screen bg-[#02040a] text-slate-100 font-sans overflow-hidden selection:bg-cyan-500/30 flex flex-col relative">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-600/15 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-purple-600/15 rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '9s' }} />
      </div>

      <div className="max-w-[1700px] w-full mx-auto p-4 lg:p-6 relative z-10 flex flex-col h-full">
        
        <header className="mb-4 flex-shrink-0 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-75 animate-pulse" />
              <div className="relative bg-slate-950 p-3 rounded-2xl text-cyan-400 border border-white/10 shadow-2xl">
                <Sparkles size={26} />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
                LifeOS <span className="text-xs font-mono font-normal tracking-widest text-cyan-400/60 uppercase ml-2 px-2 py-0.5 rounded-full border border-cyan-500/20 bg-cyan-500/5">v4.5 Analytics Suite</span>
              </h1>
              <p className="text-slate-400 text-xs tracking-wide mt-0.5 font-medium">Multi-Agent Graph Architecture & Statistical Telemetry Core</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10">
              <button onClick={() => setActiveTab("copilot")} className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${activeTab === 'copilot' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'text-slate-400 hover:text-white'}`}>
                <MessageSquare size={14} /> Co-Pilot & Graph
              </button>
              <button onClick={() => setActiveTab("stats")} className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${activeTab === 'stats' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : 'text-slate-400 hover:text-white'}`}>
                <BarChart3 size={14} /> Analytics & Stats
              </button>
            </div>
          </div>
        </header>

        {activeTab === "copilot" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-hidden">
            
            <div className="lg:col-span-1 bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.6)] relative overflow-hidden h-full min-h-0">
              <div className="p-5 flex flex-col h-full min-h-0">
                <h2 className="text-slate-200 font-bold mb-4 flex-shrink-0 flex items-center gap-2.5 text-sm tracking-wider uppercase">
                  <MessageSquare size={16} className="text-cyan-400" /> Neural Co-Pilot
                </h2>
                
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scroll">
                  {chatHistory.length === 0 && (
                    <div className="text-center text-slate-500 mt-16 px-4">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-3 text-cyan-400">
                        <Flame size={22} />
                      </div>
                      <p className="text-sm font-semibold text-slate-300">Submit a complex goal to trigger the graph pipeline.</p>
                    </div>
                  )}
                  
                  <AnimatePresence>
                    {chatHistory.map((msg, idx) => (
                      <motion.div key={idx} initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} 
                        className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-xl backdrop-blur-md ${msg.role === 'user' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white ml-auto w-[88%] rounded-br-sm border border-cyan-400/20' : 'bg-slate-800/80 text-slate-200 mr-auto w-[92%] rounded-bl-sm border border-white/10 shadow-black/40'}`}>
                        {msg.content}
                      </motion.div>
                    ))}
                    {isThinking && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center p-4 bg-slate-800/80 border border-white/10 rounded-2xl w-fit rounded-bl-sm shadow-xl">
                        <div className="flex gap-1.5 items-center">
                          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                        <span className="text-xs font-mono text-cyan-400/80 ml-1">Executing Neural Graph...</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={sendMessage} className="relative mt-auto flex gap-2 flex-shrink-0">
                  <input type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} placeholder="What's on your mind today?" 
                    className="flex-1 bg-black/60 text-white placeholder-slate-500 px-5 py-4 rounded-2xl text-sm outline-none border border-white/10 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner" disabled={isThinking || isRecording} />
                  
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={isRecording ? stopRecording : startRecording} 
                    className={`p-4 rounded-2xl flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 animate-pulse' : 'bg-slate-800/80 text-slate-400 border border-white/10 hover:text-cyan-400 hover:bg-slate-800'}`}>
                    {isRecording ? <Square size={18} /> : <Mic size={18} />}
                  </motion.button>

                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" disabled={isThinking || !chatMessage.trim()} 
                    className="p-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:opacity-90 shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50">
                    <Send size={18} />
                  </motion.button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-1 bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.6)] relative overflow-hidden h-full min-h-0">
              <div className="p-5 flex flex-col h-full min-h-0">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <h2 className="text-slate-200 font-bold flex items-center gap-2.5 text-sm tracking-wider uppercase">
                    <Activity size={16} className="text-purple-400" /> Real-Time Reasoning Graph
                  </h2>
                  <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full uppercase">
                    Live Pipeline
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 custom-scroll pr-2 flex flex-col justify-center">
                  {reasoningNodes.map((node, index) => {
                    const isActive = node.status === 'active';
                    const isCompleted = node.status === 'completed';
                    
                    return (
                      <div key={node.id} className="relative">
                        {index < reasoningNodes.length - 1 && (
                          <div className={`absolute left-6 top-12 w-0.5 h-6 transition-colors duration-500 ${isCompleted ? 'bg-purple-500/50' : 'bg-white/10'}`} />
                        )}
                        
                        <motion.div animate={isActive ? { scale: [1, 1.02, 1] } : {}} transition={{ repeat: Infinity, duration: 1.5 }}
                          className={`p-4 rounded-2xl border backdrop-blur-md transition-all flex items-start gap-3.5 shadow-lg ${isActive ? 'bg-purple-950/40 border-purple-500/50' : isCompleted ? 'bg-slate-800/60 border-purple-500/30' : 'bg-slate-900/60 border-white/10 opacity-60'}`}>
                          
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${isActive ? 'bg-purple-500/20 border-purple-500/50 animate-pulse text-purple-300' : isCompleted ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                            {getNodeIcon(node.id)}
                          </div>

                          <div className="flex flex-col gap-1 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">{node.label}</span>
                              <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border ${isActive ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse' : isCompleted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-slate-500 border-white/10'}`}>
                                {node.status}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 truncate">{node.detail}</span>
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.6)] relative overflow-hidden h-full min-h-0">
              <div className="p-5 flex flex-col h-full min-h-0">
                <div className="flex items-center justify-between mb-5 flex-shrink-0">
                  <h2 className="text-slate-200 font-bold flex items-center gap-2.5 text-sm tracking-wider uppercase">
                    <CheckSquare size={16} className="text-emerald-400" /> Sequential Roadmap
                  </h2>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    {tasks.length} {tasks.length === 1 ? 'Step' : 'Steps'} Ahead
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 custom-scroll pr-2">
                  <AnimatePresence>
                    {tasks.length === 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-500 text-sm text-center mt-16 italic">
                        All steps cleared. Enjoy your breathing room.
                      </motion.div>
                    )}
                    {tasks.map((task, index) => {
                      const stepNumber = String(index + 1).padStart(2, '0');
                      const parsed = parseTaskDisplay(task.text);

                      return (
                        <motion.div key={task.id} layout initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, x: 40 }}
                          whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.06)" }}
                          className="p-3.5 bg-slate-800/60 border border-white/10 rounded-2xl relative overflow-hidden transition-all shadow-md flex items-center justify-between gap-3 backdrop-blur-md group/card">
                          
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-cyan-400 shrink-0">
                              {stepNumber}
                            </div>

                            <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }} onClick={() => completeTask(task.id, task.text)} className="text-slate-400 hover:text-emerald-400 transition-colors shrink-0">
                              <Circle size={18} className="group-hover/card:hidden" />
                              <CheckCircle2 size={18} className="hidden group-hover/card:block text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                            </motion.button>

                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <span className="shrink-0">{getCategoryIcon(task.category)}</span>
                              <span className="text-xs text-slate-100 font-medium truncate tracking-tight">{parsed.text}</span>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/25 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold text-cyan-300 shadow-sm">
                            <Clock size={11} className="text-cyan-400" />
                            <span>{parsed.duration}</span>
                          </div>

                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-hidden">
            <StatsDashboard />
          </div>
        )}

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}} />
    </motion.div>
  );
}