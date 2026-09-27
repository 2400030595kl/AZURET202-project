import { useEffect, useState } from "react";
import axios from "axios";
import "./Resources.css";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/resources")
      .then((res) => {
        setResources(res.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredResources = resources.filter((resource) =>
    (resource.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (resource.type || "").toLowerCase().includes(search.toLowerCase()) ||
    (resource.location || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="resources-page">
      <header className="page-header">
        <div>
          <h1>Azure Resources</h1>
          <p className="subtitle">Manage, search, and monitor your cloud assets</p>
        </div>
      </header>

      <div className="table-toolbar">
        <div className="search-wrapper">
          <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, type, or region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="results-badge">
          {loading ? "Loading..." : `${filteredResources.length} resources`}
        </span>
      </div>

      <div className="table-card">
        <table className="resources-table">
          <thead>
            <tr>
              <th>Resource Name</th>
              <th>Type</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="empty-state">
                  Fetching resources...
                </td>
              </tr>
            ) : filteredResources.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-state">
                  No resources found matching "<strong>{search}</strong>"
                </td>
              </tr>
            ) : (
              filteredResources.map((resource, index) => (
                <tr key={resource.id || index}>
                  <td className="resource-name">{resource.name}</td>
                  <td>
                    <span className="type-badge">{resource.type}</span>
                  </td>
                  <td className="location-cell">{resource.location}</td>
                  <td>
                    <span className="status-badge active">
                      <span className="status-dot"></span>
                      Active
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}