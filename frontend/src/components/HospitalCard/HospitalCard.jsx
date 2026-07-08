function HospitalCard({ report }) {
  return (
    <section
      style={{
        maxWidth: "900px",
        margin: "30px auto",
        background: "#ffffff",
        borderRadius: "18px",
        padding: "30px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ color: "#0F4C81" }}>🏥 Recommended Hospital</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "25px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3>{report.hospital}</h3>
          <p>📍 Jubilee Hills, Hyderabad</p>
          <p>⭐ 4.8 Rating</p>
          <p>🚗 {report.distance}</p>
        </div>

        <div>
          <p>👨‍⚕️ Queue: {report.queue}</p>
          <p>🕒 ETA: {report.waitTime}</p>
          <p>🛏 Beds Available: 18</p>
        </div>
      </div>

      <button
        style={{
          marginTop: "25px",
          padding: "14px 25px",
          background: "#0F4C81",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        📍 Navigate to Hospital
      </button>
    </section>
  );
}

export default HospitalCard;