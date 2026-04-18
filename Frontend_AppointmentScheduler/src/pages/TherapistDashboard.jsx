import "../styles/home.css";
import "../styles/TherapistDashboard.css";
import NavBar from "./NavBar";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function TherapistDashboard() {
  const navigate = useNavigate();
  const userId = parseInt(localStorage.getItem("userId") || "0");

  const [therapist, setTherapist] = useState(null);
  const [availFrom, setAvailFrom] = useState("");
  const [availTo, setAvailTo] = useState("");
  const [date, setDate] = useState(""); // ✅ NEW
  const [appointments, setAppointments] = useState([]);

  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveErr, setSaveErr] = useState("");
  const [userMap, setUserMap] = useState({});

  // Redirect non-therapists
  useEffect(() => {
    const role = localStorage.getItem("role")?.toLowerCase();
    if (role !== "therapist") navigate("/home");
  }, []);

  // Load therapist profile + appointments
  useEffect(() => {
    if (!userId) return;

    axiosInstance.get(`/auth/therapist/byUser/${userId}`)
      .then(res => {
        const t = res.data;
        setTherapist(t);
        setAvailFrom(t.availableFrom?.slice(0, 5) ?? "");
        setAvailTo(t.availableTo?.slice(0, 5) ?? "");
        return axiosInstance.get(`/auth/appointments/therapist/${t.therapistId}`);
      })
      .then(async res => {
        const appts = res.data;
        setAppointments(appts);

        // fetch ALL users at once — one request, no CORS issues
        const usersRes = await axiosInstance.get(`/auth/users`);
        const map = {};
        usersRes.data.forEach(u => {
          map[String(u.id)] = u.name;
        });
        setUserMap(map);
        setLoadingData(false);
      })
      .catch(() => setLoadingData(false));
  }, [userId]);

  // ✅ Save availability WITH DATE
  const handleSaveAvailability = async () => {
    setSaveMsg("");
    setSaveErr("");

    if (!date) {
      setSaveErr("Please select a date.");
      return;
    }

    if (!availFrom || !availTo) {
      setSaveErr("Please set both times.");
      return;
    }

    if (availTo <= availFrom) {
      setSaveErr("End time must be after start time.");
      return;
    }

    setSaving(true);

    try {
      await axiosInstance.post(
        `/auth/therapist/availability`,
        {
          therapistId: therapist.therapistId,
          date: date,
          availableFrom: availFrom,
          availableTo: availTo,
        }
      );

      setSaveMsg("Availability saved successfully!");

    } catch {
      setSaveErr("Failed to update. Please try again.");
    } finally {
      setSaving(false);
    }
  };

const statusColor = (s) => ({
  BOOKED:    "#2ecc71",
  CANCELLED: "#e04040",
}[s] || "#aaa");

  const upcoming = appointments.filter(a => a.status !== "CANCELLED");
  const cancelled = appointments.filter(a => a.status === "CANCELLED");

  return (
    <div className="home-wrapper">
      <NavBar />

      <div className="home-content therapist-page">
        <div className="therapist-container">

          {/* Header */}
          <div className="therapist-header">
            <div>
              <h2 className="therapist-title">My Schedule</h2>
              <p className="therapist-sub">
                Therapist #{therapist?.therapistId ?? "..."} · Manage your availability
              </p>
            </div>
          </div>

          {/* Availability */}
          <div className="availability-card">
            <h3 className="card-heading">Set Availability</h3>
            <p className="card-desc">
              Set available time slots for a specific date.
            </p>

            <div className="avail-form">

              {/* ✅ DATE FIRST */}
              <div className="avail-field">
                <label>Select Date</label>
                <input
                  type="date"
                  className="mytextBox avail-input"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="avail-field">
                <label>Available From</label>
                <input
                  type="time"
                  className="mytextBox avail-input"
                  value={availFrom}
                  onChange={(e) => setAvailFrom(e.target.value)}
                />
              </div>

              <div className="avail-field">
                <label>Available To</label>
                <input
                  type="time"
                  className="mytextBox avail-input"
                  value={availTo}
                  onChange={(e) => setAvailTo(e.target.value)}
                />
              </div>

              <button
                className="myButton save-btn"
                onClick={handleSaveAvailability}
                type="button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>

            </div>

            {/* Time preview */}
            {availFrom && availTo && availTo > availFrom && (
              <div className="time-bar-wrap">
                <p className="time-bar-caption">
                  Open window: <strong>{availFrom}</strong> – <strong>{availTo}</strong>
                  {date && <> on <strong>{date}</strong></>}
                </p>
              </div>
            )}

            {saveMsg && <p className="msg-success">{saveMsg}</p>}
            {saveErr && <p className="msg-error">{saveErr}</p>}
          </div>

          {/* Appointments */}
          <h3 className="section-heading">
            Upcoming Appointments
            <span className="count-badge">{upcoming.length}</span>
          </h3>

          {loadingData ? (
            <p>Loading...</p>
          ) : upcoming.length === 0 ? (
            <p>No upcoming appointments.</p>
          ) : (
            <div className="appts-grid">
              {upcoming.map(appt => (
                <div className="appt-card" key={appt.appointmentId}>
                  <div className="appt-header">
                    <span>Appt #{appt.appointmentId}</span>
                    <span style={{ color: statusColor(appt.status) }}>
                      {appt.status}
                    </span>
                  </div>

                  <div>Name: {userMap[String(appt.userId)] ?? `User #${appt.userId}`}</div>

                  <div>
                    Date:  {new Date(appt.appointmentDate + "T00:00:00")
                      .toLocaleDateString("en-IN")}
                  </div>

                  <div>
                    Time:  {appt.startTime?.slice(0,5)} – {appt.endTime?.slice(0,5)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cancelled */}
          {cancelled.length > 0 && (
            <>
              <h3 className="section-heading">Cancelled</h3>

              <div className="appts-grid">
                {cancelled.map(appt => (
                  <div className="appt-card cancelled-card" key={appt.appointmentId}>
                    <div>Appt #{appt.appointmentId}</div>
                    <div>👤 {userMap[String(appt.userId)] ?? `User #${appt.userId}`}</div>
                    <div>📅 {appt.appointmentDate}</div>
                    <div>
                      🕐 {appt.startTime?.slice(0,5)} – {appt.endTime?.slice(0,5)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default TherapistDashboard;