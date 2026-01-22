import React, { useState } from "react";
import api from "../Authentication/api";
import { useNavigate } from "react-router-dom";
// import logo from '../../public/LOGO3.png'
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/login", { email, password });
      localStorage.setItem("isAdminLoggedIn", "true");

      navigate("/admin"); // redirect after success
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      {/* Google Font */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');`}
      </style>

      <form style={styles.card} onSubmit={handleLogin}>
        <div style={styles.header}>
  <img
    src="/LOGO3.png"
    alt="Talent Assess Logo"
    style={styles.logo}
  />
  <h2 style={styles.title}>Admin Login</h2>
  <p style={styles.subtitle}>Sign in to Talent Assess Dashboard</p>
</div>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            placeholder="admin@test.com"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading} style={styles.loginBtn}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div style={styles.divider}>
          <span>OR</span>
        </div>

        <button
          type="button"
          onClick={() => navigate("/signup")}
          style={styles.signupBtn}
        >
          Create Admin Account
        </button>
      </form>
    </div>
  );
}

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
    maxWidth: 420,
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
    marginBottom: 10,
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
    transition: "all .2s",
  },
  loginBtn: {
    marginTop: 8,
    padding: "12px",
    borderRadius: 12,
    border: "none",
    background: "#2ecc71",
    color: "white",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all .2s",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 12,
    color: "#a0aec0",
  },
  signupBtn: {
    padding: "11px",
    borderRadius: 12,
    border: "1px solid #0f3b66",
    background: "white",
    color: "#0f3b66",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    color: "#e53e3e",
    fontSize: 13,
    textAlign: "center",
  },
};
