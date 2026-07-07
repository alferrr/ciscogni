"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaMagnifyingGlass } from "react-icons/fa6";
import { useToast } from "@/context/ToastContext";
import AdminTableSkeleton from "@/components/Skeleton/AdminTableSkeleton";

const AdminUsers = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/api/admin/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    try {
      await axios.delete("/api/admin/users", { data: { id } });
      showToast("User deleted.", "success");
      fetchUsers();
    } catch {
      showToast("Failed to delete user.", "error");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h1 className="admin-page-title">Users</h1>
      <input
        className="admin-search"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Year</th>
                <th>XP</th>
                <th>Streak</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading && <AdminTableSkeleton columns={8} />}
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td style={{ color: "var(--muted)", fontSize: "13px" }}>
                    {u.email}
                  </td>
                  <td>{u.course}</td>
                  <td>{u.year}</td>
                  <td>{u.xp}</td>
                  <td>{u.streak}</td>
                  <td>
                    <span className={`admin-tag ${u.role}`}>{u.role}</span>
                  </td>
                  <td>
                    {u.role !== "admin" && (
                      <button
                        className="admin-btn danger"
                        onClick={() => handleDelete(u.id, u.name)}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
