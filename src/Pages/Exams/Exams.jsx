import { useState } from "react";
import {
  VideoCameraOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LineChartOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Modal, Input, Button, Upload, message } from "antd";
import axios from "axios";
import Livemonitoring from "./Livemonitoring";

/*
|--------------------------------------------------------------------------
| Exams Component
|--------------------------------------------------------------------------
| 1. Create Exam  -> Upload PDF (questions)
| 2. Schedule Exam -> Date, Time, Exam Code
|--------------------------------------------------------------------------
*/

export const Exams = () => {
  /* ================= CREATE EXAM STATES ================= */
  const [createExamOpen, setCreateExamOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const [examName, setExamName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [duration, setDuration] = useState("");
  const [pdfFile, setPdfFile] = useState(null);

  /* ================= SCHEDULE EXAM STATES ================= */
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const [examCode, setExamCode] = useState("");
  const [scheduleExamName, setScheduleExamName] = useState("");
  const [scheduleSubject, setScheduleSubject] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examTime, setExamTime] = useState("");
  const [scheduleDuration, setScheduleDuration] = useState("");
  const [assessorName, setassessorName] = useState("");


  /* ================= CREATE EXAM SUBMIT ================= */
  const ALLOWED_FILE_TYPES = [
  "application/pdf",                                   // PDF
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
  "application/vnd.ms-excel",                           // XLS
  "text/csv",                                           // CSV
  "application/json"                                    // JSON
];

  const handleCreateExam = async () => {
    if (!examName || !subjectName || !duration || !pdfFile) {
      message.error("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("examName", examName);
    formData.append("subjectName", subjectName);
    formData.append("duration", duration);
    formData.append("pdf", pdfFile);

    try {
      setCreateLoading(true);
      await axios.post("https://talent-backend-i83x.onrender.com/api/create-exam", formData, {
        withCredentials: true,
      });

      message.success("✅ Exam created successfully");

      // reset
      setExamName("");
      setSubjectName("");
      setDuration("");
      setPdfFile(null);
      setCreateExamOpen(false);
    } catch (err) {
      message.error("❌ Failed to create exam");
    } finally {
      setCreateLoading(false);
    }
  };

  /* ================= SCHEDULE EXAM SUBMIT ================= */
 const handleScheduleExam = async () => {
  if (
    !examCode ||
    !scheduleExamName ||
    !scheduleSubject ||
    !examDate ||
    !examTime ||
    !scheduleDuration ||
    !assessorName
  ) {
    message.error("Please fill all schedule fields");
    return;
  }

  try {
    setScheduleLoading(true);

    await axios.post(
      "https://talent-backend-i83x.onrender.com/api/schedule-exam",
      {
        exam_code: examCode,
        exam_name: scheduleExamName,
        subject_name: scheduleSubject,
        exam_date: examDate,
        exam_time: examTime,
        duration_minutes: Number(scheduleDuration),
        assessor_name: assessorName,
      },
      { withCredentials: true }
    );

    message.success("📅 Exam scheduled successfully");

    // reset
    setExamCode("");
    setScheduleExamName("");
    setScheduleSubject("");
    setExamDate("");
    setExamTime("");
    setScheduleDuration("");
    setassessorName("");
    setScheduleOpen(false);
  } catch (err) {
    message.error("❌ Failed to schedule exam");
  } finally {
    setScheduleLoading(false);
  }
};
// 🔹 POST schedule exam
      

  return (
    <>
      {/* ================= DASHBOARD CARDS ================= */}
    {/* ================= EXAM ACTION CARDS ================= */}
<div className="exam-grid">

  <div className="exam-action-card create" onClick={() => setCreateExamOpen(true)}>
    <div className="icon-box">
      <FileTextOutlined />
    </div>
    <h3>Create Exam</h3>
    <p>Upload questions and create a new exam</p>
  </div>

  <div className="exam-action-card schedule" onClick={() => setScheduleOpen(true)}>
    <div className="icon-box">
      <VideoCameraOutlined />
    </div>
    <h3>Schedule Exam</h3>
    <p>Set date & time for the exam</p>
  </div>

  <div className="exam-action-card live">
    <div className="icon-box">
      <DashboardOutlined />
    </div>
    <h3>Live Monitoring</h3>
    <p>Track students during exams</p>
    <Livemonitoring/>
  </div>

  <div className="exam-action-card result">
    <div className="icon-box">
      <LineChartOutlined />
    </div>
    <h3>Results</h3>
    <p>View exam performance & scores</p>
  </div>

</div>


      {/* ================= CREATE EXAM MODAL ================= */}
      <Modal
        title="Create Exam (Upload Questions PDF)"
        open={createExamOpen}
        onCancel={() => setCreateExamOpen(false)}
        footer={null}
        centered
      >
        <Input
          placeholder="Exam Name"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
        />
        <Input
          placeholder="Subject Name"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          style={{ marginTop: 10 }}
        />
        <Input
          type="number"
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          style={{ marginTop: 10 }}
        />

        <Upload
  beforeUpload={(file) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      message.error(
        "Only PDF, Excel (.xlsx/.csv) or JSON files are allowed"
      );
      return Upload.LIST_IGNORE;
    }

    setPdfFile(file); // keep variable name OR rename to uploadedFile
    return false; // prevent auto upload
  }}
  maxCount={1}
  style={{ marginTop: 10 }}
>
  <Button icon={<UploadOutlined />}>
    Upload Questions File (PDF / Excel / JSON)
  </Button>
</Upload>


        <Button
          type="primary"
          loading={createLoading}
          onClick={handleCreateExam}
          style={{ marginTop: 15, width: "100%" }}
        >
          Create Exam
        </Button>
      </Modal>

      {/* ================= SCHEDULE EXAM MODAL ================= */}
      <Modal
        title="Schedule Exam"
        open={scheduleOpen}
        onCancel={() => setScheduleOpen(false)}
        footer={null}
        centered
      >
        {/* 🔹 Exam Code */}
        <Input
          placeholder="Exam Code (ex: auto_mechanic_01)"
          value={examCode}
          onChange={(e) => setExamCode(e.target.value)}
        />

        {/* 🔹 Exam Name */}
        <Input
          placeholder="Exam Name"
          value={scheduleExamName}
          onChange={(e) => setScheduleExamName(e.target.value)}
          style={{ marginTop: 10 }}
        />

        {/* 🔹 Subject */}
        <Input
          placeholder="Subject Name"
          value={scheduleSubject}
          onChange={(e) => setScheduleSubject(e.target.value)}
          style={{ marginTop: 10 }}
        />

        {/* 🔹 Date */}
        <Input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          style={{ marginTop: 10 }}
        />

        {/* 🔹 Time */}
        <Input
          type="time"
          value={examTime}
          onChange={(e) => setExamTime(e.target.value)}
          style={{ marginTop: 10 }}
        />

        {/* 🔹 Duration */}
        <Input
          type="number"
          placeholder="Duration (minutes)"
          value={scheduleDuration}
          onChange={(e) => setScheduleDuration(e.target.value)}
          style={{ marginTop: 10 }}
        />
       <Input
  type="text"
  placeholder="Assessor Name"
  value={assessorName}
  onChange={(e) => setassessorName(e.target.value)}
  style={{ marginTop: 10 }}
/>


        <Button
          type="primary"
          loading={scheduleLoading}
          onClick={handleScheduleExam}
          style={{ marginTop: 15, width: "100%" }}
        >
          Schedule Exam
        </Button>
      </Modal>

      {/* ================= STYLES ================= */}
      <style>{`
        .exam-card{
          background:#fff;
          border-radius:14px;
          padding:30px;
          border:1px solid #e2e8f0;
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:10px;
          cursor:pointer;
          transition:0.3s;
          font-weight:600;
        }
        .exam-card:hover{
          transform:translateY(-4px);
          box-shadow:0 10px 20px rgba(0,0,0,0.08);
        }

        /* ================= GRID LAYOUT ================= */
.exam-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

/* ================= CARD BASE ================= */
.exam-action-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 28px;
  cursor: pointer;
  transition: all 0.35s ease;
  border: 1px solid #e6edf5;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  overflow: hidden;
}

.exam-action-card h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1a202c;
}

.exam-action-card p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

/* ================= ICON BOX ================= */
.icon-box {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  margin-bottom: 6px;
}

/* ================= HOVER EFFECT ================= */
.exam-action-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
}

/* ================= CARD VARIANTS ================= */

/* Create Exam */
.exam-action-card.create {
  background: linear-gradient(135deg, #eef2ff, #ffffff);
}
.exam-action-card.create .icon-box {
  background: #4f46e5;
  color: #ffffff;
}

/* Schedule Exam */
.exam-action-card.schedule {
  background: linear-gradient(135deg, #ecfeff, #ffffff);
}
.exam-action-card.schedule .icon-box {
  background: #06b6d4;
  color: #ffffff;
}

/* Live Monitoring */
.exam-action-card.live {
  background: linear-gradient(135deg, #ecfdf5, #ffffff);
}
.exam-action-card.live .icon-box {
  background: #10b981;
  color: #ffffff;
}

/* Results */
.exam-action-card.result {
  background: linear-gradient(135deg, #fff7ed, #ffffff);
}
.exam-action-card.result .icon-box {
  background: #f97316;
  color: #ffffff;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 992px) {
  .exam-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .exam-grid {
    grid-template-columns: 1fr;
  }

  .exam-action-card {
    padding: 22px;
  }
}

      `}</style>
    </>
  );
};
