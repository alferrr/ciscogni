"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaPen, FaPlus, FaXmark } from "react-icons/fa6";
import { useToast } from "@/context/ToastContext";
import { CLASSES } from "@/config/classes";

const TOPICS = [
  "intro_programming",
  "c_structure",
  "functions",
  "builtin_functions",
  "control_structure_1",
  "control_structure_2",
  "testing_debugging",
  "arrays_pointers",
];

const TYPES = [
  "output_prediction",
  "bug_detection",
  "logic_tracing",
  "concept",
];
const MODES = ["practice", "midterms", "finals"];
const DIFFICULTIES = ["easy", "medium", "hard"];

const emptyForm = {
  type: "concept",
  topic: "intro_programming",
  mode: "practice",
  difficulty: "easy",
  questionText: "",
  codeSnippet: "",
  choices: ["", "", "", ""],
  correctAnswer: "",
  explanation: "",
};

const AdminQuestions = () => {
  const { showToast } = useToast();
  const [activeClass, setActiveClass] = useState("prog1");
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState("all");
  const [filterTopic, setFilterTopic] = useState("all");
  const [page, setPage] = useState(1);

  const currentClass = CLASSES.find((c) => c.id === activeClass);
  const topicsForClass = currentClass?.topics.map((t) => t.id) ?? TOPICS;
  const modesForClass = currentClass?.modes.map((m) => m.id) ?? [];
  const perPage = 20;

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/admin/questions");
      setQuestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({
      ...emptyForm,
      topic: topicsForClass[0] ?? "intro_programming",
      mode: modesForClass[0] ?? "practice",
    });
    setShowModal(true);
  };

  const openEdit = (q: any) => {
    setEditing(q);
    setForm({
      type: q.type,
      topic: q.topic,
      mode: q.mode,
      difficulty: q.difficulty,
      questionText: q.questionText,
      codeSnippet: q.codeSnippet ?? "",
      choices: q.choices,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.questionText || !form.correctAnswer || !form.explanation) {
      showToast("Please fill in all required fields.", "error");
      return;
    }
    if (form.choices.some((c) => !c)) {
      showToast("All 4 choices must be filled in.", "error");
      return;
    }
    if (!form.choices.includes(form.correctAnswer)) {
      showToast("Correct answer must be one of the choices.", "error");
      return;
    }

    try {
      if (editing) {
        await axios.put("/api/admin/questions", { id: editing.id, ...form });
        showToast("Question updated.", "success");
      } else {
        await axios.post("/api/admin/questions", form);
        showToast("Question added.", "success");
      }
      setShowModal(false);
      fetchQuestions();
    } catch {
      showToast("Something went wrong.", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this question?")) return;
    try {
      await axios.delete("/api/admin/questions", { data: { id } });
      showToast("Question deleted.", "success");
      fetchQuestions();
    } catch {
      showToast("Failed to delete.", "error");
    }
  };

  const filtered = questions.filter((q) => {
    const matchClass = topicsForClass.includes(q.topic);
    const matchSearch = q.questionText
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchMode = filterMode === "all" || q.mode === filterMode;
    const matchTopic = filterTopic === "all" || q.topic === filterTopic;
    return matchClass && matchSearch && matchMode && matchTopic;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    setPage(1);
    setFilterMode("all");
    setFilterTopic("all");
    setSearch("");
  }, [activeClass]);

  useEffect(() => {
    setPage(1);
  }, [search, filterMode, filterTopic]);

  return (
    <div>
      <div className="admin-questions-header">
        <h1 className="admin-page-title" style={{ margin: 0 }}>
          Questions
        </h1>
        <button className="admin-btn primary" onClick={openAdd}>
          <FaPlus /> Add Question
        </button>
      </div>

      <div className="class-tabs">
        {CLASSES.map((c) => (
          <button
            key={c.id}
            className={`class-tab ${activeClass === c.id ? "active" : ""}`}
            onClick={() => setActiveClass(c.id)}
          >
            {c.label}
            {activeClass === c.id && (
              <span className="class-tab-count">
                {
                  questions.filter((q) =>
                    (c.topics.map((t) => t.id) ?? []).includes(q.topic),
                  ).length
                }
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="admin-filters">
        <input
          className="admin-search"
          style={{ margin: 0 }}
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="admin-search"
          style={{ margin: 0, width: "140px" }}
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value)}
        >
          <option value="all">All Modes</option>
          {(modesForClass.length > 0 ? modesForClass : MODES).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
          {modesForClass.length === 0 && (
            <option value="practice">practice</option>
          )}
        </select>
        <select
          className="admin-search"
          style={{ margin: 0, width: "200px" }}
          value={filterTopic}
          onChange={(e) => setFilterTopic(e.target.value)}
        >
          <option value="all">All Topics</option>
          {topicsForClass.map((t) => (
            <option key={t} value={t}>
              {t.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <span
          style={{
            fontSize: "13px",
            color: "var(--muted)",
            marginLeft: "auto",
          }}
        >
          {filtered.length} questions
        </span>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Type</th>
                <th>Topic</th>
                <th>Mode</th>
                <th>Difficulty</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      color: "var(--muted)",
                      padding: "2rem",
                    }}
                  >
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      color: "var(--muted)",
                      padding: "2rem",
                    }}
                  >
                    No questions found.
                  </td>
                </tr>
              )}

              {paginated.map((q) => (
                <tr key={q.id}>
                  <td style={{ maxWidth: "300px" }}>
                    <p
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {q.questionText}
                    </p>
                  </td>
                  <td>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                      {q.type.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                      {q.topic.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`admin-tag ${q.mode === "practice" ? "student" : q.mode === "midterms" ? "teacher" : "admin"}`}
                    >
                      {q.mode}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-tag ${q.difficulty}`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        className="admin-btn secondary"
                        onClick={() => openEdit(q)}
                      >
                        <FaPen />
                      </button>
                      <button
                        className="admin-btn danger"
                        onClick={() => handleDelete(q.id)}
                      >
                        <FaTrash />
                      </button>
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
              <h2>{editing ? "Edit Question" : "Add Question"}</h2>
              <button onClick={() => setShowModal(false)}>
                <FaXmark />
              </button>
            </div>

            <div className="admin-form">
              <div className="form-row">
                <div className="form-field">
                  <label>Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    {TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>Difficulty</label>
                  <select
                    value={form.difficulty}
                    onChange={(e) =>
                      setForm({ ...form, difficulty: e.target.value })
                    }
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Topic</label>
                  <select
                    value={form.topic}
                    onChange={(e) =>
                      setForm({ ...form, topic: e.target.value })
                    }
                  >
                    {topicsForClass.map((t) => (
                      <option key={t} value={t}>
                        {t.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>Mode</label>
                  <select
                    value={form.mode}
                    onChange={(e) => setForm({ ...form, mode: e.target.value })}
                  >
                    {MODES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>Question Text *</label>
                <textarea
                  value={form.questionText}
                  onChange={(e) =>
                    setForm({ ...form, questionText: e.target.value })
                  }
                  placeholder="What is the output of this code?"
                />
              </div>

              <div className="form-field">
                <label>Code Snippet (optional)</label>
                <textarea
                  value={form.codeSnippet}
                  onChange={(e) =>
                    setForm({ ...form, codeSnippet: e.target.value })
                  }
                  placeholder="int x = 5; ..."
                  style={{ fontFamily: "monospace", fontSize: "13px" }}
                />
              </div>

              <div className="form-field">
                <label>Choices *</label>
                {form.choices.map((c, i) => (
                  <input
                    key={i}
                    style={{ marginBottom: "6px" }}
                    value={c}
                    onChange={(e) => {
                      const updated = [...form.choices];
                      updated[i] = e.target.value;
                      setForm({ ...form, choices: updated });
                    }}
                    placeholder={`Choice ${i + 1}`}
                  />
                ))}
              </div>

              <div className="form-field">
                <label>Correct Answer *</label>
                <select
                  value={form.correctAnswer}
                  onChange={(e) =>
                    setForm({ ...form, correctAnswer: e.target.value })
                  }
                >
                  <option value="">Select correct answer</option>
                  {form.choices.filter(Boolean).map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Explanation *</label>
                <textarea
                  value={form.explanation}
                  onChange={(e) =>
                    setForm({ ...form, explanation: e.target.value })
                  }
                  placeholder="Explain why the answer is correct..."
                />
              </div>

              <div className="form-actions">
                <button
                  className="admin-btn secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="admin-btn primary" onClick={handleSave}>
                  {editing ? "Save Changes" : "Add Question"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuestions;
