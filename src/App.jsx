import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import Dependencies from "./pages/Dependencies";
import CostAnalysis from "./pages/CostAnalysis";
import Reports from "./pages/Reports";
import Retention from "./pages/Retention";


function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
        <Sidebar />

        <div
           style={{
    flex: 1,
    background: "#f1f5f9",
    minHeight: "100vh",
    padding: "30px",
  }}
        >
          <Routes>
            <Route path="/retention" element={<Retention />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/dependencies" element={<Dependencies />} />
            <Route path="/cost-analysis" element={<CostAnalysis />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/retention" element={<Retention />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;