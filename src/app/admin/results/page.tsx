"use client";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { FaArrowsRotate } from "react-icons/fa6";
import AdminTableSkeleton from "@/components/Skeleton/AdminTableSkeleton";
import { formatTime } from "@/lib/activityText";

type Result = {
  id: number;
  createdAt: string;
  mode: "practice" | "midterms" | "finals";
  score: number;
  total: number;
  name: string | null;
  studentId: string | null;
  course: string | null;
};

const MODE_LABELS: Record<string, string> = {
  practice: "Practice",
  midterms: "Midterms exam",
  finals: "Finals exam",
};

const AdminQuizResults = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("");

  const perPage = 20;

  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/admin/quiz-results", {
        params: { page, perPage, q: query || undefined, mode: mode || undefined },
      });
      setResults(data.results);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, query, mode]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchResults();
  }, [fetchResults]);

  return (
    <div>
      <h1 className="admin-page-title">Quiz Results</h1>

      <div className="activity-filters">
        <label className="activity-field grow">
          <span>Search student</span>
          <input
            className="admin-search"
            placeholder="Name or student ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label className="activity-field">
          <span>Quiz type</span>
          <select
            className="activity-select"
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All quizzes</option>
            {Object.entries(MODE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <button
          className="admin-btn secondary activity-refresh"
          onClick={fetchResults}
        >
          <FaArrowsRotate /> Refresh
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Finished</th>
                <th>Student</th>
                <th>Course</th>
                <th>Quiz</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {loading && <AdminTableSkeleton columns={5} />}
              {!loading && results.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      color: "var(--muted)",
                      padding: "2rem",
                    }}
                  >
                    No quiz results yet.
                  </td>
                </tr>
              )}
              {!loading &&
                results.map((r) => {
                  const pct = r.total ? Math.round((r.score / r.total) * 100) : 0;
                  return (
                    <tr key={r.id}>
                      <td style={{ whiteSpace: "nowrap", fontSize: "13px" }}>
                        {formatTime(r.createdAt)}
                      </td>
                      <td>
                        {r.name ?? "Unknown"}
                        {r.studentId && (
                          <span style={{ color: "var(--muted)" }}>
                            {" "}
                            ({r.studentId})
                          </span>
                        )}
                      </td>
                      <td>{r.course}</td>
                      <td>{MODE_LABELS[r.mode] ?? r.mode}</td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <strong>
                          {r.score} / {r.total}
                        </strong>{" "}
                        <span style={{ color: "var(--muted)" }}>({pct}%)</span>
                      </td>
                    </tr>
                  );
                })}
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
            Page {page} of {totalPages} · {total} results
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

export default AdminQuizResults;
