import { useEffect, useState, useMemo } from "react";
import axios from "axios";

// ---------------- DEBOUNCE HOOK ----------------
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function Question() {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search);

  // ---------------- FETCH EXAMS ----------------
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/exams")
      .then((res) => {
        setExams(res.data.data || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  // ---------------- FILTER LOGIC ----------------
  const filteredExams = useMemo(() => {
    return exams.filter((exam) =>
      exam.exam_name
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch, exams]);

  // ---------------- HIGHLIGHT TEXT ----------------
  const highlightText = (text, search) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return text.replace(regex, `<mark>$1</mark>`);
  };

  return (
    <div className="exam-wrapper">
      {/* ---------------- HEADER ---------------- */}
      <div className="exam-header">
        <h2>📋 Exams List</h2>
        <input
          type="text"
          placeholder="Search exam name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ---------------- TABLE ---------------- */}
      <div className="table-container">
        {loading ? (
          <p className="loading">Loading exams...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Exam Name</th>
                <th>Exam Code</th>
                <th>Subject ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.length === 0 ? (
                <tr>
                  <td colSpan="3" className="no-data">
                    No exams found
                  </td>
                </tr>
              ) : (
                filteredExams.map((exam, index) => (
                  <tr key={index}>
                    <td
                      dangerouslySetInnerHTML={{
                        __html: highlightText(
                          exam.exam_name,
                          debouncedSearch
                        ),
                      }}
                    />
                    <td className="code">{exam.exam_code}</td>
                    <td>{exam.subject_id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ---------------- STYLES ---------------- */}
      <style>{`
        .exam-wrapper {
          padding: 20px;
          background: #f4f7fb;
          min-height: 100vh;
        }

        .exam-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          gap: 10px;
          flex-wrap: wrap;
        }

        .exam-header h2 {
          margin: 0;
          color: #1a202c;
        }

        .exam-header input {
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          min-width: 220px;
          outline: none;
        }

        .exam-header input:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 2px rgba(79,70,229,0.2);
        }

        .table-container {
          background: white;
          border-radius: 12px;
          overflow-x: auto;
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px;
        }

        th {
          background: #4f46e5;
          color: white;
          padding: 14px;
          text-align: left;
          font-size: 14px;
        }

        td {
          padding: 14px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }

        tr:hover {
          background: #f1f5ff;
        }

        .code {
          font-weight: 600;
          color: #0f766e;
        }

        mark {
          background: #fde68a;
          padding: 0 4px;
          border-radius: 4px;
        }

        .no-data {
          text-align: center;
          padding: 20px;
          color: #64748b;
        }

        .loading {
          padding: 20px;
        }

        /* ---------------- RESPONSIVE ---------------- */
        @media (max-width: 768px) {
          .exam-header {
            flex-direction: column;
            align-items: stretch;
          }

          .exam-header input {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
