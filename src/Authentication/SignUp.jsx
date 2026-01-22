import React, { useState } from "react";
import api from "../Authentication/api";
import { useNavigate } from "react-router-dom";
import logo from '../../public/LOGO3.png'

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [created, setCreated] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    try {
      await api.post("/auth/signup", { email, name, password });

      setCreated(true);
      setMsg("Admin account created successfully. Redirecting to login...");

      // auto redirect
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.error || "Signup failed";
      setErr(message);

      // If admin already exists → show login option
      if (message.toLowerCase().includes("exist")) {
        setCreated(true);
      }
    }
  };

  return (
    <div style={styles.page}>
      {/* Google Font */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');`}
      </style>

      <form style={styles.card} onSubmit={handleSignup}>
        {/* Header */}
        <div style={styles.header}>
          <img
            src={logo}
            alt="Talent Assess Logo"
            style={styles.logo}
          />
          <h2 style={styles.title}>Admin SignUp</h2>
          <p style={styles.subtitle}>Create an admin account for Talent Assess</p>
        </div>

        {/* Messages */}
        {err && <p style={styles.error}>{err}</p>}
        {msg && <p style={styles.success}>{msg}</p>}

        {/* Form */}
        {!created && (
          <>
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                style={styles.input}
                placeholder="Admin User"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                style={styles.input}
                placeholder="admin@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                style={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" style={styles.primaryBtn}>
              Create Admin Account
            </button>
          </>
        )}

        {/* Already signed up */}
        {created && (
          <div style={styles.loginHint}>
            <span style={styles.loginText}>Already signed up?</span>
            <button
              type="button"
              style={styles.loginLink}
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    height: "100vh",
    background: "#f5f7fb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Poppins, system-ui, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 440,
    background: "#ffffff",
    padding: "36px 32px",
    borderRadius: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  header: {
    textAlign: "center",
    marginBottom: 6,
  },
  logo: {
  width: 86,
  height: 96,
  borderRadius: 14,
  objectFit: "contain",
  display: "block",
  margin: "0 auto 10px",
  background: "white",
  padding: 6,
},
  title: {
    margin: 0,
    fontWeight: 700,
    color: "#0f3b66",
    fontSize: 22,
  },
  subtitle: {
    margin: "6px 0 0",
    fontSize: 13,
    color: "#718096",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: "#4a5568",
  },
  input: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    fontSize: 14,
    outline: "none",
  },
  primaryBtn: {
    marginTop: 8,
    padding: "12px",
    borderRadius: 12,
    border: "none",
    background: "#2ecc71",
    color: "white",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  loginHint: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
    fontSize: 13,
  },
  loginText: {
    color: "#4a5568",
    fontWeight: 500,
  },
  loginLink: {
    background: "none",
    border: "none",
    padding: 0,
    color: "#0f3b66",
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "underline",
  },
  error: {
    color: "#e53e3e",
    fontSize: 13,
    textAlign: "center",
  },
  success: {
    color: "#16a34a",
    fontSize: 13,
    textAlign: "center",
  },
};
