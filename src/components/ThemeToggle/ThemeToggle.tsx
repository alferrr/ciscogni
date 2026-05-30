"use client";
import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import "./ThemeToggle.css";

import { FaMoon } from "react-icons/fa6";
import { FaSun } from "react-icons/fa6";
import { FaLaptopCode } from "react-icons/fa6";

const options = [
  { value: "light", label: "Light", icon: <FaSun /> },
  { value: "dark", label: "Dark", icon: <FaMoon /> },
  { value: "system", label: "System", icon: <FaLaptopCode /> },
] as const;

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = options.find((o) => o.value === theme);

  return (
    <div className="theme-toggle" ref={ref}>
      <button
        className="theme-icon-btn"
        onClick={() => setOpen((p) => !p)}
        aria-label="Toggle theme"
      >
        <span>{current?.icon}</span>
      </button>

      {open && (
        <div className="theme-dropdown">
          {options.map((o) => (
            <button
              key={o.value}
              className={`theme-option ${theme === o.value ? "active" : ""}`}
              onMouseDown={(e) => {
                e.stopPropagation();
                setTheme(o.value);
                setOpen(false);
              }}
            >
              <span>{o.icon}</span>
              <span>{o.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
