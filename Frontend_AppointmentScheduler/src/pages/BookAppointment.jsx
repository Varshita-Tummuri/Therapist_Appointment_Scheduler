import "../styles/home.css";
import "../styles/BookAppointment.css";
import NavBar from "./NavBar";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosConfig";

// Generate 30-min slots between two HH:MM strings
function generateSlots(from, to) {
  const slots = [];
  if (!from || !to) return slots;
  let [h, m] = from.split(":").map(Number);
  const [endH, endM] = to.split(":").map(Number);
  while (h < endH || (h === endH && m < endM)) {
    const nextM = m + 30;
    const nextH = nextM >= 60 ? h + 1 : h;
    const nm    = nextM >= 60 ? nextM - 60 : nextM;
    if (nextH > endH || (nextH === endH && nm > endM)) break;
    const fmt = (hh, mm) => `${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}`;
    slots.push({ start: fmt(h, m), end: fmt(nextH, nm) });
    h = nextH; m = nm;
  }
  return slots;
}

function BookAppointment() {
  const [therapists,    setTherapists]    = useState([]);
  const [therapistId,   setTherapistId]   = useState("");
  const [availability,  setAvailability]  = useState(null); // { availableFrom, availableTo }
  const [slots,         setSlots]         = useState([]);
  const [selectedSlot,  setSelectedSlot]  = useState(null);
  const [bookingDate,   setBookingDate]   = useState("");
  const [error,         setError]         = useState("");
  const [success,       setSuccess]       = useState("");
  const [loading,       setLoading]       = useState(false);
  const [loadingSlots,  setLoadingSlots]  = useState(false);

  const userId = parseInt(localStorage.getItem("userId") || "1");

  // Load all therapists on mount
  useEffect(() => {
    axiosInstance.get("/auth/therapist")
      .then(res => {
        console.log("THERAPISTS DATA:", res.data);
        setTherapists(res.data);
      })
      .catch(() => setTherapists([]));
  }, []);

  useEffect(() => {
    if (!therapistId || !bookingDate) {
      setSlots([]);
      return;
    }
    setLoadingSlots(true);
    setSelectedSlot(null);

    // Step 1: get therapist availability
    axiosInstance.get(`/auth/therapist/${therapistId}`)
      .then(res => {
        const t = res.data;
        setAvailability(t);
        const from = t.availableFrom?.slice(0, 5);
        const to   = t.availableTo?.slice(0, 5);
        const allSlots = generateSlots(from, to);

        // Step 2: get existing appointments
        return axiosInstance
          .get(`/auth/appointments/therapist/${therapistId}`)
          .then(apptRes => {
            const booked = apptRes.data.filter(a =>
              a.appointmentDate === bookingDate &&
              a.status !== "CANCELLED"
            );
            const bookedStarts = booked.map(a => a.startTime);

            // Step 3: remove booked slots
            const availableSlots = allSlots.filter(
              s => !bookedStarts.includes(s.start)
            );
            setSlots(availableSlots);
            setLoadingSlots(false);
          });
      })

      .catch(() => {
        setSlots([]);
        setLoadingSlots(false);
      });
  }, [therapistId, bookingDate]);

  // When therapist is selected, fetch their availability
  // useEffect(() => {
  //   if (!therapistId) { setAvailability(null); setSlots([]); setSelectedSlot(null); return; }
  //   setLoadingSlots(true);
  //   setSelectedSlot(null);
  //   axiosInstance.get(`/auth/therapist/${therapistId}`)
  //     .then(res => {
  //       const t = res.data;
  //       setAvailability(t);
  //       const from = t.availableFrom?.slice(0, 5);
  //       const to   = t.availableTo?.slice(0, 5);
  //       setSlots(generateSlots(from, to));
  //       setLoadingSlots(false);
  //     })
  //     .catch(() => { setAvailability(null); setSlots([]); setLoadingSlots(false); });
  // }, [therapistId]);

  useEffect(() => {
    setSelectedSlot(null);
  }, [bookingDate]);

  const handleBooking = async () => {
    setError(""); setSuccess("");
    if (!bookingDate)  { setError("Please select a date."); return; }
    if (!therapistId)  { setError("Please select a therapist."); return; }
    if (!selectedSlot) { setError("Please select a time slot."); return; }
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/bookAppointment",{
        bookingDate: bookingDate,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        userId:      userId,
        therapistId: parseInt(therapistId),
      }
    );
      if (res.status === 200) {
        setSuccess("Appointment booked successfully!");
        setSelectedSlot(null);
        setBookingDate("");
      }
    } catch (err) {
      setError(err.response?.data || "Slot not available. Try another.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-wrapper">
      <NavBar />
      <div className="home-content book-page">
        <div className="book-card">
          <h2 className="book-title">Book an Appointment</h2>
          <p className="book-sub">Select a therapist and pick an available slot</p>

          <div className="book-form">

            {/* Step 1 — Therapist */}
            <div className="form-step">
              <div className="step-label"><span className="step-num">1</span> Choose Therapist</div>
              <select
                className="book-select"
                value={therapistId}
                onChange={e => setTherapistId(e.target.value)}
              >
                <option value="">-- Select a Therapist --</option>
                {therapists.map(t => (
                  <option key={t.therapistId} value={t.therapistId}>
                    {t.name || "No Name"}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability window display */}
            {therapistId && (
              <div className="availability-banner">
                {loadingSlots ? (
                  <span>Loading availability...</span>
                ) : availability ? (
                  <>
                    <span className="avail-icon">🕐</span>
                    <span>
                      Available&nbsp;
                      <strong>{availability.availableFrom?.slice(0,5)}</strong>
                      &nbsp;–&nbsp;
                      <strong>{availability.availableTo?.slice(0,5)}</strong>
                    </span>
                  </>
                ) : (
                  <span>No availability set for this therapist.</span>
                )}
              </div>
            )}

            {/* Step 2 — Date */}
            <div className="form-step">
              <div className="step-label"><span className="step-num">2</span> Choose Date</div>
              <input
                type="date"
                className="mytextBox book-input"
                value={bookingDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={e => setBookingDate(e.target.value)}
              />
            </div>

            {/* Step 3 — Slot picker */}
            {slots.length > 0 && (
              <div className="form-step">
                <div className="step-label"><span className="step-num">3</span> Pick a Time Slot</div>
                <div className="slots-grid">
                  {slots.map((slot, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`slot-btn ${selectedSlot?.start === slot.start ? "slot-selected" : ""}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot.start} – {slot.end}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {slots.length === 0 && therapistId && !loadingSlots && (
              <p className="msg-error">This therapist has no available slots configured yet.</p>
            )}

            {/* Selected slot confirmation */}
            {selectedSlot && (
              <div className="selected-slot-banner">
                ✓ Selected: <strong>{selectedSlot.start} – {selectedSlot.end}</strong>
                {bookingDate && <> on <strong>{new Date(bookingDate + "T00:00:00").toLocaleDateString("en-IN",{weekday:"short",day:"2-digit",month:"short"})}</strong></>}
              </div>
            )}

            {error   && <p className="msg-error">{error}</p>}
            {success && <p className="msg-success">{success}</p>}

            <button
              className="myButton book-btn"
              onClick={handleBooking}
              type="button"
              disabled={loading || !selectedSlot || !bookingDate}
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;