import { useState } from "react";

function SymptomForm() {

  const [symptom, setSymptom] = useState("");

  function analyzeSymptoms() {
    alert("You entered: " + symptom);
  }

  return (
    <section>

      <textarea
        rows="5"
        cols="50"
        placeholder="Describe your symptoms..."
        value={symptom}
        onChange={(e) => setSymptom(e.target.value)}
      />

      <br />

      <button onClick={analyzeSymptoms}>
        Analyze Symptoms
      </button>

    </section>
  );
}

export default SymptomForm;