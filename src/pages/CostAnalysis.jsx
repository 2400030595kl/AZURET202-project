import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./CostAnalysis.css";

const PALETTE = [
  "#2563eb",
  "#059669",
  "#7c3aed",
  "#ea580c",
  "#0891b2",
  "#db2777",
];

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const item = payload[0];

    return (
      <div className="cost-tooltip">
        <div
          className="tooltip-indicator"
          style={{ background: item.color }}
        />
        <div className="tooltip-body">
          <div className="tooltip-name">{item.name}</div>
          <div className="tooltip-value">
            ₹
            {Number(item.value).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function CostAnalysis() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState("");

  const fetchCosts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5001/api/costs"
      );

      setData(res.data || []);
      setLastSync(
        new Date().toLocaleTimeString()
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCosts();

    const interval = setInterval(() => {
      fetchCosts();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const totalCost = useMemo(() => {
    return data.reduce(
      (sum, item) => sum + Number(item.value || 0),
      0
    );
  }, [data]);

  const topExpense = useMemo(() => {
    if (!data.length) {
      return { name: "N/A" };
    }

    return [...data].sort(
      (a, b) => b.value - a.value
    )[0];
  }, [data]);

  return (
    <div className="cost-analysis-page">
      <div className="page-header">
        <div>
          <h1>Cost Analysis</h1>
          <p className="subtitle">
            Real-time breakdown of Azure spending
          </p>
        </div>

        {lastSync && (
          <div className="sync-badge">
            <span className="live-dot"></span>
            Last Sync: {lastSync}
          </div>
        )}
      </div>

      <div className="cost-metrics-grid">
        <div className="metric-card">
          <span className="metric-label">
            Total Cost
          </span>
          <span className="metric-value">
            ₹
            {totalCost.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="metric-card">
          <span className="metric-label">
            Top Service
          </span>
          <span className="metric-value accent">
            {topExpense.name}
          </span>
        </div>

        <div className="metric-card">
          <span className="metric-label">
            Active Services
          </span>
          <span className="metric-value">
            {data.length}
          </span>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <h3>Cost Distribution</h3>
        </div>

        {loading ? (
          <div className="chart-placeholder">
            Loading...
          </div>
        ) : (
          <div className="chart-wrapper">
            <ResponsiveContainer
              width="100%"
              height={400}
            >
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={80}
                  outerRadius={140}
                  paddingAngle={4}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        PALETTE[
                          index % PALETTE.length
                        ]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  content={<CustomTooltip />}
                />

                <Legend
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}