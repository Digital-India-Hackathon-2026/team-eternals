function ClinicalReport({ report }) {
  return (
    <section
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        background: "#fff",
        padding: "30px",
        borderRadius: "18px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ color: "#0F4C81" }}>🩺 AI Clinical Report</h2>

      <hr />

      <h3>🚨 Priority</h3>
      <p>{report.priority}</p>

      <h3>❤️ Department</h3>
      <p>{report.department}</p>

      <h3>🏥 Hospital</h3>
      <p>{report.hospital}</p>

      <h3>📋 Reason</h3>
      <p>{report.reason}</p>

      <h3>🕒 Estimated Wait Time</h3>
      <p>{report.waitTime}</p>
    </section>
  );
}

export default ClinicalReport;