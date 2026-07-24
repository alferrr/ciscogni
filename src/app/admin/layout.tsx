"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import "./admin.css";
import Link from "next/link";
import {
  FaUsers,
  FaCircleQuestion,
  FaBook,
  FaRightFromBracket,
  FaGauge,
  FaListCheck,
  FaEye,
} from "react-icons/fa6";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: <FaGauge />, exact: true },
  { href: "/admin/users", label: "Users", icon: <FaUsers /> },
  { href: "/admin/questions", label: "Questions", icon: <FaCircleQuestion /> },
  { href: "/admin/classes", label: "Classes", icon: <FaBook /> },
  { href: "/admin/checklist", label: "Checklist", icon: <FaListCheck /> },
  { href: "/admin/preview", label: "UI Preview", icon: <FaEye /> },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    axios
      .get("/api/admin/verify")
      .then(() => setChecking(false))
      .catch(() => router.push("/dashboard"));
  }, []);

  if (checking) return <div className="admin-loading">Verifying access...</div>;

  return (
    <div className="admin-shell">
      <div className="admin-panel">
        <header className="admin-topnav">
          <div className="admin-logo">
            <h1>ciscogni</h1>
            <span className="admin-badge">Admin</span>
          </div>

          <nav className="admin-pillnav">
            {NAV_ITEMS.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-pill ${active ? "active" : ""}`}
                >
                  {item.icon} {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            className="admin-exit-btn"
            onClick={() => router.push("/dashboard")}
          >
            <FaRightFromBracket /> Back to App
          </button>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
