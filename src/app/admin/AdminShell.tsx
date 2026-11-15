"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import "./admin.css";
import "./shell.css";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import Link from "next/link";
import {
  FaUsers,
  FaCircleQuestion,
  FaBook,
  FaRightFromBracket,
  FaGauge,
  FaListCheck,
  FaEye,
  FaMagnifyingGlass,
  FaClockRotateLeft,
} from "react-icons/fa6";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: <FaGauge />, exact: true },
  { href: "/admin/users", label: "Users", icon: <FaUsers /> },
  { href: "/admin/questions", label: "Questions", icon: <FaCircleQuestion /> },
  { href: "/admin/classes", label: "Classes", icon: <FaBook /> },
  { href: "/admin/seo", label: "SEO", icon: <FaMagnifyingGlass /> },
  { href: "/admin/checklist", label: "Checklist", icon: <FaListCheck /> },
  { href: "/admin/preview", label: "UI Preview", icon: <FaEye /> },
  { href: "/admin/activity", label: "Activity", icon: <FaClockRotateLeft /> },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [me, setMe] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setMe(JSON.parse(stored));
    } catch {
      /* unreadable cache: the top bar just omits the name */
    }
  }, []);

  useEffect(() => {
    axios
      .get("/api/admin/verify")
      .then(() => setChecking(false))
      .catch(() => router.push("/dashboard"));
  }, []);

  if (checking) return <div className="admin-loading">Verifying access...</div>;

  const initials = (me?.name ?? "A")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="admin-shell">
      <nav className="admin-rail" aria-label="Admin">
        <Link href="/admin" className="admin-rail-logo" aria-label="Admin home">
          c
        </Link>
        {NAV_ITEMS.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-rail-link ${active ? "active" : ""}`}
              data-label={item.label}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
            >
              {item.icon}
            </Link>
          );
        })}
        <span className="admin-rail-spacer" />
        <button
          className="admin-rail-link"
          data-label="Back to app"
          aria-label="Back to app"
          onClick={() => router.push("/dashboard")}
        >
          <FaRightFromBracket />
        </button>
      </nav>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-wordmark">
            ciscogni <span className="admin-badge">Admin</span>
          </div>
          <div className="admin-topbar-user">
            <ThemeToggle />
            <span className="admin-avatar" aria-hidden>
              {initials}
            </span>
            {me?.name && (
              <div className="admin-user-text">
                <strong>{me.name}</strong>
                {me.email && <span>{me.email}</span>}
              </div>
            )}
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
