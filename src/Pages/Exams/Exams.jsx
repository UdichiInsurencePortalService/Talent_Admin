import { useState } from "react";
import {
  VideoCameraOutlined,
  FileTextOutlined,
  LineChartOutlined,
  DashboardOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "./Exam.css";
import { Modal, Input, Button, Upload, message } from "antd";
import axios from "axios";
import LiveMonitoring from "./Livemonitoring";

export const Exams = () => {
  /* ================= CREATE EXAM STATE ================= */
  const [createExamOpen, setCreateExamOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [examName, setExamName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [duration, setDuration] = useState("");
  const [pdfFile, setPdfFile] = useState(null);

  /* ================= SCHEDULE EXAM STATE ================= */
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [examCode, setExamCode] = useState("");
  const [scheduleExamName, setScheduleExamName] = useState("");
  const [scheduleSubject, setScheduleSubject] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examTime, setExamTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [assessorName, setAssessorName] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [centerCity, setCenterCity] = useState("");
  const [centerArea, setCenterArea] = useState("");
  const [centerLat, setCenterLat] = useState("");
  const [centerLng, setCenterLng] = useState("");
  const [allowedRadius, setAllowedRadius] = useState(100);

  /* ================= LIVE MONITORING STATE ================= */
  const [liveOpen, setLiveOpen] = useState(false);
  const [liveExamCode, setLiveExamCode] = useState("");

  /* ================= CREATE EXAM HANDLER ================= */
  const handleCreateExam = async () => {
    if (!examName || !subjectName || !duration || !pdfFile) {
      message.error("Please fill all fields and upload a PDF.");
      return;
    }

    const fd = new FormData();
    fd.append("examName", examName);
    fd.append("subjectName", subjectName);
    fd.append("duration", duration);
    fd.append("pdf", pdfFile);

    try {
      setCreateLoading(true);
      await axios.post("https://talent-assess.in/api/create-exam",);
      message.success("Exam created successfully!");
      setCreateExamOpen(false);
      // Reset fields
      setExamName("");
      setSubjectName("");
      setDuration("");
      setPdfFile(null);
    } catch {
      message.error("Failed to create exam. Please try again.");
    } finally {
      setCreateLoading(false);
    }
  };

  /* ================= SCHEDULE EXAM HANDLER ================= */
  const handleScheduleExam = async () => {
    if (!examCode || !scheduleExamName || !examDate || !examTime) {
      message.error("Please fill all required fields.");
      return;
    }

    try {
      setScheduleLoading(true);
      await axios.post("https://talent-assess.in/api/schedule-exam", {
        exam_code: examCode,
        exam_name: scheduleExamName,
        subject_name: scheduleSubject,
        exam_date: examDate,
        exam_time: examTime,
        duration_minutes: durationMinutes,
        assessor_name: assessorName,
        institution_name: institutionName,
        center_city: centerCity,
        center_area: centerArea,
        center_lat: centerLat,
        center_lng: centerLng,
        allowed_radius: allowedRadius || 100,
      });

      message.success("Exam scheduled successfully!");
      setScheduleOpen(false);
      // Reset fields
      setExamCode(""); setScheduleExamName(""); setScheduleSubject("");
      setExamDate(""); setExamTime(""); setDurationMinutes("");
      setAssessorName(""); setInstitutionName(""); setCenterCity("");
      setCenterArea(""); setCenterLat(""); setCenterLng(""); setAllowedRadius(100);
    } catch {
      message.error("Failed to schedule exam. Please try again.");
    } finally {
      setScheduleLoading(false);
    }
  };

  /* ================= UPLOAD CONFIG ================= */
  const uploadProps = {
    beforeUpload: (file) => {
      const isPDF = file.type === "application/pdf";
      if (!isPDF) {
        message.error("Only PDF files are allowed.");
        return Upload.LIST_IGNORE;
      }
      setPdfFile(file);
      return false; // Prevent auto-upload
    },
    maxCount: 1,
    accept: ".pdf",
  };

  /* ================= RENDER ================= */
  return (
    <>
      {/* ===== DASHBOARD CARDS ===== */}
      <div className="exam-page">
        <p className="exam-page-title">Exam Management</p>

        <div className="exam-grid">
          {/* Create Exam */}
          <div
            className="exam-action-card create"
            onClick={() => setCreateExamOpen(true)}
          >
            <div className="icon-box">
              <FileTextOutlined />
            </div>
            <h3>Create Exam</h3>
            <p>Upload questions via PDF</p>
          </div>

          {/* Schedule Exam */}
          <div
            className="exam-action-card schedule"
            onClick={() => setScheduleOpen(true)}
          >
            <div className="icon-box">
              <VideoCameraOutlined />
            </div>
            <h3>Schedule Exam</h3>
            <p>Set complete exam details</p>
          </div>

          {/* Live Monitoring */}
          <div
            className="exam-action-card live"
            onClick={() => setLiveOpen(true)}
          >
            <div className="icon-box">
              <DashboardOutlined />
            </div>
            <h3>Live Monitoring</h3>
            <p>Track students in real time</p>
          </div>

          {/* Results */}
          <div className="exam-action-card result">
            <div className="icon-box">
              <LineChartOutlined />
            </div>
            <h3>Results</h3>
            <p>View scores & analytics</p>
          </div>
        </div>
      </div>

      {/* ===== CREATE EXAM MODAL ===== */}
      <Modal
        title="Create New Exam"
        open={createExamOpen}
        onCancel={() => setCreateExamOpen(false)}
        footer={null}
        width={480}
        destroyOnClose
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
          <div className="field-group">
            <span className="modal-label">Exam Name *</span>
            <Input
              placeholder="e.g. Mathematics Final"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
            />
          </div>

          <div className="field-group">
            <span className="modal-label">Subject Name *</span>
            <Input
              placeholder="e.g. Mathematics"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
            />
          </div>

          <div className="field-group">
            <span className="modal-label">Duration (Minutes) *</span>
            <Input
              type="number"
              placeholder="e.g. 60"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div className="field-group">
            <span className="modal-label">Question Paper (PDF) *</span>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
                {pdfFile ? pdfFile.name : "Click to Upload PDF"}
              </Button>
            </Upload>
          </div>

          <Button
            type="primary"
            loading={createLoading}
            onClick={handleCreateExam}
            className="modal-submit-btn"
          >
            Create Exam
          </Button>
        </div>
      </Modal>

      {/* ===== SCHEDULE EXAM MODAL ===== */}
      <Modal
        title="Schedule Exam"
        open={scheduleOpen}
        onCancel={() => setScheduleOpen(false)}
        footer={null}
        width={650}
        destroyOnClose
      >
        <div className="modal-form-grid" style={{ marginTop: 12 }}>
          <div className="field-group">
            <span className="modal-label">Exam Code *</span>
            <Input placeholder="e.g. EX-2024-01" value={examCode}
              onChange={(e) => setExamCode(e.target.value)} />
          </div>

          <div className="field-group">
            <span className="modal-label">Exam Name *</span>
            <Input placeholder="e.g. Math Final" value={scheduleExamName}
              onChange={(e) => setScheduleExamName(e.target.value)} />
          </div>

          <div className="field-group">
            <span className="modal-label">Subject Name</span>
            <Input placeholder="e.g. Mathematics" value={scheduleSubject}
              onChange={(e) => setScheduleSubject(e.target.value)} />
          </div>

          <div className="field-group">
            <span className="modal-label">Duration (Minutes)</span>
            <Input type="number" placeholder="e.g. 120" value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)} />
          </div>

          <div className="field-group">
            <span className="modal-label">Exam Date *</span>
            <Input type="date" value={examDate}
              onChange={(e) => setExamDate(e.target.value)} />
          </div>

          <div className="field-group">
            <span className="modal-label">Exam Time *</span>
            <Input type="time" value={examTime}
              onChange={(e) => setExamTime(e.target.value)} />
          </div>

          <div className="field-group">
            <span className="modal-label">Assessor Name</span>
            <Input placeholder="e.g. Dr. Sharma" value={assessorName}
              onChange={(e) => setAssessorName(e.target.value)} />
          </div>

          <div className="field-group">
            <span className="modal-label">Institution Name</span>
            <Input placeholder="e.g. ABC College" value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)} />
          </div>

          <div className="field-group">
            <span className="modal-label">Center City</span>
            <Input placeholder="e.g. Delhi" value={centerCity}
              onChange={(e) => setCenterCity(e.target.value)} />
          </div>

          <div className="field-group">
            <span className="modal-label">Center Area</span>
            <Input placeholder="e.g. Connaught Place" value={centerArea}
              onChange={(e) => setCenterArea(e.target.value)} />
          </div>

          <div className="field-group">
            <span className="modal-label">Center Latitude</span>
            <Input type="number" placeholder="e.g. 28.6139" value={centerLat}
              onChange={(e) => setCenterLat(e.target.value)} />
          </div>

          <div className="field-group">
            <span className="modal-label">Center Longitude</span>
            <Input type="number" placeholder="e.g. 77.2090" value={centerLng}
              onChange={(e) => setCenterLng(e.target.value)} />
          </div>

          <div className="field-group full-width">
            <span className="modal-label">Allowed Radius (Meters)</span>
            <Input type="number" placeholder="Default: 100m" value={allowedRadius}
              onChange={(e) => setAllowedRadius(e.target.value)} />
          </div>

          <div className="full-width">
            <Button
              type="primary"
              loading={scheduleLoading}
              onClick={handleScheduleExam}
              className="modal-submit-btn"
            >
              Schedule Exam
            </Button>
          </div>
        </div>
      </Modal>

      {/* ===== LIVE MONITORING MODAL ===== */}
      <Modal
        title="Live Monitoring"
        open={liveOpen}
        onCancel={() => setLiveOpen(false)}
        footer={null}
        width={900}
        destroyOnClose
      >
        <div style={{ marginBottom: 12, display: "flex", gap: 10 }}>
          <Input
            placeholder="Enter Exam Code to monitor"
            value={liveExamCode}
            onChange={(e) => setLiveExamCode(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button type="primary" onClick={() => {}}>
            Load
          </Button>
        </div>
        {liveExamCode && <LiveMonitoring examCode={liveExamCode} />}
      </Modal>
    </>
  );
};