import { useEffect, useState } from "react";
import axios from "axios";
import StatCard from "../components/StatCard";
import "../dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalResources: 0,
    vmCount: 0,
    storageCount: 0,
    networkCount: 0,
    decommissionCandidates: 0,
    scheduledForDeletion: 0,
    lastSync: "",
  });

  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://localhost:5001/api/dashboard")
        .then((res) => setStats(res.data))
        .catch((err) => console.error(err));
    };

    fetchData();

    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="hero">
        <h1>Azure Resource Decommission Dashboard</h1>
        <p>
          Monitor Azure resources, visualize dependencies, analyze costs, and
          manage offboarding lifecycles.
        </p>

        <p className="last-sync">
          Last Updated:{" "}
          {stats.lastSync
            ? new Date(stats.lastSync).toLocaleString()
            : "Loading..."}
        </p>
      </div>

      {/* Primary Inventory Metrics */}
      <h2 className="section-heading">Resource Inventory</h2>
      <div className="stats-grid">
        <StatCard title="Total Resources" value={stats.totalResources} />
        <StatCard title="Virtual Machines" value={stats.vmCount} />
        <StatCard title="Storage Accounts" value={stats.storageCount} />
        <StatCard title="Network Resources" value={stats.networkCount} />
      </div>

      {/* Offboarding & Governance Lifecycle Metrics */}
      <h2 className="section-heading">Offboarding & Governance Status</h2>
      <div className="stats-grid">
        <StatCard
          title="Offboard Candidates"
          value={stats.decommissionCandidates || 0}
        />
        <StatCard
          title="Scheduled / 30-Day Lock"
          value={stats.scheduledForDeletion || 0}
        />
      </div>
    </div>
  );
}