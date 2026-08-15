"use client";
import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://lifeos-ai-3-wf0j.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("Connecting to server (free instances may take ~45s to wake up)...");
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
        setStatusMessage("Login successful! Redirecting...");
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
        }
      } else {
        setStatusMessage(null);
        setErrorMessage(data.detail || `Server returned error code: ${response.status}`);
      }
    } catch (err) {
      setStatusMessage(null);
      setErrorMessage(`Failed to reach backend at ${BACKEND_URL}. Check if the service is online.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "380px", margin: "80px auto", fontFamily: "sans-serif", padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Sign In to LifeOS</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
        </div>
        <button type="submit" disabled={loading} style={{ padding: "12px", marginTop: "10px", background: loading ? "#888" : "#0070f3", color: "white", border: "none", borderRadius: "6px", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      {statusMessage && <div style={{ marginTop: "16px", padding: "10px", background: "#e6f4ea", color: "#137333", borderRadius: "6px", fontSize: "14px" }}>{statusMessage}</div>}
      {errorMessage && <div style={{ marginTop: "16px", padding: "10px", background: "#fce8e6", color: "#c5221f", borderRadius: "6px", fontSize: "14px" }}><strong>Error:</strong> {errorMessage}</div>}
    </div>
  );
}
