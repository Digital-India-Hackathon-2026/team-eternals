function MapPreview() {
  return (
    <section
      style={{
        maxWidth: "900px",
        margin: "30px auto",
        background: "#fff",
        padding: "30px",
        borderRadius: "18px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ color: "#0F4C81" }}>🗺 Route Preview</h2>

      <div
        style={{
          height: "350px",
          marginTop: "20px",
          borderRadius: "15px",
          background: "#e2e8f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "22px",
        }}
      >
        📍 OpenStreetMap will appear here
      </div>
    </section>
  );
}

export default MapPreview;