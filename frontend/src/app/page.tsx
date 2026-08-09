'use client';
import { useState, useEffect } from 'react';

export default function LifeOS() {
  const [activeTab, setActiveTab] = useState('chat');
  
  // Chat State
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Task State
  const [tasks, setTasks] = useState<{id: number, text: string, done: boolean}[]>([]);
  const [newTask, setNewTask] = useState('');

  // --- UPGRADED: FETCH TASKS EVERY TIME WE CLICK THE TAB ---
  useEffect(() => {
    if (activeTab === 'tasks') {
      fetch('http://localhost:8000/api/v1/tasks')
        .then(res => res.json())
        .then(data => setTasks(data))
        .catch(err => console.error("Error loading tasks:", err));
    }
  }, [activeTab]);

  // --- CHAT LOGIC ---
  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply || "Message received!" }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: 'Error connecting to backend.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- NEW: SAVE TASKS TO DATABASE ---
  const addTask = async () => {
    if (!newTask.trim()) return;
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTask })
      });
      const savedTask = await response.json();
      setTasks([...tasks, savedTask]);
      setNewTask('');
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  // --- NEW: UPDATE TASK IN DATABASE ---
  const toggleTask = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/api/v1/tasks/${id}`, { method: 'PUT' });
      setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <div className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            LifeOS AI
          </h1>
          <p className="text-xs text-slate-400 mt-1">v1.0.0 Dashboard</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'chat' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            AI Assistant
          </button>
          
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'tasks' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            Task Manager
          </button>
        </nav>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
        
        {/* --- VIEW 1: AI ASSISTANT --- */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col h-full p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Neural Network Chat</h2>
              <p className="text-gray-500 text-sm">Your AI remembers everything you tell it.</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 mb-6 p-6 rounded-2xl bg-gray-50 border border-gray-100 shadow-inner">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <p className="text-lg font-medium text-gray-500 mb-2">System Online.</p>
                  <p>Say hello to begin syncing memories.</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-4 rounded-2xl max-w-[75%] shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-3">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 p-4 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white shadow-sm transition-all"
                placeholder="Message LifeOS..."
              />
              <button onClick={sendMessage} className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md">
                Send
              </button>
            </div>
          </div>
        )}

        {/* --- VIEW 2: TASK MANAGER --- */}
        {activeTab === 'tasks' && (
          <div className="flex-1 flex flex-col h-full p-8 overflow-y-auto">
            <div className="max-w-4xl w-full mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Master Task List</h2>
                <p className="text-gray-500 mt-1">Synced to PostgreSQL Database</p>
              </div>

              {/* Add Task Input */}
              <div className="flex gap-3 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <input 
                  type="text" 
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                  className="flex-1 p-3 border-none bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="What needs to be done?"
                />
                <button onClick={addTask} className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 transition-colors shadow-sm">
                  Add Task
                </button>
              </div>

              {/* Task List */}
              <div className="space-y-3">
                {tasks.map(task => (
                  <div key={task.id} className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${task.done ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-200 shadow-sm hover:shadow-md'}`}>
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${task.done ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 hover:border-emerald-400'}`}
                    >
                      {task.done && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </button>
                    <span className={`text-lg font-medium ${task.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {task.text}
                    </span>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="text-center p-12 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
                    No tasks yet. You are all caught up!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}