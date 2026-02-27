import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "./Livemonitoring.css";

const SOCKET_URL = "https://talent-backend-i83x.onrender.com";
const socket = io(SOCKET_URL, { transports: ["websocket"] });

export default function LiveMonitoring({ examCode }) {
  const [students, setStudents] = useState({});

  useEffect(() => {
    if (!examCode) return;

    console.log("🛡 ADMIN JOINED:", examCode);

    socket.emit("join_admin", { examCode });

    // Load already connected students
    axios
      .get(`${SOCKET_URL}/api/live-monitoring/${examCode}`)
      .then((res) => {
        const map = {};
        res.data.data.forEach((s) => {
          map[s.user_id] = {
            warnings: s.warnings || 0,
            last_event: s.last_event || "connected",
          };
        });
        setStudents(map);
      });

    socket.on("admin_event", (e) => {
      console.log("📡 EVENT:", e);

      setStudents((prev) => ({
        ...prev,
        [e.userId]: {
          warnings:
            e.type === "warning"
              ? (prev[e.userId]?.warnings || 0) + 1
              : prev[e.userId]?.warnings || 0,
          last_event: e.reason || e.type,
        },
      }));
    });

    return () => {
      socket.off("admin_event");
    };
  }, [examCode]);

  if (!Object.keys(students).length) {
    return <p style={{ textAlign: "center" }}>No students connected</p>;
  }

  return (
    <div className="grid">
      {Object.entries(students).map(([id, s]) => (
        <div
          key={id}
          className={`card ${
            s.warnings >= 3 ? "danger" : s.warnings ? "warn" : ""
          }`}
        >
          <h4>👤 {id}</h4>
          <p>⚠ Warnings: {s.warnings}</p>
          <p>📌 {s.last_event}</p>
        </div>
      ))}
    </div>
  );
}
