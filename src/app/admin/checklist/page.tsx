"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaPlus } from "react-icons/fa6";
import { useToast } from "@/context/ToastContext";
import AdminTableSkeleton from "@/components/Skeleton/AdminTableSkeleton";

interface Task {
  id: number;
  text: string;
  done: boolean;
}

const AdminChecklist = () => {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get("/api/admin/tasks");
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setAdding(true);
    try {
      await axios.post("/api/admin/tasks", { text });
      setText("");
      fetchTasks();
    } catch {
      showToast("Failed to add item.", "error");
    } finally {
      setAdding(false);
    }
  };

  const toggleDone = async (task: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)),
    );
    try {
      await axios.put("/api/admin/tasks", { id: task.id, done: !task.done });
    } catch {
      showToast("Failed to update item.", "error");
      fetchTasks();
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete("/api/admin/tasks", { data: { id } });
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      showToast("Failed to delete item.", "error");
    }
  };

  const pending = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <div>
      <h1 className="admin-page-title">Checklist</h1>

      <form className="admin-card" onSubmit={handleAdd} style={{ display: "flex", gap: "10px" }}>
        <input
          className="admin-search"
          style={{ margin: 0, flex: 1 }}
          placeholder="Add a to-do or note..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="admin-btn primary" type="submit" disabled={adding}>
          <FaPlus /> Add
        </button>
      </form>

      <div className="admin-card">
        {loading && (
          <table className="admin-table">
            <tbody>
              <AdminTableSkeleton columns={1} />
            </tbody>
          </table>
        )}

        {!loading && tasks.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--muted)", padding: "2rem" }}>
            Nothing here yet. Add your first note above.
          </p>
        )}

        {!loading && tasks.length > 0 && (
          <div className="checklist-list">
            {pending.map((t) => (
              <div key={t.id} className="checklist-item">
                <label className="checklist-label">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleDone(t)}
                  />
                  <span>{t.text}</span>
                </label>
                <button
                  className="admin-btn danger"
                  onClick={() => handleDelete(t.id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}

            {done.length > 0 && (
              <>
                <p className="checklist-divider">Done ({done.length})</p>
                {done.map((t) => (
                  <div key={t.id} className="checklist-item">
                    <label className="checklist-label">
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => toggleDone(t)}
                      />
                      <span className="checklist-text-done">{t.text}</span>
                    </label>
                    <button
                      className="admin-btn danger"
                      onClick={() => handleDelete(t.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChecklist;
