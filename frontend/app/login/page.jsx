"use client";
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Success:", data);
        alert("Successfully logged in!");
      } else {
        console.error("Backend Error:", data);
        alert(`Error: ${data.detail || "Invalid email or password"}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Failed to connect to the backend. Please wait a few seconds and try again.");
    }
  };

  return (
    <div style={{ maxWidth: '320px', margin: '100px auto', fontFamily: 'sans-serif' }}>
      <h2>Sign In</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
          style={{ padding: '10px', fontSize: '16px' }} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
          style={{ padding: '10px', fontSize: '16px' }} 
        />
        <button 
          type="submit" 
          style={{ padding: '12px', background: '#0070f3', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
