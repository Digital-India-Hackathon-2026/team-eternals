import { Route, Routes, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home";
import Patient from "./pages/Patient";
import Hospital from "./pages/Hospital";
import About from "./pages/About";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/patient"    element={<Patient />} />
        <Route path="/hospital"   element={<Hospital />} />
        {/* Government is now part of the unified Hospital dashboard */}
        <Route path="/government" element={<Navigate to="/hospital" replace />} />
        <Route path="/about"      element={<About />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
