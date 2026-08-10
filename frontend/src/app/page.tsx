"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("chat");
  
  // Task State
  const [tasks, setTasks] = useState<{ id: number; text: string; done: boolean }[]>([]);
  const [newTask, setNewTask] = useState("");

  // Chat State
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);

  // --- TASK FUNCTIONS ---
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await fetch("http://localhost:8000/api/v1/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newTask }),
      });
      setNewTask("");
      fetchTasks();
    } catch (error) {
      console.error("Failed to add task", error);
    }
  };

  // NEW: Delete Task Function
  const deleteTask = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/api/v1/tasks/${id}`, {
        method: "DELETE",
      });
      fetchTasks(); // Refresh the list after deleting
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // --- CHAT FUNCTIONS ---
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = { role: "user", content: chatMessage };
    setChatHistory((prev) => [...prev, userMsg]);
    setChatMessage("");

    try {
      const res = await fetch("http://localhost:8000/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });
      const data = await res.json();
      setChatHistory((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("Chat failed", error);
    }
  };

  // Load tasks when tab switches to 'tasks'
  useEffect(() => {
    if (activeTab === "tasks") {
      fetchTasks();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        
        {/* Header / Tabs */}
        <div className="flex border-b">
          <button 
            className={`flex-1 py-4 font-semibold ${activeTab === 'chat' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('chat')}
          >
            AI Assistant
          </button>
          <button 
            className={`flex-1 py-4 font-semibold ${activeTab === 'tasks' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('tasks')}
          >
            Task Manager
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          
          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[500px]">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 border p-4 rounded-lg bg-gray-50">
                {chatHistory.length === 0 ? (
                  <p className="text-gray-400 text-center mt-20">Say hello to LifeOS!</p>
                ) : (
                  chatHistory.map((msg, idx) => (
                    <div key={idx} className={`p-3 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200 text-gray-800 mr-auto'}`}>
                      {msg.content}
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={sendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask the AI to manage your tasks..." 
                  className="flex-1 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700">Send</button>
              </form>
            </div>
          )}

          {/* TASKS TAB */}
          {activeTab === 'tasks' && (
            <div>
              <form onSubmit={addTask} className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="What needs to be done?" 
                  className="flex-1 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700">Add Task</button>
              </form>

              <div className="space-y-3">
                {tasks.length === 0 ? (
                  <p className="text-gray-500 text-center">No tasks yet. You are all caught up!</p>
                ) : (
                  tasks.map((task) => (
                    <div key={task.id} className="flex justify-between items-center p-4 bg-gray-50 border rounded-lg">
                      <span className="text-gray-800">{task.text}</span>
                      {/* NEW: Delete Button */}
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="ml-4 text-red-500 hover:text-red-700 font-bold px-3 py-1 bg-red-100 rounded-md transition-colors"
                        title="Delete task"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}