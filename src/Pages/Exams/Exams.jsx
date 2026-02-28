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
import LiveMonitoring from "./Livemonitoring";

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
  const [durationMinutes, setDurationMinutes] = useState("");
  const [assessorName, setAssessorName] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [centerCity, setCenterCity] = useState("");
  const [centerArea, setCenterArea] = useState("");
  const [centerLat, setCenterLat] = useState("");
  const [centerLng, setCenterLng] = useState("");
  const [allowedRadius, setAllowedRadius] = useState(100);

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
      message.error("Please fill required fields");
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
        duration_minutes: durationMinutes,
        assessor_name: assessorName,
        institution_name: institutionName,
        center_city: centerCity,
        center_area: centerArea,
        center_lat: centerLat,
        center_lng: centerLng,
        allowed_radius: allowedRadius || 100,
      });

      message.success("Exam Scheduled Successfully");
      setScheduleOpen(false);

      // Optional: reset fields after save
      setExamCode("");
      setScheduleExamName("");
      setScheduleSubject("");
      setExamDate("");
      setExamTime("");
      setDurationMinutes("");
      setAssessorName("");
      setInstitutionName("");
      setCenterCity("");
      setCenterArea("");
      setCenterLat("");
      setCenterLng("");
      setAllowedRadius(100);
    } catch (error) {
      message.error("Schedule failed");
    } finally {
      setScheduleLoading(false);
    }
  };

  return (
    <>
      {/* ================= DASHBOARD ================= */}
      <div className="exam-grid">
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

        <div
          className="exam-action-card live"
          onClick={() => setLiveOpen(true)}
        >
          <div className="icon-box">
            <DashboardOutlined />
          </div>
          <h3>Live Monitoring</h3>
          <p>Track students</p>
        </div>

        <div className="exam-action-card result">
          <div className="icon-box">
            <LineChartOutlined />
          </div>
          <h3>Results</h3>
          <p>View scores</p>
        </div>
      </div>

      {/* ================= SCHEDULE MODAL ================= */}
      <Modal
        title="Schedule Exam"
        open={scheduleOpen}
        onCancel={() => setScheduleOpen(false)}
        footer={null}
        width={650}
      >
        <Input placeholder="Exam Code" value={examCode}
          onChange={(e) => setExamCode(e.target.value)} style={{ marginBottom: 10 }} />

        <Input placeholder="Exam Name" value={scheduleExamName}
          onChange={(e) => setScheduleExamName(e.target.value)} style={{ marginBottom: 10 }} />

        <Input placeholder="Subject Name" value={scheduleSubject}
          onChange={(e) => setScheduleSubject(e.target.value)} style={{ marginBottom: 10 }} />

        <Input type="date" value={examDate}
          onChange={(e) => setExamDate(e.target.value)} style={{ marginBottom: 10 }} />

        <Input type="time" value={examTime}
          onChange={(e) => setExamTime(e.target.value)} style={{ marginBottom: 10 }} />

        <Input type="number" placeholder="Duration (Minutes)"
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(e.target.value)} style={{ marginBottom: 10 }} />

        <Input placeholder="Assessor Name"
          value={assessorName}
          onChange={(e) => setAssessorName(e.target.value)} style={{ marginBottom: 10 }} />

        <Input placeholder="Institution Name"
          value={institutionName}
          onChange={(e) => setInstitutionName(e.target.value)} style={{ marginBottom: 10 }} />

        <Input placeholder="Center City"
          value={centerCity}
          onChange={(e) => setCenterCity(e.target.value)} style={{ marginBottom: 10 }} />

        <Input placeholder="Center Area"
          value={centerArea}
          onChange={(e) => setCenterArea(e.target.value)} style={{ marginBottom: 10 }} />

        <Input type="number" placeholder="Center Latitude"
          value={centerLat}
          onChange={(e) => setCenterLat(e.target.value)} style={{ marginBottom: 10 }} />

        <Input type="number" placeholder="Center Longitude"
          value={centerLng}
          onChange={(e) => setCenterLng(e.target.value)} style={{ marginBottom: 10 }} />

        <Input type="number" placeholder="Allowed Radius (Meters)"
          value={allowedRadius}
          onChange={(e) => setAllowedRadius(e.target.value)} style={{ marginBottom: 15 }} />

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