"use client";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaArrowsRotate } from "react-icons/fa6";
import AdminTableSkeleton from "@/components/Skeleton/AdminTableSkeleton";
import { COMPLETE_ACTIONS } from "@/lib/quizActions";
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
  const router = useRouter();

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
        <label className="activity-field grow">
          <span>Search</span>
          <input
            className="admin-search"
            placeholder="Name or activity"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label className="activity-field">
          <span>Activity type</span>
          <select
            className="activity-select"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All types</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {categoryLabel(c)}
              </option>
            ))}
          </select>
        </label>
        <label className="activity-field">
          <span>From date</span>
          <input
            type="date"
            className="activity-select"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setPage(1);
            }}
          />
        </label>
        <label className="activity-field">
          <span>To date</span>
          <input
            type="date"
            className="activity-select"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setPage(1);
            }}
          />
        </label>
        <button className="admin-btn secondary activity-refresh" onClick={fetchLogs}>
          <FaArrowsRotate /> Refresh
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>What happened</th>
                <th>Type</th>
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
                    className={
                      COMPLETE_ACTIONS.includes(l.action) ? "activity-row" : ""
                    }
                    onClick={() =>
                      COMPLETE_ACTIONS.includes(l.action) &&
                      router.push(`/admin/activity/${l.id}`)
                    }
                  >
                    <td style={{ whiteSpace: "nowrap", fontSize: "13px" }}>
                      {formatTime(l.createdAt)}
                    </td>
                    <td>
                      {l.userName ?? (l.userId ? `User #${l.userId}` : "Anonymous")}
                      {l.userRole && (
                        <>
                          {" "}
                          <span className={`admin-tag ${l.userRole}`}>
                            {l.userRole}
                          </span>
                        </>
                      )}
                    </td>
                    <td className="activity-description">
                      {describeAction(l)}
                      {COMPLETE_ACTIONS.includes(l.action) && (
                        <span className="activity-view-link"> View results →</span>
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
