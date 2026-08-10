"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("chat");
  const [tasks, setTasks] = useState<{ id: number; text: string; done: boolean }[]>([]);
  const [newTask, setNewTask] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const API_BASE = "http://localhost:8000/api/v1";

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newTask }),
    });
    setNewTask("");
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = { role: "user", content: chatMessage };
    setChatHistory((prev) => [...prev, userMsg]);
    setChatMessage("");
    setIsThinking(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });
      
      const data = await res.json();
      
      // Safety check: Ensure the reply actually exists before displaying
      if (data.reply) {
        setChatHistory((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setChatHistory((prev) => [...prev, { role: "assistant", content: `⚠️ Error parsing data: ${JSON.stringify(data)}` }]);
      }
    } catch (error) {
      setChatHistory((prev) => [...prev, { role: "assistant", content: "⚠️ Network Error: Backend is offline." }]);
    } finally {
      setIsThinking(false);
    }
  };

  useEffect(() => {
    if (activeTab === "tasks") fetchTasks();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex border-b">
          <button className={`flex-1 py-4 font-bold ${activeTab === 'chat' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`} onClick={() => setActiveTab('chat')}>AI Agent</button>
          <button className={`flex-1 py-4 font-bold ${activeTab === 'tasks' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`} onClick={() => setActiveTab('tasks')}>Tasks</button>
        </div>

        <div className="p-6">
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[500px]">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 border p-4 rounded-lg bg-gray-50">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`p-3 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-200 text-black mr-auto'}`}>
                    {msg.content}
                  </div>
                ))}
                {isThinking && <div className="bg-gray-200 p-3 rounded-lg w-fit animate-pulse text-gray-500">Thinking...</div>}
              </div>
              <form onSubmit={sendMessage} className="flex gap-2">
                <input type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} placeholder="Ask LifeOS..." className="flex-1 border p-3 rounded-lg" disabled={isThinking} />
                <button type="submit" className={`text-white px-6 py-3 rounded-lg font-bold ${isThinking ? 'bg-blue-300' : 'bg-blue-600'}`} disabled={isThinking}>Send</button>
              </form>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div>
              <form onSubmit={addTask} className="flex gap-2 mb-6">
                <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="New task..." className="flex-1 border p-3 rounded-lg" />
                <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold">Add</button>
              </form>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="flex justify-between p-4 bg-gray-50 border rounded-lg">
                    <span>{task.text}</span>
                    <button onClick={() => deleteTask(task.id)} className="text-red-500 font-bold px-3 py-1 bg-red-100 rounded-md">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}