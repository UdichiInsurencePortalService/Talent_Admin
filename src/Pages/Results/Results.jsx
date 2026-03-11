import React, { useEffect, useState } from "react";
import axios from "axios";

const Results = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://talent-assess.in/api/results");
      if (res.data.success) {
        setResults(res.data.data);
        setFilteredResults(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (!search) {
        setFilteredResults(results);
      } else {
        const filtered = results.filter((item) =>
          item.exam_code?.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredResults(filtered);
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [search, results]);

  const passCount = results.filter((r) => r.result === "PASS").length;
  const failCount = results.filter((r) => r.result === "FAIL").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .results-page {
          min-height: 100vh;
          background: #0a0a0f;
          font-family: 'DM Mono', monospace;
          padding: 48px 32px;
          position: relative;
          overflow-x: hidden;
        }

        .results-page::before {
          content: '';
          position: fixed;
          top: -200px;
          right: -200px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .results-page::after {
          content: '';
          position: fixed;
          bottom: -200px;
          left: -100px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .results-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* HEADER */
        .results-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 24px;
        }

        .header-left h1 {
          font-family: 'Syne', sans-serif;
          font-size: 42px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -1px;
          line-height: 1;
        }

        .header-left h1 span {
          color: #6366f1;
        }

        .header-left p {
          font-size: 13px;
          color: #52525b;
          margin-top: 8px;
          letter-spacing: 0.5px;
        }

        /* STATS PILLS */
        .stats-bar {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .stat-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid;
        }

        .stat-pill.total {
          background: rgba(99, 102, 241, 0.1);
          border-color: rgba(99, 102, 241, 0.3);
          color: #a5b4fc;
        }

        .stat-pill.pass {
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.3);
          color: #6ee7b7;
        }

        .stat-pill.fail {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .stat-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .stat-pill.total .stat-dot { background: #6366f1; }
        .stat-pill.pass .stat-dot { background: #10b981; }
        .stat-pill.fail .stat-dot { background: #ef4444; }

        /* SEARCH */
        .search-section {
          margin-bottom: 28px;
        }

        .search-wrapper {
          position: relative;
          max-width: 420px;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #52525b;
          font-size: 16px;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          background: #111118;
          border: 1px solid #27272a;
          border-radius: 10px;
          padding: 13px 16px 13px 44px;
          color: #e4e4e7;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .search-input::placeholder { color: #3f3f46; }

        .search-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }

        /* TABLE CONTAINER */
        .table-container {
          background: #111118;
          border: 1px solid #1c1c27;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
        }

        .table-scroll {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        /* THEAD */
        thead {
          background: #0d0d14;
          border-bottom: 1px solid #1c1c27;
        }

        thead th {
          padding: 16px 20px;
          text-align: left;
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: #52525b;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          white-space: nowrap;
        }

        /* TBODY */
        tbody tr {
          border-bottom: 1px solid #18181f;
          transition: background 0.15s;
          animation: rowFade 0.4s ease forwards;
          opacity: 0;
        }

        @keyframes rowFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        tbody tr:nth-child(1) { animation-delay: 0.03s; }
        tbody tr:nth-child(2) { animation-delay: 0.06s; }
        tbody tr:nth-child(3) { animation-delay: 0.09s; }
        tbody tr:nth-child(4) { animation-delay: 0.12s; }
        tbody tr:nth-child(5) { animation-delay: 0.15s; }

        tbody tr:hover { background: #16161f; }
        tbody tr:last-child { border-bottom: none; }

        tbody td {
          padding: 15px 20px;
          color: #a1a1aa;
          white-space: nowrap;
          vertical-align: middle;
        }

        /* SPECIAL CELLS */
        .cell-id {
          color: #3f3f46;
          font-size: 12px;
        }

        .cell-code {
          font-family: 'DM Mono', monospace;
          font-weight: 500;
          color: #c4b5fd;
          letter-spacing: 0.5px;
        }

        .cell-name {
          color: #e4e4e7;
          font-weight: 500;
        }

        .cell-mobile {
          color: #71717a;
          font-size: 12px;
        }

        .badge-lang {
          display: inline-block;
          padding: 3px 10px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 100px;
          color: #a5b4fc;
          font-size: 11px;
          letter-spacing: 0.3px;
        }

        .marks-total { color: #71717a; }
        .marks-obtained { color: #e4e4e7; font-weight: 500; }

        .badge-result {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          font-family: 'Syne', sans-serif;
        }

        .badge-result.pass {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #6ee7b7;
        }

        .badge-result.fail {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .badge-result::before {
          content: '';
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }

        .badge-result.pass::before { background: #10b981; }
        .badge-result.fail::before { background: #ef4444; }

        .cell-time {
          color: #52525b;
          font-size: 12px;
        }

        .cell-reason {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #52525b;
          font-size: 12px;
        }

        .cell-date {
          color: #3f3f46;
          font-size: 12px;
        }

        /* EMPTY STATE */
        .empty-state {
          text-align: center;
          padding: 80px 24px;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.3;
        }

        .empty-state p {
          color: #3f3f46;
          font-size: 14px;
        }

        /* LOADER */
        .loader-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 100px 24px;
        }

        .loader {
          width: 36px;
          height: 36px;
          border: 2px solid #1c1c27;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loader-wrap p {
          color: #3f3f46;
          font-size: 13px;
          letter-spacing: 0.5px;
        }

        /* TABLE FOOTER */
        .table-footer {
          padding: 14px 20px;
          background: #0d0d14;
          border-top: 1px solid #1c1c27;
          color: #3f3f46;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        @media (max-width: 768px) {
          .results-page { padding: 28px 16px; }
          .header-left h1 { font-size: 28px; }
          .results-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="results-page">
        <div className="results-wrapper">

          {/* HEADER */}
          <div className="results-header">
            <div className="header-left">
              <h1>Exam <span>Results</span></h1>
              <p>Candidate performance overview · All sessions</p>
            </div>
            <div className="stats-bar">
              <div className="stat-pill total">
                <span className="stat-dot" />
                {results.length} Total
              </div>
              <div className="stat-pill pass">
                <span className="stat-dot" />
                {passCount} Passed
              </div>
              <div className="stat-pill fail">
                <span className="stat-dot" />
                {failCount} Failed
              </div>
            </div>
          </div>

          {/* SEARCH */}
          <div className="search-section">
            <div className="search-wrapper">
              <span className="search-icon">⌕</span>
              <input
                className="search-input"
                type="text"
                placeholder="Search by exam code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* TABLE CARD */}
          <div className="table-container">
            {loading ? (
              <div className="loader-wrap">
                <div className="loader" />
                <p>Fetching results...</p>
              </div>
            ) : (
              <>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Exam Code</th>
                        <th>Candidate Name</th>
                        <th>Father Name</th>
                        <th>Mobile</th>
                        <th>Language</th>
                        <th>Total Marks</th>
                        <th>Obtained</th>
                        <th>Result</th>
                        <th>Time Taken</th>
                        <th>Reason</th>
                        <th>Submitted At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResults.length > 0 ? (
                        filteredResults.map((item) => (
                          <tr key={item.id}>
                            <td className="cell-id">{item.id}</td>
                            <td className="cell-code">{item.exam_code}</td>
                            <td className="cell-name">{item.candidate_name}</td>
                            <td>{item.father_name}</td>
                            <td className="cell-mobile">{item.mobile_number}</td>
                            <td>
                              <span className="badge-lang">{item.language}</span>
                            </td>
                            <td className="marks-total">{item.total_marks}</td>
                            <td className="marks-obtained">{item.obtained_marks}</td>
                            <td>
                              <span className={`badge-result ${item.result === "PASS" ? "pass" : "fail"}`}>
                                {item.result}
                              </span>
                            </td>
                            <td className="cell-time">{item.time_taken}s</td>
                            <td className="cell-reason" title={item.reason}>{item.reason || "—"}</td>
                            <td className="cell-date">
                              {new Date(item.submitted_at).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="12">
                            <div className="empty-state">
                              <div className="empty-icon">◎</div>
                              <p>No results found{search ? ` for "${search}"` : ""}</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="table-footer">
                  <span>Showing {filteredResults.length} of {results.length} records</span>
                  {search && <span>Filtered by: <strong style={{color:"#6366f1"}}>{search}</strong></span>}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default Results;