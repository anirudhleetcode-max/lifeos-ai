"use client";
import React, { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://lifeos-ai-3-wf0j.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("Connecting to server (Render free tier may take ~45s to wake up)...");
    setErrorMessage(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password: password }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatusMessage("Login successful!");
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
        }
      } else {
        setStatusMessage(null);
        setErrorMessage(data.detail || `Server error code: ${response.status}`);
      }
    } catch (err) {
      setStatusMessage(null);
      setErrorMessage(`Failed to reach backend at ${BACKEND_URL}. Backend might be waking up.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f4f6f8", fontFamily: "sans-serif", padding: "20px" }}>
      <div style={{ maxWidth: "400px", width: "100%", background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <h1 style={{ fontSize: "24px", marginBottom: "8px", textAlign: "center", color: "#111" }}>LifeOS</h1>
        <p style={{ fontSize: "14px", color: "#666", textAlign: "center", marginBottom: "24px" }}>Sign in to access your dashboard</p>
        
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600", color: "#333" }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600", color: "#333" }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
          </div>
          <button type="submit" disabled={loading} style={{ padding: "12px", marginTop: "8px", background: loading ? "#999" : "#0070f3", color: "#fff", border: "none", borderRadius: "6px", fontSize: "16px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {statusMessage && <div style={{ marginTop: "16px", padding: "10px", background: "#e6f4ea", color: "#137333", borderRadius: "6px", fontSize: "14px" }}>{statusMessage}</div>}
        {errorMessage && <div style={{ marginTop: "16px", padding: "10px", background: "#fce8e6", color: "#c5221f", borderRadius: "6px", fontSize: "14px" }}><strong>Error:</strong> {errorMessage}</div>}
      </div>
    </div>
  );
}
