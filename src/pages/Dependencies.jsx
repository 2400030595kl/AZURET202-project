import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dependencies.css";

export default function Dependencies() {
  const [vms, setVms] = useState([]);
  const [selectedVm, setSelectedVm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/vms")
      .then((res) => {
        setVms(res.data || []);
        if (res.data && res.data.length > 0) {
          setSelectedVm(res.data[0]);
        }
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to fetch VM dependencies:", err);
        setError("Failed to load VM dependencies. Ensure your backend is running.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="dependencies-container">
      <div className="deps-header">
        <div>
          <h1>Azure Resource Dependencies</h1>
          <p>Inspect parent-child infrastructure linkages for safe resource decommissioning.</p>
        </div>

        {vms.length > 0 && (
          <div className="vm-selector-wrapper">
            <label>Target VM:</label>
            <select
              value={selectedVm?.name || ""}
              onChange={(e) => {
                const found = vms.find((v) => v.name === e.target.value);
                setSelectedVm(found);
              }}
            >
              {vms.map((vm) => (
                <option key={vm.name} value={vm.name}>
                  {vm.name} ({vm.location})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="deps-status-box">Loading live Azure VM infrastructure...</div>
      ) : error ? (
        <div className="deps-status-box error">{error}</div>
      ) : vms.length === 0 ? (
        <div className="deps-status-box">No Virtual Machines found in this subscription.</div>
      ) : (
        selectedVm && (
          <div className="dependency-tree-wrapper">
            {/* Root Parent Node: Virtual Machine */}
            <div className="root-vm-card">
              <div className="vm-icon-badge">🖥️</div>
              <div className="vm-details">
                <h2>{selectedVm.name}</h2>
                <div className="vm-meta">
                  <span><strong>Size:</strong> {selectedVm.vmSize || "Standard"}</span>
                  <span>•</span>
                  <span><strong>Region:</strong> {selectedVm.location}</span>
                  <span>•</span>
                  <span><strong>OS:</strong> {selectedVm.osType || "Linux/Windows"}</span>
                </div>
              </div>
              <span className="status-badge active">Active Parent</span>
            </div>

            <div className="tree-connector-vertical"></div>

            {/* Child Resources Grid */}
            <div className="child-resources-section">
              <div className="section-title">Direct Child Resources & Attachments</div>
              
              <div className="child-grid">
                {/* Network Interface Card */}
                <div className="child-card network-card">
                  <div className="child-icon">🌐</div>
                  <div className="child-content">
                    <h4>Network Interface (NIC)</h4>
                    <p>Manages private IP and subnet routing.</p>
                  </div>
                  <span className="link-tag">Attached</span>
                </div>

                {/* Public IP Card */}
                <div className="child-card ip-card">
                  <div className="child-icon">📡</div>
                  <div className="child-content">
                    <h4>Public IP Configuration</h4>
                    <p>Provides external internet accessibility.</p>
                  </div>
                  <span className="link-tag warning">Orphan Risk</span>
                </div>

                {/* Virtual Network Card */}
                <div className="child-card vnet-card">
                  <div className="child-icon">🔗</div>
                  <div className="child-content">
                    <h4>Virtual Network (VNet)</h4>
                    <p>Secure cloud boundary network.</p>
                  </div>
                  <span className="link-tag">Scoped</span>
                </div>

                {/* OS Disk Card */}
                <div className="child-card disk-card">
                  <div className="child-icon">💾</div>
                  <div className="child-content">
                    <h4>OS Disk Storage</h4>
                    <p>Persistent storage volume ({selectedVm.osType || "Standard"}).</p>
                  </div>
                  <span className="link-tag danger">Decommission Target</span>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}