import { useState } from "react";
import {
  VideoCameraOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LineChartOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "./Exam.css";
import { Modal, Input, Button, Upload, message } from "antd";
import axios from "axios";
import LiveMonitoring from "./Livemonitoring"; // ✅ REQUIRED

export const Exams = () => {
  /* ================= CREATE EXAM ================= */
  const [createExamOpen, setCreateExamOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [examName, setExamName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [duration, setDuration] = useState("");
  const [pdfFile, setPdfFile] = useState(null);

  /* ================= SCHEDULE EXAM ================= */
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [examCode, setExamCode] = useState("");
  const [scheduleExamName, setScheduleExamName] = useState("");
  const [scheduleSubject, setScheduleSubject] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examTime, setExamTime] = useState("");
  const [scheduleDuration, setScheduleDuration] = useState("");
  const [assessorName, setassessorName] = useState("");

  /* ================= LIVE MONITORING ================= */
  const [liveOpen, setLiveOpen] = useState(false);
  const [liveExamCode, setLiveExamCode] = useState("");

  /* ================= CREATE EXAM SUBMIT ================= */
  const handleCreateExam = async () => {
    if (!examName || !subjectName || !duration || !pdfFile) {
      message.error("Fill all fields");
      return;
    }

    const fd = new FormData();
    fd.append("examName", examName);
    fd.append("subjectName", subjectName);
    fd.append("duration", duration);
    fd.append("pdf", pdfFile);

    try {
      setCreateLoading(true);
      await axios.post("https://talent-backend-i83x.onrender.com/api/create-exam", fd);
      message.success("Exam created");
      setCreateExamOpen(false);
    } catch {
      message.error("Create exam failed");
    } finally {
      setCreateLoading(false);
    }
  };

  /* ================= SCHEDULE EXAM SUBMIT ================= */
  const handleScheduleExam = async () => {
    if (!examCode || !scheduleExamName || !examDate || !examTime) {
      message.error("Fill schedule fields");
      return;
    }

    try {
      setScheduleLoading(true);
      await axios.post("https://talent-backend-i83x.onrender.com/api/schedule-exam", {
        exam_code: examCode,
        exam_name: scheduleExamName,
        subject_name: scheduleSubject,
        exam_date: examDate,
        exam_time: examTime,
        duration_minutes: scheduleDuration,
        assessor_name: assessorName,
      });
      message.success("Exam scheduled");
      setScheduleOpen(false);
    } catch {
      message.error("Schedule failed");
    } finally {
      setScheduleLoading(false);
    }
  };

  return (
    <>
      {/* ================= DASHBOARD CARDS ================= */}
      <div className="exam-grid">
        {/* CREATE */}
        <div
          className="exam-action-card create"
          onClick={() => setCreateExamOpen(true)}
        >
          <div className="icon-box">
            <FileTextOutlined />
          </div>
          <h3>Create Exam</h3>
          <p>Upload questions</p>
        </div>

        {/* SCHEDULE */}
        <div
          className="exam-action-card schedule"
          onClick={() => setScheduleOpen(true)}
        >
          <div className="icon-box">
            <VideoCameraOutlined />
          </div>
          <h3>Schedule Exam</h3>
          <p>Set date & time</p>
        </div>

        {/* ✅ LIVE MONITORING (THIS WAS MISSING) */}
        <div
          className="exam-action-card live"
          onClick={() => setLiveOpen(true)}
        >
          <div className="icon-box">
            <DashboardOutlined />
          </div>
          <h3>Live Monitoring</h3>
          <p>Track students during exam</p>
        </div>

        {/* RESULTS */}
        <div className="exam-action-card result">
          <div className="icon-box">
            <LineChartOutlined />
          </div>
          <h3>Results</h3>
          <p>View scores</p>
        </div>
      </div>

      {/* ================= LIVE MONITORING MODAL ================= */}
      <Modal
        title="Live Monitoring"
        open={liveOpen}
        onCancel={() => setLiveOpen(false)}
        footer={null}
        width={900}
      >
        <Input
          placeholder="Enter Exam Code"
          value={liveExamCode}
          onChange={(e) => setLiveExamCode(e.target.value)}
          style={{ marginBottom: 12 }}
        />

        {liveExamCode && <LiveMonitoring examCode={liveExamCode} />}
      </Modal>

      {/* ================= CREATE EXAM MODAL ================= */}
      <Modal
        title="Create Exam"
        open={createExamOpen}
        onCancel={() => setCreateExamOpen(false)}
        footer={null}
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
          placeholder="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          style={{ marginTop: 10 }}
        />

        <Upload beforeUpload={(f) => (setPdfFile(f), false)}>
          <Button icon={<UploadOutlined />}>Upload Questions</Button>
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
      >
        <Button
          type="primary"
          loading={scheduleLoading}
          onClick={handleScheduleExam}
          style={{ width: "100%" }}
        >
          Schedule Exam
        </Button>
      </Modal>
    </>
  );
};
