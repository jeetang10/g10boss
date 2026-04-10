import { useState } from "react";

const STORAGE_KEY = "beyondburg_reservations";

const timeSlots = [
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM",
  "9:00 PM", "9:30 PM", "10:00 PM"
];

const partyOptions = [1, 2, 3, 4, 5, 6, 7, 8];

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

export default function BeyondBurgReservation() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    date: "", time: "", guests: 2, notes: ""
  });
  const [confirmed, setConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.date) e.date = "Please select a date";
      if (!form.time) e.time = "Please select a time";
    }
    if (step === 2) {
      if (!form.name.trim()) e.name = "Name is required";
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
      if (!form.phone.match(/^\+?[\d\s\-()]{7,}$/)) e.phone = "Valid phone required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!validate()) return;
    const id = "BB-" + Math.random().toString(36).substr(2, 6).toUpperCase();
    const reservation = { ...form, id, status: "confirmed", createdAt: new Date().toISOString() };
    try {
      const existing = await window.storage.get(STORAGE_KEY).catch(() => null);
      const list = existing ? JSON.parse(existing.value) : [];
      list.push(reservation);
      await window.storage.set(STORAGE_KEY, JSON.stringify(list));
    } catch {}
    setBookingId(id);
    setConfirmed(true);
  };

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#F5F0E8",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      position: "relative",
      overflow: "hidden",
    },
    noise: {
      position: "fixed", inset: 0, opacity: 0.03,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      pointerEvents: "none", zIndex: 0,
    },
    hero: {
      background: "#2D5016",
      padding: "60px 24px 80px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    },
    heroBg: {
      position: "absolute", inset: 0,
      backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 50%)",
    },
    heroBadge: {
      display: "inline-block",
      border: "1px solid rgba(245,240,232,0.3)",
      color: "#C8D8A0",
      fontSize: "11px",
      letterSpacing: "4px",
      textTransform: "uppercase",
      padding: "6px 18px",
      marginBottom: "24px",
    },
    heroTitle: {
      fontSize: "clamp(48px, 8vw, 84px)",
      color: "#F5F0E8",
      fontWeight: "400",
      letterSpacing: "-2px",
      lineHeight: 1,
      margin: "0 0 8px",
    },
    heroAccent: {
      color: "#8BC34A",
      fontStyle: "italic",
    },
    heroSub: {
      fontSize: "15px",
      color: "rgba(245,240,232,0.6)",
      letterSpacing: "1px",
      marginTop: "16px",
    },
    container: {
      maxWidth: "640px",
      margin: "0 auto",
      padding: "0 24px 80px",
      position: "relative",
      zIndex: 1,
    },
    card: {
      background: "#FFFFFF",
      border: "1px solid rgba(45,80,22,0.12)",
      marginTop: "-32px",
      padding: "48px",
      boxShadow: "0 20px 60px rgba(45,80,22,0.10)",
    },
    stepIndicator: {
      display: "flex",
      gap: "8px",
      marginBottom: "40px",
      alignItems: "center",
    },
    stepDot: (active, done) => ({
      width: active ? "32px" : "8px",
      height: "8px",
      background: done ? "#2D5016" : active ? "#8BC34A" : "rgba(45,80,22,0.15)",
      transition: "all 0.4s ease",
    }),
    stepLabel: {
      fontSize: "11px",
      letterSpacing: "3px",
      textTransform: "uppercase",
      color: "#2D5016",
      opacity: 0.5,
      marginBottom: "6px",
    },
    sectionTitle: {
      fontSize: "28px",
      color: "#2D5016",
      fontWeight: "400",
      marginBottom: "32px",
      letterSpacing: "-0.5px",
    },
    label: {
      display: "block",
      fontSize: "11px",
      letterSpacing: "2px",
      textTransform: "uppercase",
      color: "#2D5016",
      opacity: 0.6,
      marginBottom: "8px",
    },
    input: (err) => ({
      width: "100%",
      padding: "14px 16px",
      border: `1.5px solid ${err ? "#c0392b" : "rgba(45,80,22,0.2)"}`,
      background: "#FAFAF8",
      fontSize: "16px",
      color: "#1a1a1a",
      fontFamily: "inherit",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.2s",
    }),
    errorText: {
      fontSize: "12px",
      color: "#c0392b",
      marginTop: "4px",
    },
    guestGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(8, 1fr)",
      gap: "8px",
    },
    guestBtn: (active) => ({
      padding: "12px 0",
      border: `1.5px solid ${active ? "#2D5016" : "rgba(45,80,22,0.2)"}`,
      background: active ? "#2D5016" : "transparent",
      color: active ? "#F5F0E8" : "#2D5016",
      fontSize: "15px",
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "all 0.2s",
    }),
    timeGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "8px",
    },
    timeBtn: (active) => ({
      padding: "12px 8px",
      border: `1.5px solid ${active ? "#2D5016" : "rgba(45,80,22,0.2)"}`,
      background: active ? "#2D5016" : "transparent",
      color: active ? "#F5F0E8" : "#2D5016",
      fontSize: "13px",
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "all 0.2s",
      letterSpacing: "0.5px",
    }),
    btnRow: {
      display: "flex",
      gap: "12px",
      marginTop: "40px",
    },
    btnPrimary: {
      flex: 1,
      padding: "18px",
      background: "#2D5016",
      color: "#F5F0E8",
      border: "none",
      fontSize: "13px",
      letterSpacing: "3px",
      textTransform: "uppercase",
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "background 0.2s",
    },
    btnSecondary: {
      padding: "18px 24px",
      background: "transparent",
      color: "#2D5016",
      border: "1.5px solid rgba(45,80,22,0.3)",
      fontSize: "13px",
      letterSpacing: "2px",
      textTransform: "uppercase",
      cursor: "pointer",
      fontFamily: "inherit",
    },
    divider: {
      height: "1px",
      background: "rgba(45,80,22,0.1)",
      margin: "32px 0",
    },
    summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 0",
      borderBottom: "1px solid rgba(45,80,22,0.06)",
      fontSize: "15px",
    },
    summaryKey: { color: "rgba(45,80,22,0.5)", fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase" },
    summaryVal: { color: "#1a1a1a", fontWeight: "400" },
    confirmed: {
      textAlign: "center",
      padding: "20px 0",
    },
    checkCircle: {
      width: "72px", height: "72px",
      border: "2px solid #2D5016",
      borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
      margin: "0 auto 28px",
      fontSize: "32px",
    },
    bookingIdBox: {
      background: "#F5F0E8",
      border: "1px solid rgba(45,80,22,0.15)",
      padding: "20px",
      marginTop: "28px",
    },
    textarea: {
      width: "100%",
      padding: "14px 16px",
      border: "1.5px solid rgba(45,80,22,0.2)",
      background: "#FAFAF8",
      fontSize: "15px",
      color: "#1a1a1a",
      fontFamily: "inherit",
      outline: "none",
      resize: "vertical",
      minHeight: "80px",
      boxSizing: "border-box",
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.noise} />

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroBg} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={styles.heroBadge}>Reserve Your Table</div>
          <h1 style={styles.heroTitle}>
            Beyond<span style={styles.heroAccent}>Burg</span>
          </h1>
          <p style={styles.heroSub}>Open Daily · 12:00 PM – 10:30 PM</p>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.card}>
          {!confirmed ? (
            <>
              {/* Step indicator */}
              <div style={styles.stepIndicator}>
                {[1,2,3].map(n => (
                  <div key={n} style={styles.stepDot(step === n, step > n)} />
                ))}
                <span style={{ ...styles.stepLabel, marginBottom: 0, marginLeft: "8px" }}>
                  Step {step} of 3
                </span>
              </div>

              {/* Step 1: Date, time, guests */}
              {step === 1 && (
                <>
                  <p style={styles.stepLabel}>When & How Many</p>
                  <h2 style={styles.sectionTitle}>Choose Your Slot</h2>

                  <div style={{ marginBottom: "24px" }}>
                    <label style={styles.label}>Date</label>
                    <input
                      type="date"
                      min={getTodayString()}
                      value={form.date}
                      onChange={e => update("date", e.target.value)}
                      style={styles.input(errors.date)}
                    />
                    {errors.date && <div style={styles.errorText}>{errors.date}</div>}
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <label style={styles.label}>Time</label>
                    <div style={styles.timeGrid}>
                      {timeSlots.map(t => (
                        <button key={t} style={styles.timeBtn(form.time === t)} onClick={() => update("time", t)}>
                          {t}
                        </button>
                      ))}
                    </div>
                    {errors.time && <div style={{ ...styles.errorText, marginTop: "8px" }}>{errors.time}</div>}
                  </div>

                  <div style={{ marginBottom: "8px" }}>
                    <label style={styles.label}>Guests</label>
                    <div style={styles.guestGrid}>
                      {partyOptions.map(n => (
                        <button key={n} style={styles.guestBtn(form.guests === n)} onClick={() => update("guests", n)}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={styles.btnRow}>
                    <button style={styles.btnPrimary} onClick={handleNext}>Continue →</button>
                  </div>
                </>
              )}

              {/* Step 2: Contact info */}
              {step === 2 && (
                <>
                  <p style={styles.stepLabel}>Your Details</p>
                  <h2 style={styles.sectionTitle}>Contact Info</h2>

                  {[
                    { key: "name", label: "Full Name", type: "text", placeholder: "Jane Smith" },
                    { key: "email", label: "Email Address", type: "email", placeholder: "jane@example.com" },
                    { key: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210" },
                  ].map(({ key, label, type, placeholder }) => (
                    <div key={key} style={{ marginBottom: "20px" }}>
                      <label style={styles.label}>{label}</label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={form[key]}
                        onChange={e => update(key, e.target.value)}
                        style={styles.input(errors[key])}
                      />
                      {errors[key] && <div style={styles.errorText}>{errors[key]}</div>}
                    </div>
                  ))}

                  <div style={{ marginBottom: "8px" }}>
                    <label style={styles.label}>Special Requests (optional)</label>
                    <textarea
                      placeholder="Dietary needs, seating preferences, celebrations..."
                      value={form.notes}
                      onChange={e => update("notes", e.target.value)}
                      style={styles.textarea}
                    />
                  </div>

                  <div style={styles.btnRow}>
                    <button style={styles.btnSecondary} onClick={handleBack}>← Back</button>
                    <button style={styles.btnPrimary} onClick={handleNext}>Review →</button>
                  </div>
                </>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <>
                  <p style={styles.stepLabel}>Confirm</p>
                  <h2 style={styles.sectionTitle}>Review & Book</h2>

                  {[
                    ["Date", form.date ? new Date(form.date + "T12:00:00").toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : ""],
                    ["Time", form.time],
                    ["Guests", `${form.guests} ${form.guests === 1 ? "person" : "people"}`],
                    ["Name", form.name],
                    ["Email", form.email],
                    ["Phone", form.phone],
                    ...(form.notes ? [["Notes", form.notes]] : []),
                  ].map(([k, v]) => (
                    <div key={k} style={styles.summaryRow}>
                      <span style={styles.summaryKey}>{k}</span>
                      <span style={styles.summaryVal}>{v}</span>
                    </div>
                  ))}

                  <div style={styles.btnRow}>
                    <button style={styles.btnSecondary} onClick={handleBack}>← Edit</button>
                    <button style={styles.btnPrimary} onClick={handleSubmit}>Confirm Booking</button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div style={styles.confirmed}>
              <div style={styles.checkCircle}>✓</div>
              <h2 style={{ fontSize: "32px", color: "#2D5016", fontWeight: 400, marginBottom: "8px" }}>
                You're booked!
              </h2>
              <p style={{ color: "rgba(45,80,22,0.6)", fontSize: "15px", lineHeight: 1.6 }}>
                We're looking forward to having you at BeyondBurg.<br />
                A confirmation has been sent to <strong>{form.email}</strong>
              </p>
              <div style={styles.bookingIdBox}>
                <div style={styles.stepLabel}>Booking Reference</div>
                <div style={{ fontSize: "28px", letterSpacing: "4px", color: "#2D5016", marginTop: "6px" }}>{bookingId}</div>
                <div style={{ marginTop: "16px", fontSize: "14px", color: "rgba(45,80,22,0.6)", lineHeight: 1.8 }}>
                  <div>{new Date(form.date + "T12:00:00").toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })} at {form.time}</div>
                  <div>{form.guests} {form.guests === 1 ? "guest" : "guests"} · {form.name}</div>
                </div>
              </div>
              <button
                style={{ ...styles.btnSecondary, marginTop: "24px", width: "100%" }}
                onClick={() => { setConfirmed(false); setStep(1); setForm({ name:"",email:"",phone:"",date:"",time:"",guests:2,notes:"" }); setBookingId(""); }}
              >
                Make Another Reservation
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "40px", color: "rgba(45,80,22,0.4)", fontSize: "12px", letterSpacing: "2px" }}>
          BEYONDBURG · OPEN 7 DAYS A WEEK
        </div>
      </div>
    </div>
  );
}
