"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaPen, FaXmark } from "react-icons/fa6";
import { useToast } from "@/context/ToastContext";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import AdminTableSkeleton from "@/components/Skeleton/AdminTableSkeleton";
import { COURSES } from "@/config/courses";

const ROLES = ["student", "teacher", "admin"];

const AdminUsers = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", role: "student", course: "", year: "" });
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const perPage = 20;

  const fetchUsers = async () => {
    setLoading(true);
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
    const stored = localStorage.getItem("user");
    if (stored) setCurrentUserId(JSON.parse(stored).id ?? null);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const openEdit = (u: any) => {
    setEditing(u);
    setForm({ name: u.name, role: u.role, course: u.course, year: u.year });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.course || !form.year) {
      showToast("Please fill in all fields.", "error");
      return;
    }
    try {
      await axios.put("/api/admin/users", { id: editing.id, ...form });
      showToast("User updated.", "success");
      setShowModal(false);
      fetchUsers();
    } catch {
      showToast("Something went wrong.", "error");
    }
  };

  const handleDelete = async (id: number) => {
    setPendingDelete(null);
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

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const isEditingSelf = editing && editing.id === currentUserId;

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
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Course</th>
                <th scope="col" className="num">Year</th>
                <th scope="col" className="num">XP</th>
                <th scope="col" className="num">Streak</th>
                <th scope="col">Role</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && <AdminTableSkeleton columns={8} />}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      textAlign: "center",
                      color: "var(--muted)",
                      padding: "2rem",
                    }}
                  >
                    {search ? (
                      <>
                        No users match &ldquo;{search}&rdquo;.{" "}
                        <button
                          className="admin-link-btn"
                          onClick={() => setSearch("")}
                        >
                          Clear search
                        </button>
                      </>
                    ) : (
                      "No users yet."
                    )}
                  </td>
                </tr>
              )}

              {!loading &&
                paginated.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td style={{ color: "var(--muted)", fontSize: "13px" }}>
                      {u.email}
                    </td>
                    <td>{u.course}</td>
                    <td className="num">{u.year}</td>
                    <td className="num">{u.xp}</td>
                    <td className="num">{u.streak}</td>
                    <td>
                      <span className={`admin-tag ${u.role}`}>{u.role}</span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          className="admin-btn secondary"
                          aria-label={`Edit ${u.name}`}
                          onClick={() => openEdit(u)}
                        >
                          <FaPen />
                        </button>
                        {u.role !== "admin" && (
                          <button
                            className="admin-btn danger"
                            aria-label={`Delete ${u.name}`}
                            onClick={() =>
                              setPendingDelete({ id: u.id, name: u.name })
                            }
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="admin-pagination">
          <button
            className="admin-btn secondary"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>

          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2,
              )
              .reduce((acc: (number | string)[], p, i, arr) => {
                if (i > 0 && (p as number) - (arr[i - 1] as number) > 1)
                  acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className="pagination-dots">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    className={`pagination-page ${page === p ? "active" : ""}`}
                    onClick={() => setPage(p as number)}
                  >
                    {p}
                  </button>
                ),
              )}
          </div>

          <button
            className="admin-btn secondary"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>

          <span className="pagination-info">
            {(page - 1) * perPage + 1}–
            {Math.min(page * perPage, filtered.length)} of {filtered.length}
          </span>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit User</h2>
              <button onClick={() => setShowModal(false)}>
                <FaXmark />
              </button>
            </div>

            <div className="admin-form">
              <div className="form-field">
                <label>Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Course</label>
                  <select
                    value={form.course}
                    onChange={(e) =>
                      setForm({ ...form, course: e.target.value })
                    }
                  >
                    <option value="">Select course</option>
                    {COURSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>Year</label>
                  <input
                    value={form.year}
                    onChange={(e) =>
                      setForm({ ...form, year: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Role</label>
                <select
                  value={form.role}
                  disabled={isEditingSelf}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {isEditingSelf && (
                  <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>
                    You can&apos;t change your own role.
                  </p>
                )}
              </div>

              <div className="form-actions">
                <button
                  className="admin-btn secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="admin-btn primary" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title={`Delete ${pendingDelete.name}?`}
          description="This permanently removes the account and cannot be undone."
          confirmLabel="Delete user"
          onConfirm={() => handleDelete(pendingDelete.id)}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
};

export default AdminUsers;
