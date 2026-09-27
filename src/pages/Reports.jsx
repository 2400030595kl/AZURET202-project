import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reports() {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real data from the backend on component mount
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/decommission-resources")
      .then((res) => {
        setResources(res.data || []);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to fetch reports data:", err);
        setError("Failed to load resource data. Ensure your backend server is running.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter(
      (r) =>
        r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [resources, searchTerm]);

  const totalMonthlySavings = useMemo(() => {
    return resources.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  }, [resources]);

  const generatePDF = () => {
    if (resources.length === 0) {
      alert("No data available to generate a report.");
      return;
    }

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    // 1. Header Banner
    doc.setFillColor(37, 99, 235); // #2563eb
    doc.rect(0, 0, 210, 24, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("AZURE DECOMMISSION & AUDIT REPORT", 14, 16);

    // 2. Metadata & Generation Info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${new Date().toLocaleString("en-IN")}`, 14, 32);
    doc.text("Project: Azure Resource Management & Cost Optimization", 14, 37);

    // 3. Summary KPI Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, 43, 182, 22, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);

    doc.text("Total Resources Flagged:", 20, 53);
    doc.text(`${resources.length}`, 75, 53);

    doc.text("Potential Monthly Savings:", 105, 53);
    doc.setTextColor(16, 185, 129); // Green
    doc.text(
      `Rs. ${totalMonthlySavings.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} / mo`,
      155,
      53
    );

    // 4. Tabular Data using autoTable
    const tableColumn = [
      "Resource Name",
      "Type",
      "Resource Group",
      "Est. Cost (INR)",
      "Audit Status",
      "Recommendation / Reason",
    ];
    const tableRows = resources.map((r) => [
      r.name || "Unknown",
      r.type || "Unknown",
      r.resourceGroup || "N/A",
      `Rs. ${(r.cost || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      r.status || "N/A",
      r.reason || "N/A",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 72,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 3,
        textColor: [51, 65, 85],
        lineColor: [226, 232, 240],
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 32 },
        1: { cellWidth: 26 },
        2: { cellWidth: 26 },
        3: { halign: "right", cellWidth: 28 },
        4: { cellWidth: 30 },
        5: { cellWidth: "auto" },
      },
      didDrawPage: (data) => {
        // Footer
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Page ${data.pageNumber}`,
          doc.internal.pageSize.width - 20,
          doc.internal.pageSize.height - 10
        );
      },
    });

    doc.save("Azure-Decommission-Report.pdf");
  };

  return (
    <div style={{ padding: "28px", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      {/* Top Controls Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 6px 0", fontSize: "24px", color: "#0f172a" }}>
            Azure Decommission Reports
          </h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Review unutilized resources and export audit reports for cloud optimization.
          </p>
        </div>

        <button
          onClick={generatePDF}
          disabled={loading || error || resources.length === 0}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            backgroundColor: loading || error || resources.length === 0 ? "#94a3b8" : "#2563eb",
            color: "#ffffff",
            fontWeight: "600",
            fontSize: "14px",
            border: "none",
            borderRadius: "6px",
            cursor: loading || error || resources.length === 0 ? "not-allowed" : "pointer",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          Export PDF Report
        </button>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px" }}>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>Flagged Resources</span>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginTop: "4px" }}>{resources.length}</div>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px" }}>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>Potential Monthly Recovery</span>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "#059669", marginTop: "4px" }}>
            ₹
            {totalMonthlySavings.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px" }}>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>Status</span>
          <div style={{ fontSize: "18px", fontWeight: "700", color: error ? "#dc2626" : loading ? "#eab308" : "#2563eb", marginTop: "4px" }}>
            {error ? "Error Syncing" : loading ? "Loading Data..." : "Live Data Synced"}
          </div>
        </div>
      </div>

      {/* Table Preview Card */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "16px", color: "#1e293b" }}>Report Live Preview</h3>
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading || error}
            style={{
              padding: "8px 12px",
              fontSize: "13px",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              outline: "none",
              width: "240px",
            }}
          />
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                <th style={{ padding: "12px 16px" }}>Resource Name</th>
                <th style={{ padding: "12px 16px" }}>Type</th>
                <th style={{ padding: "12px 16px" }}>Resource Group</th>
                <th style={{ padding: "12px 16px", textAlign: "right" }}>Monthly Cost</th>
                <th style={{ padding: "12px 16px" }}>Status</th>
                <th style={{ padding: "12px 16px" }}>Reason</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "32px", color: "#64748b" }}>
                    Fetching decommission data from Azure...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "32px", color: "#ef4444" }}>
                    {error}
                  </td>
                </tr>
              ) : filteredResources.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "32px", color: "#94a3b8" }}>
                    No matching resources found.
                  </td>
                </tr>
              ) : (
                filteredResources.map((res, idx) => (
                  <tr
                    key={res.id || idx}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      backgroundColor: idx % 2 === 0 ? "#ffffff" : "#fafafa",
                    }}
                  >
                    <td style={{ padding: "12px 16px", fontWeight: "600", color: "#0f172a" }}>{res.name}</td>
                    <td style={{ padding: "12px 16px", color: "#475569" }}>{res.type}</td>
                    <td style={{ padding: "12px 16px", color: "#64748b" }}>{res.resourceGroup}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: "600", color: "#0f172a" }}>
                      ₹
                      {(res.cost || 0).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 8px",
                          borderRadius: "9999px",
                          fontSize: "11px",
                          fontWeight: "600",
                          backgroundColor: res.status?.includes("Decommission") ? "#fef3c7" : "#fee2e2",
                          color: res.status?.includes("Decommission") ? "#92400e" : "#991b1b",
                        }}
                      >
                        {res.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#64748b" }}>{res.reason}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}