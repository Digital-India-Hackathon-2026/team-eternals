import { useState } from "react";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import SymptomForm from "./components/SymptomForm/SymptomForm";
import ClinicalReport from "./components/ClinicalReport/ClinicalReport";
import HospitalCard from "./components/HospitalCard/HospitalCard";
import MapPreview from "./components/MapPreview/MapPreview";

function App() {
  const [report, setReport] = useState(null);

  return (
    <div className="bg-slate-50 min-h-screen">

      <Navbar />

      <Hero />

      <section
    id="symptom-form"
    className="max-w-7xl mx-auto px-8 py-16"
>

        <div
    id="hospital-section"
    className="grid lg:grid-cols-2 gap-8 mt-10"
>

          <SymptomForm setReport={setReport} />

          {report ? (
            <ClinicalReport report={report} />
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center min-h-[450px]">
              <h2 className="text-slate-400 text-xl">
                AI Clinical Report will appear here
              </h2>
            </div>
          )}

        </div>

        <div
    id="hospital-section"
    className="grid lg:grid-cols-2 gap-8 mt-10"
>

          {report && <HospitalCard report={report} />}

          {report && <MapPreview />}

        </div>

      </section>

    </div>
  );
}

export default App;