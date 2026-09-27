import { useEffect, useState } from "react";
import axios from "axios";
import "./Retention.css";

export default function Retention() {
  const [resources, setResources] = useState([]);
  const [offboardContext, setOffboardContext] = useState({
    isOpen: false,
    resource: null,
    step: 1, // 1: Dependency Check, 2: Retention/Backup, 3: Final Confirm
  });

  const loadResources = () => {
    axios
      .get("http://localhost:5001/api/decommission-resources")
      .then((res) => setResources(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    loadResources();
  }, []);

  // Opens the governance workflow modal/dialog
  const initiateOffboarding = (resource) => {
    setOffboardContext({
      isOpen: true,
      resource: resource,
      step: 1,
    });
  };

  const cancelOffboarding = () => {
    setOffboardContext({ isOpen: false, resource: null, step: 1 });
  };

  const proceedToNextStep = () => {
    setOffboardContext((prev) => ({ ...prev, step: prev.step + 1 }));
  };

  // Replaces immediate deletion with a compliant scheduling/locking action
  const scheduleDecommission = async () => {
    const { resource } = offboardContext;
    try {
      // Changed endpoint to reflect a phased approach rather than a hard delete
      await axios.post("http://localhost:5001/api/schedule-decommission", {
        resourceId: resource.id,
        action: "LOCK_AND_SCHEDULE", // Applies Read-Only lock and starts 30-day clock
      });
      alert(`Resource ${resource.name} locked and scheduled for offboarding.`);
      cancelOffboarding();
      loadResources();
    } catch (error) {
      console.error(error);
      alert("Failed to schedule resource for offboarding");
    }
  };

  const getRiskClass = (status = "") => {
    const s = status.toLowerCase();
    if (s.includes("high") || s.includes("critical") || s.includes("audit required")) return "risk-high";
    if (s.includes("medium") || s.includes("moderate") || s.includes("warning"))
      return "risk-medium";
    return "risk-low";
  };

  return (
    <div className="retention-page">
      <header className="page-header">
        <h1>Decommission Candidates</h1>
        <p className="subtitle">
          Review and safely offboard inactive or unattached infrastructure according to retention policies.
        </p>
      </header>

      <div className="table-card">
        <table className="retention-table">
          <thead>
            <tr>
              <th>Resource</th>
              <th>Status</th>
              <th>Reason</th>
              <th className="action-column">Action</th>
            </tr>
          </thead>

          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id}>
                <td>
                  <div className="resource-cell">
                    <span className="resource-name">{resource.name}</span>
                    <span className="resource-type">{resource.type}</span>
                  </div>
                </td>

                <td>
                  <span
                    className={`risk-badge ${getRiskClass(
                      resource.status || resource.risk
                    )}`}
                  >
                    {resource.status || "Low"}
                  </span>
                </td>

                <td className="reason-cell">{resource.reason}</td>

                <td className="action-column">
                  <button
                    className="btn-review"
                    onClick={() => initiateOffboarding(resource)}
                  >
                    Offboard
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Basic Inline Modal for Governance Workflow */}
      {offboardContext.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Offboarding: {offboardContext.resource.name}</h3>
            
            {offboardContext.step === 1 && (
              <div className="modal-step">
                <h4>Step 1: Dependency Verification</h4>
                <p>Have you verified that no critical services are dependent on this resource?</p>
                <div className="modal-actions">
                  <button onClick={cancelOffboarding}>Cancel</button>
                  <button className="btn-primary" onClick={proceedToNextStep}>Confirm & Next</button>
                </div>
              </div>
            )}

            {offboardContext.step === 2 && (
              <div className="modal-step">
                <h4>Step 2: Data Retention & Backup</h4>
                <p>Has all necessary data been archived, exported, or verified against active legal holds (WORM compliance)?</p>
                <div className="modal-actions">
                  <button onClick={cancelOffboarding}>Cancel</button>
                  <button className="btn-primary" onClick={proceedToNextStep}>Data is Secured</button>
                </div>
              </div>
            )}

            {offboardContext.step === 3 && (
              <div className="modal-step">
                <h4>Step 3: Apply Governance Lock</h4>
                <p>This action will stop billing (if compute), apply a Read-Only lock to the resource, and schedule it for hard deletion after a 30-day grace period.</p>
                <div className="modal-actions">
                  <button onClick={cancelOffboarding}>Cancel</button>
                  <button className="btn-danger" onClick={scheduleDecommission}>Lock & Schedule Deletion</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}