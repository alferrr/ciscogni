"use client";
import React, { useState, useRef, useEffect } from "react";
import "./Header.css";
import { FaFire, FaRegUser, FaBars, FaXmark } from "react-icons/fa6";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Header = () => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [streak, setStreak] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setStreak(parsed.streak || 0);
      setIsAdmin(parsed.role == "admin" ? true : false);
    } else {
      setStreak(0);
    }
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleMenu = () => {
    if (menuOpen) {
      setMenuOpen(false);
      setTimeout(() => setMenuVisible(false), 300);
    } else {
      setMenuVisible(true);
      setTimeout(() => setMenuOpen(true), 10);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    Cookies.remove("token");
    router.push("/");
  };

  return (
    <div className="header">
      <a href="/dashboard">
        <h1>ciscogni</h1>
      </a>

      <div className="header-group desktop-nav">
        <a href="/practice">Practice</a>
        <a href="/daily">Daily</a>
        <a href="/leaderboard">Leaderboard</a>
        <a href="/competitive">Competitive</a>
      </div>

      <div className="header-group">
        {streak !== null && (
          <span className={`streak ${streak > 0 ? "active" : ""}`}>
            <FaFire />
            {streak}
          </span>
        )}

        <ThemeToggle />

        <div className="user-menu" ref={dropdownRef}>
          <button
            className="user-icon-btn"
            onClick={() => setDropdownOpen((p) => !p)}
            aria-label="User menu"
          >
            <FaRegUser />
          </button>

          {dropdownOpen && (
            <div className="user-dropdown">
              <button onMouseDown={() => router.push("/profile")}>
                Profile
              </button>

              <button onMouseDown={handleLogout}>Logout</button>

              {isAdmin && (
                <button onMouseDown={() => router.push("/admin")}>Admin</button>
              )}
            </div>
          )}
        </div>

        <button
          className="hamburger-btn"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          {menuOpen ? <FaXmark /> : <FaBars />}
        </button>
      </div>

      {menuVisible && (
        <div className={`mobile-menu ${menuOpen ? "open" : "closing"}`}>
          <a href="/practice" onClick={toggleMenu}>
            Practice
          </a>
          <a href="/daily" onClick={toggleMenu}>
            Daily
          </a>
          <a href="/leaderboard" onClick={toggleMenu}>
            Leaderboard
          </a>
          <a href="/competitive" onClick={toggleMenu}>
            Competitive
          </a>
          <button className="mobile-logout" onMouseDown={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
