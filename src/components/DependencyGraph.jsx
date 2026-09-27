import React, { useMemo } from "react";

const defaultNodes = [
  { id: "web-app", label: "Web App", type: "app", x: 120, y: 120 },
  { id: "api", label: "API Service", type: "service", x: 360, y: 120 },
  { id: "sql", label: "SQL DB", type: "database", x: 600, y: 120 },
  { id: "storage", label: "Storage", type: "storage", x: 360, y: 280 },
  { id: "keyvault", label: "Key Vault", type: "security", x: 600, y: 280 },
];

const defaultEdges = [
  { from: "web-app", to: "api" },
  { from: "api", to: "sql" },
  { from: "api", to: "storage" },
  { from: "sql", to: "keyvault" },
  { from: "api", to: "keyvault" },
];

const typeColors = {
  app: "#4f46e5",
  service: "#0ea5e9",
  database: "#10b981",
  storage: "#f59e0b",
  security: "#ef4444",
};

function DependencyGraph({
  nodes = defaultNodes,
  edges = defaultEdges,
  width = 820,
  height = 420,
  selectedNodeId = null,
  onNodeClick = () => {},
}) {
  const nodeMap = useMemo(
    () => Object.fromEntries(nodes.map((node) => [node.id, node])),
    [nodes]
  );

  const edgeMap = useMemo(
    () =>
      edges.map((edge) => {
        const from = nodeMap[edge.from];
        const to = nodeMap[edge.to];
        if (!from || !to) return null;

        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const length = Math.sqrt(dx * dx + dy * dy);

        return {
          ...edge,
          fromNode: from,
          toNode: to,
          fromX: from.x,
          fromY: from.y,
          toX: to.x,
          toY: to.y,
          midX: (from.x + to.x) / 2,
          midY: (from.y + to.y) / 2,
          length,
          angle: (Math.atan2(dy, dx) * 180) / Math.PI,
        };
      }),
    [edges, nodeMap]
  );

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        background: "#f8fafc",
        padding: 12,
        overflow: "hidden",
      }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Dependency graph">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 8 3.5, 0 7" fill="#94a3b8" />
          </marker>
        </defs>

        {edgeMap.filter(Boolean).map((edge, index) => {
          const isSelected =
            selectedNodeId === edge.from || selectedNodeId === edge.to;

          return (
            <g key={`${edge.from}-${edge.to}-${index}`}>
              <line
                x1={edge.fromX}
                y1={edge.fromY}
                x2={edge.toX}
                y2={edge.toY}
                stroke={isSelected ? "#475569" : "#94a3b8"}
                strokeWidth={isSelected ? 2.5 : 1.5}
                markerEnd="url(#arrowhead)"
              />
            </g>
          );
        })}

        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const color = typeColors[node.type] || "#64748b";

          return (
            <g
              key={node.id}
              onClick={() => onNodeClick(node.id)}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={isSelected ? 28 : 24}
                fill={isSelected ? "#e2e8f0" : "#ffffff"}
                stroke={color}
                strokeWidth={isSelected ? 4 : 2.5}
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={isSelected ? 18 : 14}
                fill={color}
                opacity={0.18}
              />
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                fontSize="11"
                fontWeight={600}
                fill="#0f172a"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default DependencyGraph;