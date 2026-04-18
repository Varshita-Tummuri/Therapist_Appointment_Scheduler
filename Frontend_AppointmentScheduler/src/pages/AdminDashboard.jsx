import "../styles/home.css";
import "../styles/AdminDashboard.css";
import NavBar from "./NavBar";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [userMap, setUserMap]           = useState({});       // userId → name
  const [therapistMap, setTherapistMap] = useState({});       // therapistId → name
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionMsg, setActionMsg]       = useState("");
  const navigate = useNavigate();

  
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role?.toLowerCase() !== "admin") navigate("/home");
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [apptRes, therapistRes] = await Promise.all([
        axiosInstance.get("/auth/appointments/all"),
        axiosInstance.get("/auth/therapist"),  // already returns name!
      ]);

      const appts = apptRes.data;
      setAppointments(appts);
      setFiltered(appts);

      // Build therapist map from the list — no second fetch needed
      const tMap = {};
      therapistRes.data.forEach(t => {
        tMap[String(t.therapistId)] = t.name;
      });
      setTherapistMap(tMap);

      // Replace the uniqueUserIds loop with:
      const usersRes = await axiosInstance.get("/auth/users");
      const uMap = {};
      usersRes.data.forEach(u => {
        uMap[String(u.id)] = u.name;
      });
      setUserMap(uMap);

      // Resolve user names
      const uniqueUserIds = [...new Set(appts.map(a => a.userId))];
      const userEntries = await Promise .all(
        uniqueUserIds.map(id =>
          axiosInstance.get(`/auth/users/${id}`)
            .then(r => [String(id), r.data.name])
            .catch(() => [String(id), `User #${id}`])
        )
      );
      setUserMap(Object.fromEntries(userEntries));

    } catch {
      setError("Could not load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    if (statusFilter === "ALL") setFiltered(appointments);
    else setFiltered(appointments.filter(a => a.status === statusFilter));
  }, [statusFilter, appointments]);

  const handleCancel = async (id) => {
    setActionMsg("");
    try {
      await axiosInstance.put(`/auth/cancelAppointment/${id}`);
      setActionMsg(`Appointment #${id} cancelled.`);
      fetchAll();
    } catch (err) {
      setActionMsg(err.response?.data || "Could not cancel appointment.");
    }
  };

  // Fixed: use BOOKED instead of PENDING/CONFIRMED
  const counts = {
    ALL:       appointments.length,
    BOOKED:    appointments.filter(a => a.status === "BOOKED").length,
    CANCELLED: appointments.filter(a => a.status === "CANCELLED").length,
  };

  const statusColor = (s) => ({
    BOOKED:    "#018237",
    CANCELLED: "#e04040",
  }[s] || "#aaa");

  return (
    <div className="home-wrapper">
      <NavBar />
      <div className="home-content admin-page">
        <div className="admin-container">

          <div className="admin-header">
            <div>
              <h2 className="admin-title">Admin Dashboard</h2>
              <p className="admin-sub">All appointments across all users</p>
            </div>
            <button className="myButton refresh-btn" onClick={fetchAll} type="button">
              ↻ Refresh
            </button>
          </div>

          <div className="stat-row">
            {["ALL", "BOOKED", "CANCELLED"].map(s => (
              <button
                key={s}
                className={`stat-pill ${statusFilter === s ? "active" : ""}`}
                style={{ "--pill-color": statusColor(s) }}
                onClick={() => setStatusFilter(s)}
                type="button"
              >
                <span className="pill-count">{counts[s]}</span>
                <span className="pill-label">{s}</span>
              </button>
            ))}
          </div>

          {actionMsg && <p className="action-msg">{actionMsg}</p>}
          {error     && <p className="msg-error">{error}</p>}

          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="loading-text">No appointments found.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#ID</th>
                    <th>User</th>
                    <th>Therapist</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(appt => (
                    <tr key={appt.appointmentId}>
                      <td>#{appt.appointmentId}</td>
                      <td>{userMap[String(appt.userId)] ?? `User #${appt.userId}`}</td>
                      <td>{therapistMap[String(appt.therapistId)] ?? `Therapist #${appt.therapistId}`}</td>
                      <td>{new Date(appt.appointmentDate + "T00:00:00").toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric"
                      })}</td>
                      <td>{appt.startTime?.slice(0,5)} – {appt.endTime?.slice(0,5)}</td>
                      <td>
                        <span className="status-badge" style={{ color: statusColor(appt.status) }}>
                          {appt.status}
                        </span>
                      </td>
                      <td>
                        {appt.status !== "CANCELLED" ? (
                          <button
                            className="admin-cancel-btn"
                            onClick={() => handleCancel(appt.appointmentId)}
                            type="button"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="done-label">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;