import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Server,
  Network,
  BarChart3,
  Trash2,
  FileText,
  Cloud,
} from "lucide-react";

import "./Sidebar.css";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Resources",
      path: "/resources",
      icon: <Server size={20} />,
    },
    {
      name: "Dependencies",
      path: "/dependencies",
      icon: <Network size={20} />,
    },
    {
      name: "Cost Analysis",
      path: "/cost-analysis",
      icon: <BarChart3 size={20} />,
    },
    {
      name: "Decommission",
      path: "/retention",
      icon: <Trash2 size={20} />,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <FileText size={20} />,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Cloud size={30} />
        <div>
          <h2>Azure</h2>
          <span>Management Portal</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={
              location.pathname === item.path
                ? "nav-link active"
                : "nav-link"
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>Azure Subscription</p>
        <strong>Azure for Students</strong>
      </div>
    </aside>
  );
}