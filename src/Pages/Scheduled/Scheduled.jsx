import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { message, Input, Badge, Spin } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import  "./scheduled.css";

const ScheduledExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [open, setOpen] = useState({
    upcoming: true,
    ongoing: false,
    completed: false,
  });

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.get(
          "https://talent-backend-i83x.onrender.com/api/scheduled-exams"
        );
        setExams(res.data.data || []);
      } catch {
        message.error("Failed to fetch scheduled exams");
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  /* ---------------- DEBOUNCE SEARCH ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.toLowerCase());
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  /* ---------------- FILTER + GROUP ---------------- */
  const grouped = useMemo(() => {
    const filtered = exams.filter((e) =>
      e.exam_code.toLowerCase().includes(debouncedSearch)
    );

    return {
      upcoming: filtered.filter((e) => e.status === "UPCOMING"),
      ongoing: filtered.filter((e) => e.status === "ONGOING"),
      completed: filtered.filter((e) => e.status === "COMPLETED"),
    };
  }, [exams, debouncedSearch]);

  /* ---------------- TABLE ---------------- */
 const Table = ({ data }) => (
  <div className="table-wrapper">
    <table className="exam-table">
      <thead>
        <tr>
          <th>Exam Code</th>
          <th>Exam Name</th>
          <th>Subject</th>
          <th>Exam Date</th>
          <th>Exam Time</th>
          <th>Duration</th>
          <th>Assessor</th>
          <th>Institution</th>
          <th>City</th>
          <th>Area</th>
          <th>Radius</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="12" className="empty">
              No exams available
            </td>
          </tr>
        ) : (
          data.map((e) => (
            <tr key={e.id}>
              <td>{e.exam_code}</td>
              <td>{e.exam_name}</td>
              <td>{e.subject_name}</td>

              <td>
                <CalendarOutlined />{" "}
                {new Date(e.exam_date).toLocaleDateString()}
              </td>

              <td>
                <ClockCircleOutlined /> {e.exam_time}
              </td>

              <td>{e.duration_minutes} mins</td>

              <td>
                <UserOutlined /> {e.assessor_name}
              </td>

              <td>{e.institution_name}</td>
              <td>{e.center_city}</td>
              <td>{e.center_area}</td>
              <td>{e.allowed_radius} m</td>

              <td>
                <span className={`status-pill ${e.status.toLowerCase()}`}>
                  {e.status}
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

  if (loading) {
    return (
      <div className="loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="page">
      <h1>
        <FileTextOutlined /> Scheduled Exams
      </h1>

      <Input
        size="large"
        placeholder="Search by exam code..."
        prefix={<SearchOutlined />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search"
      />

      <Section
        title="Upcoming Exams"
        count={grouped.upcoming.length}
        open={open.upcoming}
        toggle={() =>
          setOpen({ upcoming: !open.upcoming, ongoing: false, completed: false })
        }
      >
        <Table data={grouped.upcoming} />
      </Section>

      <Section
        title="Ongoing Exams"
        count={grouped.ongoing.length}
        open={open.ongoing}
        toggle={() =>
          setOpen({ upcoming: false, ongoing: !open.ongoing, completed: false })
        }
      >
        <Table data={grouped.ongoing} />
      </Section>

      <Section
        title="Completed / Result Pending"
        count={grouped.completed.length}
        open={open.completed}
        toggle={() =>
          setOpen({ upcoming: false, ongoing: false, completed: !open.completed })
        }
      >
        <Table data={grouped.completed} />
      </Section>
    </div>
  );
};

/* ---------------- SECTION ---------------- */
const Section = ({ title, count, open, toggle, children }) => (
  <div className="section">
    <div className="section-header" onClick={toggle}>
      <span>{title}</span>
      <Badge count={count} />
    </div>
    {open && <div className="section-body">{children}</div>}
  </div>
);

export default ScheduledExams;
