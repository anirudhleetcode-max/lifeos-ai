"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, CheckCircle2, Activity, ListTodo } from "lucide-react";

export default function Dashboard() {
  // 1. Set up state to hold our backend data
  const [stats, setStats] = useState({
    active_tasks: 0,
    completed: 0,
    agent_status: "Connecting..."
  });

  // 2. Fetch the data from FastAPI when the page loads
  useEffect(() => {
    fetch("http://localhost:8000/api/stats")
      .then((response) => response.json())
      .then((data) => setStats(data))
      .catch((error) => console.error("Backend connection failed:", error));
  }, []);

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto font-sans">
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex justify-between items-center mb-10"
      >
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            LifeOS Command Center
          </h1>
          <p className="text-slate-400 mt-2">Live connection to FastAPI backend established.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-sm font-medium text-slate-300">Backend Connected</span>
        </div>
      </motion.div>

      {/* Grid Layout pulling LIVE DATA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="bg-slate-800 p-6 rounded-2xl border border-slate-700"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400"><ListTodo size={24} /></div>
            <h3 className="text-lg font-semibold text-slate-200">Active Tasks</h3>
          </div>
          <p className="text-3xl font-bold">{stats.active_tasks}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="bg-slate-800 p-6 rounded-2xl border border-slate-700"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-400"><CheckCircle2 size={24} /></div>
            <h3 className="text-lg font-semibold text-slate-200">Completed</h3>
          </div>
          <p className="text-3xl font-bold">{stats.completed}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
          className="bg-slate-800 p-6 rounded-2xl border border-slate-700"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400"><Activity size={24} /></div>
            <h3 className="text-lg font-semibold text-slate-200">Agent Activity</h3>
          </div>
          <p className="text-3xl font-bold text-purple-400">{stats.agent_status}</p>
        </motion.div>

      </div>
    </div>
  );
}
