"use client";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { FaArrowsRotate } from "react-icons/fa6";
import AdminTableSkeleton from "@/components/Skeleton/AdminTableSkeleton";
import {
  actionType,
  categoryLabel,
  describeAction,
  formatTime,
} from "@/lib/activityText";

type LogRow = {
  id: number;
  userId: number | null;
  userName: string | null;
  userRole: string | null;
  studentId: string | null;
  action: string;
  category: string;
  target: string | null;
  details: string | null;
  userAgent: string | null;
  createdAt: string;
};

const AdminActivity = () => {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const perPage = 50;

  // Debounce the free-text search so we don't query on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/admin/activity", {
        params: {
          page,
          perPage,
          q: query || undefined,
          category: category || undefined,
          from: from ? new Date(`${from}T00:00:00`).toISOString() : undefined,
          // "to" is inclusive of the chosen day.
          to: to
            ? new Date(
                new Date(`${to}T00:00:00`).getTime() + 86400000,
              ).toISOString()
            : undefined,
        },
      });
      setLogs(data.logs);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setCategories(data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, query, category, from, to]);

  useEffect(() => {
    // Data fetching on filter/page change; loading state mirrors the request.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div>
      <h1 className="admin-page-title">Activity Logs</h1>

      <div className="activity-filters">
        <input
          className="admin-search"
          placeholder="Search by user, activity or details..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="activity-select"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All activity</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {categoryLabel(c)}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="activity-select"
          value={from}
          onChange={(e) => {
            setFrom(e.target.value);
            setPage(1);
          }}
          aria-label="From date"
        />
        <input
          type="date"
          className="activity-select"
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
            setPage(1);
          }}
          aria-label="To date"
        />
        <button className="admin-btn secondary" onClick={fetchLogs}>
          <FaArrowsRotate /> Refresh
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Description</th>
                <th>Action Type</th>
              </tr>
            </thead>
            <tbody>
              {loading && <AdminTableSkeleton columns={4} />}
              {!loading && logs.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      textAlign: "center",
                      color: "var(--muted)",
                      padding: "2rem",
                    }}
                  >
                    No activity found.
                  </td>
                </tr>
              )}
              {!loading &&
                logs.map((l) => (
                  <tr
                    key={l.id}
                    className="activity-row"
                    onClick={() => setExpanded(expanded === l.id ? null : l.id)}
                  >
                    <td>
                      <span className="activity-pill">
                        {formatTime(l.createdAt)}
                      </span>
                    </td>
                    <td>
                      <span className="activity-pill">{l.userId ?? "—"}</span>
                    </td>
                    <td className="activity-description">
                      {describeAction(l)}
                      {expanded === l.id && l.userAgent && (
                        <div className="activity-ua">{l.userAgent}</div>
                      )}
                    </td>
                    <td>
                      <span className={`activity-action ${l.category}`}>
                        {actionType(l.action)}
                      </span>
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
          <span className="pagination-info">
            Page {page} of {totalPages} · {total} entries
          </span>
          <button
            className="admin-btn secondary"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminActivity;
