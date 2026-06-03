"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaCircleQuestion, FaTrophy, FaFire } from "react-icons/fa6";

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetch = async () => {
      const [users, questions] = await Promise.all([
        axios.get("/api/admin/users"),
        axios.get("/api/admin/questions"),
      ]);
      setStats({
        users: users.data.length,
        questions: questions.data.length,
        students: users.data.filter((u: any) => u.role === "student").length,
        admins: users.data.filter((u: any) => u.role === "admin").length,
      });
    };
    fetch();
  }, []);

  return (
    <div>
      <h1 className="admin-page-title">Admin Dashboard</h1>
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <p className="stat-label">
            <FaUsers /> Total Users
          </p>
          <p className="stat-value">{stats?.users ?? "—"}</p>
        </div>
        <div className="admin-stat-card">
          <p className="stat-label">
            <FaUsers /> Students
          </p>
          <p className="stat-value">{stats?.students ?? "—"}</p>
        </div>
        <div className="admin-stat-card">
          <p className="stat-label">
            <FaCircleQuestion /> Questions
          </p>
          <p className="stat-value">{stats?.questions ?? "—"}</p>
        </div>
        <div className="admin-stat-card">
          <p className="stat-label">
            <FaTrophy /> Admins
          </p>
          <p className="stat-value">{stats?.admins ?? "—"}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
