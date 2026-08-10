"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageSquare, CheckSquare, BrainCircuit, Mic, Square, Sparkles } from "lucide-react";

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [aiThoughts, setAiThoughts] = useState<string[]>(["Ready to help you organize your day."]);
  
  // Audio State
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const API_BASE = "http://localhost:8000/api/v1";

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isThinking]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      setTasks(await res.json());
    } catch (error) { console.error(error); }
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
        setAiThoughts(["Listening to your voice...", "Converting speech to text..."]);
        
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "voice.webm");

        try {
          const res = await fetch(`${API_BASE}/audio`, { method: "POST", body: formData });
          const data = await res.json();
          
          if (data.transcribed) {
            setChatHistory(prev => [...prev, { role: "user", content: `🎤 ${data.transcribed}` }]);
          }
          setChatHistory(prev => [...prev, { role: "assistant", content: data.reply }]);
          setAiThoughts(prev => [...prev, "Finished processing tasks!"]);
          fetchTasks();
        } catch (error) {
          setAiThoughts(["Oops, something went wrong with the microphone."]);
        } finally {
          setIsThinking(false);
          stream.getTracks().forEach(track => track.stop());
        }
      };

      recorder.start();
      setIsRecording(true);
      setAiThoughts(["Microphone is on. I am listening..."]);
    } catch (err) {
      setAiThoughts(["Please allow microphone access to use voice commands."]);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatMessage.trim()) return;

    setChatHistory(prev => [...prev, { role: "user", content: chatMessage }]);
    setChatMessage("");
    setIsThinking(true);
    setAiThoughts(["Reading your message...", "Thinking of the best way to help..."]);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatMessage }),
      });
      const data = await res.json();
      
      setChatHistory(prev => [...prev, { role: "assistant", content: data.reply }]);
      
      // Filter out scary technical terms from backend if they exist
      if (data.telemetry && data.telemetry.steps) {
        const friendlyThoughts = data.telemetry.steps.map((step: string) => 
          step.replace(/\[.*?\]/g, '✓').replace(/Agent 1|Agent 2|Vector DB|telemetry/gi, 'LifeOS AI')
        );
        setAiThoughts(friendlyThoughts);
      }
      fetchTasks();
    } catch (error) {
      setAiThoughts(["Oops, I lost connection to the server. Please try again."]);
    } finally {
      setIsThinking(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  // Soft, elegant animations
  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden selection:bg-blue-500/30">
      
      {/* Soft Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[1400px] mx-auto p-4 lg:p-8 relative z-10 h-screen flex flex-col">
        
        {/* Friendly Header */}
        <motion.header variants={fadeUp} initial="hidden" animate="visible" className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">LifeOS</h1>
              <p className="text-slate-400 text-sm mt-1">Your AI-Powered Life Assistant</p>
            </div>
          </div>
        </motion.header>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          
          {/* PANEL 1: Chat Interface */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-1 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl flex flex-col shadow-xl">
            <div className="p-6 flex flex-col h-full">
              <h2 className="text-slate-300 font-semibold mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-blue-400" /> Chat with AI
              </h2>
              
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scroll">
                {chatHistory.length === 0 && (
                  <div className="text-center text-slate-500 mt-10">
                    <p>Say hello to get started!</p>
                    <p className="text-sm mt-2">Try: "Help me plan my day."</p>
                  </div>
                )}
                
                <AnimatePresence>
                  {chatHistory.map((msg, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} 
                      className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-md ${msg.role === 'user' ? 'bg-blue-600 text-white ml-auto w-[85%] rounded-br-sm' : 'bg-slate-800 text-slate-200 mr-auto w-[90%] rounded-bl-sm border border-slate-700'}`}>
                      {msg.content}
                    </motion.div>
                  ))}
                  {isThinking && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center p-4 bg-slate-800 border border-slate-700 rounded-2xl w-fit rounded-bl-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={chatEndRef} />
              </div>

              {/* Interactive Input Area */}
              <form onSubmit={sendMessage} className="relative mt-auto flex gap-2">
                <input type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} placeholder="Type a task or goal..." 
                  className="flex-1 bg-slate-950 text-white placeholder-slate-500 px-5 py-4 rounded-2xl text-sm outline-none border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner" disabled={isThinking || isRecording} />
                
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={isRecording ? stopRecording : startRecording} 
                  className={`p-4 rounded-2xl flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}>
                  {isRecording ? <Square size={18} /> : <Mic size={18} />}
                </motion.button>

                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" disabled={isThinking || !chatMessage.trim()} 
                  className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 disabled:shadow-none">
                  <Send size={18} />
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* PANEL 2: AI Thought Process (Friendly explanations) */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="lg:col-span-1 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl flex flex-col shadow-xl">
            <div className="p-6 flex flex-col h-full">
              <h2 className="text-slate-300 font-semibold mb-4 flex items-center gap-2">
                <BrainCircuit size={18} className="text-purple-400" /> AI Thought Process
              </h2>
              <div className="flex-1 overflow-y-auto space-y-4 custom-scroll pr-2">
                <p className="text-sm text-slate-500 mb-2">Here is how LifeOS is handling your request:</p>
                <AnimatePresence>
                  {aiThoughts.map((thought, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3 text-sm text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                      <span className="text-purple-400">✧</span>
                      <span>{thought}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* PANEL 3: Task List */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="lg:col-span-1 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl flex flex-col shadow-xl">
            <div className="p-6 flex flex-col h-full">
              <h2 className="text-slate-300 font-semibold mb-6 flex items-center gap-2">
                <CheckSquare size={18} className="text-emerald-400" /> Your To-Do List
              </h2>
              <div className="flex-1 overflow-y-auto space-y-4 custom-scroll pr-2">
                <AnimatePresence>
                  {tasks.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-500 text-sm text-center mt-10">
                      You have no tasks! Tell the AI to add something.
                    </motion.div>
                  )}
                  {tasks.map((task) => (
                    <motion.div key={task.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} 
                      className="p-4 bg-slate-800 border border-slate-700 rounded-2xl relative overflow-hidden group hover:border-slate-600 transition-all cursor-default shadow-md">
                      
                      {/* Friendly Color Indicator */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${task.urgency > 3 ? 'bg-red-500' : task.urgency > 1 ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                      
                      <div className="pl-3 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-700 text-slate-300 px-2 py-1 rounded-lg">
                            {task.category}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${task.urgency > 3 ? 'bg-red-500/10 text-red-400' : task.urgency > 1 ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                            Priority: {task.urgency}
                          </span>
                        </div>
                        <span className="text-sm text-slate-100 mt-1">{task.text}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
      
      {/* Custom Scrollbar CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.2); border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.4); }
      `}} />
    </div>
  );
}