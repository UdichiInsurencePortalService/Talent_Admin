import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Table, Modal, Image, Tag, Spin, message, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const Attendence = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // ================= FETCH =================

  const fetchAttendance = async () => {
    try {
      const res = await axios.get("https://talent-assess.in/api/attendance");

      if (res.data.success) {
        setData(res.data.data);
      }
    } catch {
      message.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // ================= SEARCH =================

  const filteredData = useMemo(() => {
    if (!search) return data;

    return data.filter((item) =>
      item.exam_code?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  // ================= TABLE =================

  const columns = [
    {
      title: "Exam Code",
      dataIndex: "exam_code",
      width: 150,
    },
    {
      title: "Institution Name ",
      dataIndex: "institution_name",
      width: 300,
    },
    {
      title: "Candidate Name",
      dataIndex: "full_name",
      width: 280,
    },
    {
      title: "Father Name",
      dataIndex: "father_name",
      width: 380,
    },
    {
      title: "Mobile",
      dataIndex: "mobile_number",
      width: 150,
    },
    {
      title: "Aadhar",
      dataIndex: "aadhar_number",
      width: 250,
      render: (val) => `XXXX-XXXX-${val?.slice(-4)}`,
    },
    {
      title: "Photo",
      width: 120,
      render: (_, record) =>
        record.photo_url ? (
          <Image
            src={record.photo_url}
            width={50}
            height={50}
            style={{ borderRadius: 6, cursor: "pointer" }}
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
      title: "Location",
      width: 150,
      render: (_, record) =>
        record.attendance_status === "IN_CENTER" ? (
          <Tag color="green">Inside Center</Tag>
        ) : (
          <Tag color="red">Outside</Tag>
        ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      width: 200,
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 120 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2>Attendance Records</h2>

        <Input
          placeholder="Search Exam Code"
          prefix={<SearchOutlined />}
          allowClear
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 250 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        bordered
        scroll={{ x: 1200 }}
        pagination={{ pageSize: 8 }}
      />

      <Modal open={previewOpen} footer={null} onCancel={() => setPreviewOpen(false)}>
        <Image src={previewImage} style={{ width: "100%" }} />
      </Modal>
    </div>
  );
};

export default Attendence;