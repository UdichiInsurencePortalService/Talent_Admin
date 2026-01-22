import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const ITEMS_PER_PAGE = 20;

const Candidates = () => {
  const [file, setFile] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const[examCode,setExamCode] = useState("")

  /* =======================
     FETCH DATA
  ======================= */
  const fetchCandidates = async () => {
    const res = await axios.get("http://localhost:8080/api/candidates");
    setCandidates(res.data.data || []);
  };

  /* =======================
     DEBOUNCE SEARCH
  ======================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.toLowerCase());
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /* =======================
     FILTERED DATA
  ======================= */
  const filteredCandidates = useMemo(() => {
    return candidates.filter(
      (c) =>
        c.full_name?.toLowerCase().includes(debouncedSearch) ||
        c.institution_name?.toLowerCase().includes(debouncedSearch)
    );
  }, [candidates, debouncedSearch]);

  /* =======================
     PAGINATION
  ======================= */
  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);

  const paginatedData = filteredCandidates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* =======================
     FILE UPLOAD
  ======================= */
  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const form = new FormData();
    form.append("file", file);

    await axios.post(
      "http://localhost:8080/api/candidates/upload",
      form
    );

    alert("Uploaded successfully");
    setFile(null);
    fetchCandidates();
  };

  /* =======================
     REMOVE DATA
  ======================= */
  const handleRemoveData = () => {
    setCandidates([]);
    setShowTable(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>👥 Candidates Management</h2>

      {/* Upload Section */}
      <div style={styles.uploadBox}>
        <input
          type="file"
          accept=".pdf,.xlsx,.json"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {file && (
          <span style={styles.filePreview}>
            {file.name}
            <button onClick={() => setFile(null)} style={styles.crossBtn}>
              ❌
            </button>
          </span>
        )}

        <button onClick={handleUpload} style={styles.primaryBtn}>
          Upload
        </button>
      </div>

      {/* Action Bar */}
      <div style={styles.actionBar}>
        <input
          type="text"
          placeholder="🔍 Search by Name or Institution"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        <div>
          <button
            onClick={() => {
              fetchCandidates();
              setShowTable(true);
            }}
            style={styles.showBtn}
          >
            Show Data
          </button>

          <button onClick={handleRemoveData} style={styles.removeBtn}>
            Remove Data
          </button>
        </div>
      </div>

      {/* Table */}
      {showTable && (
        <>

<div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
  <input
    placeholder="Enter Exam Code"
    value={examCode}
    onChange={(e) => setExamCode(e.target.value)}
    style={styles.search}
  />

  <button
    style={styles.primaryBtn}
    onClick={async () => {
      if (!examCode) return alert("Enter exam code");

      await axios.post(
        "http://localhost:8080/api/exam/send-link",
        { exam_code: examCode }
      );

      alert("📧 Exam link sent to candidates");
    }}
  >
    Send Exam Link
  </button>
</div>


          <table style={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Father</th>
                <th>Aadhar</th>
                <th>Job Role</th>
                <th>Email</th>
                <th>Institution</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((c) => (
                  <tr key={c.id}>
                    <td>{c.full_name}</td>
                    <td>{c.father_name}</td>
                    <td>{c.aadhar_number}</td>
                    <td>{c.job_role}</td>
                    <td>{c.email}</td>
                    <td>{c.institution_name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                ◀ Prev
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next ▶
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

/* =======================
   STYLES
======================= */
const styles = {
  container: {
    padding: 30,
    background: "#f8fafc",
    borderRadius: 10,
  },
  title: {
    marginBottom: 20,
  },
  uploadBox: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  filePreview: {
    background: "#e2e8f0",
    padding: "4px 10px",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  crossBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
  primaryBtn: {
    padding: "6px 14px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  actionBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  search: {
    padding: 8,
    width: 300,
    borderRadius: 6,
    border: "1px solid #cbd5e1",
  },
  showBtn: {
    padding: "6px 14px",
    marginRight: 10,
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  removeBtn: {
    padding: "6px 14px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    gap: 20,
    marginTop: 15,
  },
};

export default Candidates;
