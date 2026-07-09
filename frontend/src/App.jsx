import { useState } from "react";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";

import PatientJourney from "./components/PatientJourney/PatientJourney";

import SymptomForm from "./components/SymptomForm/SymptomForm";
import ClinicalReport from "./components/ClinicalReport/ClinicalReport";
import EmergencyAlert from "./components/EmergencyAlert/EmergencyAlert";

import HospitalCard from "./components/HospitalCard/HospitalCard";
import MapPreview from "./components/MapPreview/MapPreview";

import WaitTimePrediction from "./components/WaitTimePrediction/WaitTimePrediction";
import PatientTimeline from "./components/PatientTimeline/PatientTimeline";
import HospitalDashboard from "./components/HospitalDashboard/HospitalDashboard";
import AIInsight from "./components/AIInsight/AIInsight";
import WhyChooseUs from "./components/WhyChooseUs/WhyChooseUs";
import Footer from "./components/Footer/Footer";

function App() {
  const [report, setReport] = useState(null);

  return (
    <>
      <Navbar />

      <Hero />

      <PatientJourney />

      <div className="bg-slate-50">

        <div className="max-w-7xl mx-auto px-8 py-12">

          {/* Patient Form + AI Report */}

          <div className="grid lg:grid-cols-2 gap-8">

            <SymptomForm setReport={setReport} />

            {report && <ClinicalReport report={report} />}

          </div>

          {report && (
            <>
              {/* Emergency Alert */}

              <EmergencyAlert report={report} />

              {/* Hospital + Map */}

              <div className="grid lg:grid-cols-2 gap-8 mt-10">

                <HospitalCard report={report} />

                <MapPreview report={report} />

              </div>

              {/* Wait Prediction */}

              <WaitTimePrediction report={report} />

              {/* Patient Timeline */}

              <PatientTimeline report={report} />

              {/* Hospital Dashboard */}

              <HospitalDashboard />

              {/* AI Insights */}

              <AIInsight />

            </>
          )}

          {/* Why Choose Us */}

          <WhyChooseUs />

        </div>

      </div>

      <Footer />
    </>
  );
}

export default App;