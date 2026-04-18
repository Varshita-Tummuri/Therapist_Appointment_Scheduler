import "../styles/home.css";
import "../styles/MyAppointments.css";
import NavBar from "./NavBar";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [therapistMap, setTherapistMap] = useState({});  // { therapistId: name }
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [cancelMsg, setCancelMsg]       = useState("");

  const userId = parseInt(localStorage.getItem("userId") || "0");

  const fetchAppointments = useCallback(() => {
    setLoading(true);

    // fetch both in parallel
    Promise.all([
      axiosInstance.get(`/auth/appointments/user/${userId}`),
      axiosInstance.get(`/auth/therapist`)
    ])
      .then(([apptRes, therapistRes]) => {
        setAppointments(apptRes.data);

        // therapistRes.data is already a list of { therapistId, name, ... }
        const map = {};
        therapistRes.data.forEach(t => {
          map[String(t.therapistId)] = t.name;
        });
        setTherapistMap(map);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load appointments.");
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleCancel = async (appointmentId) => {
    setCancelMsg("");
    try {
      await axiosInstance.put(`/auth/cancelAppointment/${appointmentId}`);
      setCancelMsg("Appointment cancelled.");
      fetchAppointments();
    } catch (err) {
      // show the exact message from the backend
      setCancelMsg(err.response?.data || "Could not cancel. Please try again.");
    }
  };

  const statusColor = (status) => {
    if (status === "BOOKED")    return "#2ecc71";
    if (status === "CANCELLED") return "#e04040";
    return "#aaa";
  };

  return (
    <div className="home-wrapper">
      <NavBar />
      <div className="home-content appts-page">
        <div className="appts-container">
          <h2 className="appts-title">My Appointments</h2>
          <p className="appts-sub">View and manage your booked sessions</p>

          {cancelMsg && <p className="cancel-msg">{cancelMsg}</p>}
          {error     && <p className="msg-error">{error}</p>}

          {loading ? (
            <p className="loading-text">Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <div className="empty-state">
              <p>No appointments yet.</p>
              <Link
                to="/BookAppointment"
                className="myButton"
                style={{ textDecoration: "none", display: "inline-block", marginTop: "16px" }}
              >
                Book Now
              </Link>
            </div>
          ) : (
            <div className="appts-grid">
              {appointments.map(appt => (
                <div className="appt-card" key={appt.appointmentId}>
                  <div className="appt-header">
                    <span className="appt-id">#{appt.appointmentId}</span>
                    <span className="appt-status" style={{ color: statusColor(appt.status) }}>
                      {appt.status}
                    </span>
                  </div>
                  <div className="appt-detail">
                    <span>Date: </span>
                    <span>
                      {new Date(appt.appointmentDate + "T00:00:00").toLocaleDateString("en-IN", {
                        weekday: "short", year: "numeric", month: "short", day: "numeric"
                      })}
                    </span>
                  </div>
                  <div className="appt-detail">
                    <span>Time: </span>
                    <span>{appt.startTime?.slice(0,5)} – {appt.endTime?.slice(0,5)}</span>
                  </div>
                  <div className="appt-detail">
                    <span>Therapist: </span>
                    <span>{therapistMap[appt.therapistId] ?? `Therapist #${appt.therapistId}`}</span>
                  </div>
                  {appt.status !== "CANCELLED" && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancel(appt.appointmentId)}
                      type="button"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyAppointments;