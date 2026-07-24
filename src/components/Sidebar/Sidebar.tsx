"use client";
import React, { useState } from "react";
import "./Sidebar.css";
import {
  FaBars,
  FaHouse,
  FaDumbbell,
  FaCalendarDay,
  FaTrophy,
} from "react-icons/fa6";

const links = [
  { icon: <FaHouse />, label: "Dashboard", href: "/dashboard" },
  { icon: <FaDumbbell />, label: "Practice", href: "/practice" },
  { icon: <FaCalendarDay />, label: "Daily Challenge", href: "/daily" },
  { icon: <FaTrophy />, label: "Leaderboard", href: "/leaderboard" },
];

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`sidebar ${expanded ? "expanded" : ""}`}>
      <button className="hamburger" onClick={() => setExpanded((p) => !p)}>
        <FaBars />
      </button>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <a key={link.label} href={link.href} className="sidebar-link">
            <span className="sidebar-icon">{link.icon}</span>
            {expanded && <span className="sidebar-label">{link.label}</span>}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
