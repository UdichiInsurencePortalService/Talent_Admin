import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Candidates = () => {
  const [email, setEmail] = useState("");
  const [examCode, setExamCode] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [loading, setLoading] = useState(false);

  const sendLink = async () => {
    if (!email || !examCode || !candidateName) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "https://talent-assess.in/api/exam/send-link",
        {
          email,
          exam_code: examCode,
          name: candidateName
        }
      );

      toast.success("📧 Exam & Attendance link sent successfully");

      setEmail("");
      setExamCode("");
      setCandidateName("");

    } catch (err) {
      toast.error("❌ Failed to send email");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>

      <ToastContainer />

      <div style={styles.card}>
        <h2 style={styles.title}>Send Exam Link</h2>

        

        <input
          type="text"
          placeholder="Enter Exam Code"
          value={examCode}
          onChange={(e) => setExamCode(e.target.value)}
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Enter Candidate Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={sendLink}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Exam Link"}
        </button>

      </div>
    </div>
  );
};

const styles = {

  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    background: "#f1f5f9"
  },

  card: {
    background: "#fff",
    padding: 35,
    width: 380,
    borderRadius: 10,
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: 15
  },

  title: {
    textAlign: "center",
    marginBottom: 10
  },

  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14
  },

  button: {
    padding: 12,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold"
  }

};

export default Candidates;