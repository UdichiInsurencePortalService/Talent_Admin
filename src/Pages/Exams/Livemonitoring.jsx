import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

const Livemonitoring = ({ examCode }) => {
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState({});

  useEffect(() => {
    if (!examCode) return;

    // ✅ ADMIN JOINS ADMIN ROOM
    socket.emit("join_admin", { examCode });

    // ✅ LISTEN TO ADMIN EVENTS
    socket.on("admin_event", (data) => {
      if (!data.userId) return;

      setEvents((prev) => [data, ...prev.slice(0, 50)]);

      setStudents((prev) => {
        const prevStudent = prev[data.userId] || {
          warnings: 0,
          lastEvent: "connected",
        };

        return {
          ...prev,
          [data.userId]: {
            lastEvent: data.type,
            warnings:
              data.type === "warning"
                ? prevStudent.warnings + 1
                : prevStudent.warnings,
          },
        };
      });
    });

    return () => {
      socket.off("admin_event");
    };
  }, [examCode]);

  return (
    <div style={{ padding: 20 }}>
      <h2>🛡 Live Monitoring – {examCode}</h2>

      {/* STUDENT GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
          marginTop: 20,
        }}
      >
        {Object.entries(students).map(([id, s]) => (
          <div
            key={id}
            style={{
              borderRadius: 12,
              padding: 14,
              background:
                s.warnings >= 3
                  ? "#fee2e2"
                  : s.warnings >= 1
                  ? "#fef3c7"
                  : "#ecfdf5",
              border: "1px solid #e5e7eb",
            }}
          >
            <h4>👤 {id}</h4>
            <p>⚠️ Warnings: {s.warnings}</p>
            <p>📌 Status: {s.lastEvent}</p>
          </div>
        ))}
      </div>

      {/* EVENT LOG */}
      <h3 style={{ marginTop: 30 }}>📡 Live Events</h3>
      <ul>
        {events.map((e, i) => (
          <li key={i}>
            <strong>{e.userId}</strong> → {e.type}
            {e.reason ? ` (${e.reason})` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Livemonitoring;
