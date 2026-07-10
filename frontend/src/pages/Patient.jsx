import { useState } from "react";

import Hero from "../components/Hero/Hero";
import PatientJourney from "../components/PatientJourney/PatientJourney";
import SymptomForm from "../components/SymptomForm/SymptomForm";
import ClinicalReport from "../components/ClinicalReport/ClinicalReport";
import EmergencyAlert from "../components/EmergencyAlert/EmergencyAlert";
import HospitalCard from "../components/HospitalCard/HospitalCard";
import MapPreview from "../components/MapPreview/MapPreview";
import AppointmentBooking from "../components/AppointmentBooking/AppointmentBooking";
import AppointmentConfirmation from "../components/AppointmentConfirmation/AppointmentConfirmation";
import HospitalDetails from "../components/HospitalDetails/HospitalDetails";
import WaitTimePrediction from "../components/WaitTimePrediction/WaitTimePrediction";
import PatientTimeline from "../components/PatientTimeline/PatientTimeline";
import AIInsight from "../components/AIInsight/AIInsight";
import WhyChooseUs from "../components/WhyChooseUs/WhyChooseUs";
import { getRecommendedHyderabadHospital } from "../components/MapPreview/MapPreview";

export default function Patient() {
  const [report, setReport] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);

  const handleReport = (nextReport) => {
    setReport(nextReport);
    setSelectedHospital(getRecommendedHyderabadHospital(nextReport));
  };

  return (
    <>
      <Hero />

      <PatientJourney />

      <div className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-8">
            <SymptomForm setReport={handleReport} />

            {report && <ClinicalReport report={report} />}
          </div>

          {report && (
            <>
              <EmergencyAlert report={report} />

              <div className="grid lg:grid-cols-2 gap-8 mt-10">
                <HospitalCard report={report} />

                <MapPreview
                  report={report}
                  selectedHospital={selectedHospital}
                  onSelectHospital={setSelectedHospital}
                />
              </div>

              <section className="mt-20">
                <div className="mb-8 text-center">
                  <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-blue-700 ring-1 ring-blue-100">
                    Appointment Booking
                  </span>

                  <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                    Book Your Appointment
                  </h2>

                  <p className="mt-4 text-lg leading-8 text-slate-600">
                    Choose a doctor, select a time slot and confirm your visit.
                  </p>
                </div>

                <AppointmentBooking report={report} />
              </section>

              <section className="mt-20">
                <div className="mb-8 text-center">
                  <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-blue-700 ring-1 ring-blue-100">
                    Appointment Confirmation
                  </span>

                  <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                    Appointment Confirmation
                  </h2>

                  <p className="mt-4 text-lg leading-8 text-slate-600">
                    Your appointment has been successfully scheduled. Please review the details below.
                  </p>
                </div>

                <AppointmentConfirmation />
              </section>

              <HospitalDetails
                report={report}
                selectedHospital={selectedHospital}
                onSelectHospital={setSelectedHospital}
              />

              <WaitTimePrediction report={report} />

              <PatientTimeline report={report} />

              <AIInsight />
            </>
          )}

          <WhyChooseUs />
        </div>
      </div>
    </>
  );
}
