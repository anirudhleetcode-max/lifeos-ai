"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Terminal, Send, Loader2, Server, Database, Cpu, Network } from "lucide-react";

export default function InternshipPortfolioUI() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleSendPrompt = async (e) => {
    e.preventDefault();
    if (!prompt) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("http://localhost:8000/api/v1/chat/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ 
        ai_response: "CRITICAL ERROR: Cannot connect to Python backend. Is Docker running?" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 p-6 md:p-12 font-sans flex flex-col items-center">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-800/80 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 mb-2">
              LifeOS Architecture
            </h1>
            <p className="text-slate-400 flex items-center gap-2 text-sm md:text-base">
              <Server size={16} className="text-emerald-500" /> 
              Agentic Task Manager • PyTorch • Next.js • PostgreSQL
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-700/50 shadow-lg shadow-emerald-900/20">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm text-emerald-400 font-bold tracking-wide uppercase">System Online</span>
          </div>
        </div>
      </motion.div>

      {/* Tech Stack Grid */}
      <motion.div 
        initial="hidden" animate="show" 
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
      >
        {[
          { name: "Llama 3.1 LLM", icon: <BrainCircuit className="text-purple-400"/> },
          { name: "PyTorch & Math", icon: <Network className="text-blue-400"/> },
          { name: "PostgreSQL DB", icon: <Database className="text-yellow-400"/> },
          { name: "FastAPI Engine", icon: <Cpu className="text-emerald-400"/> }
        ].map((tech, idx) => (
          <motion.div key={idx} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} 
            className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3 hover:bg-slate-800/60 transition-colors shadow-md">
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-700/50">{tech.icon}</div>
            <span className="text-sm font-semibold text-slate-300">{tech.name}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* AI Terminal */}
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-5xl gap-6 flex flex-col">
        <div className="bg-slate-800/40 border border-slate-700/80 rounded-2xl p-1 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 opacity-50 blur-xl"></div>
          <div className="bg-[#0f1423] rounded-xl p-6 md:p-8 relative z-10 border border-slate-700/50">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-slate-200">
              <Terminal size={24} className="text-emerald-400"/> Initialize Agent Protocol
            </h2>
            <form onSubmit={handleSendPrompt} className="relative group">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Optimize my workload for a Machine Learning project due tomorrow..."
                className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl py-5 pl-5 pr-16 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-lg"
              />
              <button type="submit" disabled={loading} className="absolute right-3 top-3 bottom-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-4 rounded-lg transition-all disabled:opacity-50 font-bold">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              </button>
            </form>
          </div>
        </div>

        {/* AI Output Window */}
        <AnimatePresence>
          {response && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-slate-800/40 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-purple-400">
                <BrainCircuit size={22} /> Agent Reasoning Output
              </h2>
              <div className="bg-[#0B0F19] rounded-xl p-6 border border-slate-700">
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-base">
                  {response.ai_response}
                </p>
                {response.priority_score && (
                  <div className="mt-4 pt-4 border-t border-slate-800 text-sm text-slate-500 flex justify-between">
                    <span>Algorithm: O(N log N) Min-Heap</span>
                    <span>Tensor Compute: Done</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
