"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import "./admin.css";
import Link from "next/link";
import {
  FaUsers,
  FaCircleQuestion,
  FaBook,
  FaRightFromBracket,
  FaGauge,
} from "react-icons/fa6";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    axios
      .get("/api/admin/verify")
      .then(() => setChecking(false))
      .catch(() => router.push("/dashboard"));
  }, []);

  if (checking) return <div className="admin-loading">Verifying access...</div>;

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h1>ciscogni</h1>
          <span className="admin-badge">Admin</span>
        </div>

        <nav className="admin-nav">
          <Link href="/admin" className="admin-nav-item">
            <FaGauge /> Dashboard
          </Link>
          <Link href="/admin/users" className="admin-nav-item">
            <FaUsers /> Users
          </Link>
          <Link href="/admin/questions" className="admin-nav-item">
            <FaCircleQuestion /> Questions
          </Link>
          <Link href="/admin/classes" className="admin-nav-item">
            <FaBook /> Classes & Topics
          </Link>
        </nav>

        <button
          className="admin-logout"
          onClick={() => router.push("/dashboard")}
        >
          <FaRightFromBracket /> Back to App
        </button>
      </div>

      <div className="admin-content">{children}</div>
    </div>
  );
}
