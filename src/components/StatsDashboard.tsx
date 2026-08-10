
"use client";
import { useState } from "react";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { BarChart3, PieChart as PieIcon, TrendingUp, ScatterChart as ScatterIcon, Calculator } from "lucide-react";

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

export default function StatsDashboard() {
  const [activeTab, setActiveTab] = useState<"bar" | "line" | "pie" | "scatter">("bar");

  const scores = performanceData.map(d => d.score);
  const meanScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  const sortedScores = [...scores].sort((a, b) => a - b);
  const medianScore = sortedScores[Math.floor(sortedScores.length / 2)];
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const range = maxScore - minScore;

  return (
    <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col h-full text-slate-100">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2 text-cyan-400 uppercase tracking-wider">
            <BarChart3 size={20} /> Analytics & Statistical Core
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Real-time telemetry, descriptive statistics, and multi-format visualizations.</p>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/10">
          <button onClick={() => setActiveTab("bar")} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${activeTab === "bar" ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30" : "text-slate-400 hover:text-white"}`}>
            <BarChart3 size={14} /> Bar
          </button>
          <button onClick={() => setActiveTab("line")} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${activeTab === "line" ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30" : "text-slate-400 hover:text-white"}`}>
            <TrendingUp size={14} /> Line
          </button>
          <button onClick={() => setActiveTab("pie")} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${activeTab === "pie" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "text-slate-400 hover:text-white"}`}>
            <PieIcon size={14} /> Pie
          </button>
          <button onClick={() => setActiveTab("scatter")} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${activeTab === "scatter" ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30" : "text-slate-400 hover:text-white"}`}>
            <ScatterIcon size={14} /> Scatter
          </button>
        </div>
      </div>

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

      <div className="flex-1 min-h-[260px] w-full bg-black/40 border border-white/10 rounded-2xl p-4 flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === "bar" ? (
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: "#02040a", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px" }} />
              <Bar dataKey="tasksCompleted" fill="#06b6d4" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : activeTab === "line" ? (
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: "#02040a", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px" }} />
              <Line type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={3} dot={{ fill: "#a855f7", r: 4 }} />
            </LineChart>
          ) : activeTab === "pie" ? (
            <PieChart>
              <Pie data={categoryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} innerRadius={45} label>
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#02040a", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
            </PieChart>
          ) : (
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="studyHours" name="Study Hours" stroke="#94a3b8" fontSize={11} unit="h" />
              <YAxis dataKey="score" name="Score" stroke="#94a3b8" fontSize={11} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ backgroundColor: "#02040a", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px" }} />
              <Scatter name="Performance Matrix" data={performanceData} fill="#3b82f6" />
            </ScatterChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

