"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Bot, User, Sparkles, Activity, Lock, LogOut, Database, Code, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ProfessionalUI() {
  const [token, setToken] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history, loading]);

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8000/api/v1/chat/history", {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => { if (Array.isArray(data)) setHistory(data); })
    .catch(err => console.error("Failed to load history", err));
  }, [token]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError("");
    const endpoint = isLogin ? "http://localhost:8000/api/v1/auth/login" : "http://localhost:8000/api/v1/auth/signup";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Authentication failed");
      setToken(data.access_token);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    const userText = prompt;
    
    const newHistory = [...history, { role: "user", text: userText }, { role: "ai", text: "" }];
    setHistory(newHistory); 
    setPrompt(""); 
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/chat/prompt", {
        method: "POST", 
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: userText }),
      });

      if (!res.ok) throw new Error("Connection failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        setHistory(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "ai", text: accumulatedText };
          return updated;
        });
      }
    } catch (err) {
      setHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "ai", text: "CRITICAL ERROR: Connection stream interrupted." };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm max-w-md w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Lock size={24} /></div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">LifeOS Security</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">JWT Authentication Gateway</p>
            </div>
          </div>
          {authError && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{authError}</div>}
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl p-3 outline-none text-sm" placeholder="name@domain.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl p-3 outline-none text-sm" placeholder="????????" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium p-3 rounded-xl transition-all shadow-sm">
              {isLogin ? "Sign In to Workspace" : "Create Account"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-xs font-semibold text-indigo-600 hover:underline">
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col items-center">
      <div className="w-full max-w-4xl flex flex-col h-screen py-6 px-4 md:px-0">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-2xl shadow-sm mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><Sparkles size={22} strokeWidth={2.5} /></div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">LifeOS Workspace</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Database size={12} className="text-emerald-500" />
                <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">PostgreSQL + RAG + Streaming Active</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
               <Activity size={14} className="text-slate-400"/>
               <span className="text-xs font-semibold text-slate-500">Llama 3.1 Neural Engine</span>
            </div>
            <button onClick={() => setToken("")} title="Log Out" className="p-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-xl transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </motion.div>

        <div className="flex-1 bg-white border border-slate-200 rounded-3xl overflow-y-auto p-4 md:p-8 space-y-6 shadow-sm relative">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Bot size={48} strokeWidth={1.5} className="mb-4 text-indigo-200" />
              <h2 className="text-lg font-medium text-slate-600">How can I assist you today?</h2>
              <p className="text-xs text-slate-400 mt-1">Your sovereign AI workspace is fully operational.</p>
            </div>
          ) : (
            <AnimatePresence>
              {history.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div className={msg.role === 'user' ? 'flex gap-3 max-w-[85%] flex-row-reverse' : 'flex gap-3 max-w-[85%] flex-row'}>
                    <div className={msg.role === 'user' ? 'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-indigo-600 text-white shadow-md' : 'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-slate-100 border border-slate-200 text-indigo-600'}>
                      {msg.role === 'user' ? <User size={16} strokeWidth={2.5} /> : <Bot size={18} strokeWidth={2.5} />}
                    </div>
                    <div className={msg.role === 'user' ? 'p-4 rounded-2xl bg-indigo-600 text-white rounded-tr-sm shadow-md' : 'p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-sm w-full'}>
                      {msg.role === 'user' ? (
                        <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{msg.text}</p>
                      ) : (
                        <div className="text-[15px] leading-relaxed prose prose-slate max-w-none">
                          <ReactMarkdown
                            components={{
                              code({node, inline, className, children, ...props}) {
                                const match = /language-(\w+)/.exec(className || '');
                                const codeContent = String(children).replace(/\n$/, '');
                                if (!inline && match) {
                                  return (
                                    <div className="relative my-3 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 text-slate-200">
                                      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-950 border-b border-slate-800 text-xs font-mono text-slate-400">
                                        <span>{match[1].toUpperCase()}</span>
                                        <button 
                                          onClick={() => copyToClipboard(codeContent, i)}
                                          className="flex items-center gap-1 hover:text-white transition-colors"
                                        >
                                          {copiedIndex === i ? <Check size={14} className="text-emerald-400" /> : <Code size={14} />}
                                          <span>{copiedIndex === i ? "Copied!" : "Copy"}</span>
                                        </button>
                                      </div>
                                      <pre className="p-4 overflow-x-auto font-mono text-xs text-emerald-400">
                                        <code>{codeContent}</code>
                                      </pre>
                                    </div>
                                  );
                                }
                                return (
                                  <code className="px-1.5 py-0.5 rounded-md bg-slate-200/70 text-indigo-600 font-mono text-xs" {...props}>
                                    {children}
                                  </code>
                                );
                              }
                            }}
                          >
                            {msg.text}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          {loading && history[history.length - 1]?.text === "" && (
             <div className="flex justify-start">
               <div className="flex gap-3 max-w-[85%]">
                 <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-100 border border-slate-200 text-indigo-600 flex items-center justify-center"><Bot size={18} /></div>
                 <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm flex items-center gap-3">
                   <Loader2 className="animate-spin text-indigo-500" size={18}/>
                   <span className="text-sm font-medium text-slate-500">Generating stream...</span>
                 </div>
               </div>
             </div>
          )}
          <div ref={scrollRef} />
        </div>

        <div className="mt-6">
          <form onSubmit={handleSend} className="relative flex items-center shadow-sm">
            <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Message LifeOS workspace..." disabled={loading} className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl py-4 pl-6 pr-16 text-slate-800 placeholder-slate-400 outline-none transition-all text-[15px]" />
            <button type="submit" disabled={loading || !prompt.trim()} className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center shadow-sm">
              <Send size={18} strokeWidth={2.5} className="-ml-0.5 mt-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
