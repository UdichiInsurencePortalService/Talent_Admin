import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Table,
  Modal,
  Image,
  Tag,
  Spin,
  message,
  Input,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./attendance.css"; // animation css

const Attendence = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  /* ================= FETCH ATTENDANCE ================= */
  const fetchAttendance = async () => {
    try {
      const res = await axios.get("https://talent-backend-i83x.onrender.com/api/attendance");
      setData(res.data.data || []);
    } catch (err) {
      message.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  /* ================= DEBOUNCE SEARCH ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /* ================= FILTERED DATA ================= */
  const filteredData = useMemo(() => {
    if (!debouncedSearch) return data;

    return data.filter((item) =>
      item.exam_code?.toLowerCase().includes(debouncedSearch)
    );
  }, [data, debouncedSearch]);

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      title: "Exam Code",
      dataIndex: "exam_code",
      key: "exam_code",
      fixed: "left",
      width: 130,
    },
    {
      title: "Institution",
      dataIndex: "institution_name",
      key: "institution_name",
      width: 180,
    },
    {
      title: "Candidate Name",
      dataIndex: "full_name",
      key: "full_name",
      width: 180,
    },
    {
      title: "Father Name",
      dataIndex: "father_name",
      key: "father_name",
      width: 180,
    },
    {
      title: "Mobile",
      dataIndex: "mobile_number",
      key: "mobile_number",
      width: 140,
    },
    {
      title: "Aadhar",
      dataIndex: "aadhar_number",
      key: "aadhar_number",
      width: 160,
      render: (val) => (val ? `XXXX-XXXX-${val.slice(-4)}` : "-"),
    },
    {
      title: "Photo",
      key: "photo",
      width: 120,
      render: (_, record) =>
        record.photo_url ? (
          <Image
            src={record.photo_url}
            width={50}
            height={50}
            style={{ borderRadius: 8, cursor: "pointer" }}
            preview={false}
            onClick={() => {
              setPreviewImage(record.photo_url);
              setPreviewOpen(true);
            }}
          />
        ) : (
          "No Photo"
        ),
    },
    {
      title: "Location Status",
      key: "attendance_status",
      width: 160,
      render: (_, record) =>
        record.attendance_status === "IN_CENTER" ? (
          <Tag color="green">Inside Center</Tag>
        ) : (
          <Tag color="red">Outside Center</Tag>
        ),
    },
    {
      title: "Date & Time",
      dataIndex: "created_at",
      key: "created_at",
      width: 200,
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* ================= HEADER + SEARCH ================= */}
      <div className="attendance-header">
        <h2>📋 Attendance Records</h2>

        <Input
          allowClear
          placeholder="Search by Exam Code"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="attendance-search"
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        bordered
        scroll={{ x: 1300 }}
        pagination={{
          pageSize: 8,
          showTotal: (total) => `Total ${total} records`,
        }}
        style={{
          background: "#fff",
          borderRadius: 12,
          marginTop: 16,
        }}
      />

      {/* ================= IMAGE PREVIEW MODAL ================= */}
      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        centered
      >
        <Image
          src={previewImage}
          alt="Attendance Photo"
          style={{ width: "100%", borderRadius: 12 }}
        />
      </Modal>
    </div>
  );
};

export default Attendence;
