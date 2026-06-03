"use client";
import { CLASSES } from "@/config/classes";
import { FaCheck, FaXmark } from "react-icons/fa6";

const AdminClasses = () => {
  return (
    <div>
      <h1 className="admin-page-title">Classes & Topics</h1>
      <p
        style={{
          color: "var(--muted)",
          fontSize: "14px",
          marginBottom: "1.5rem",
        }}
      >
        To add or modify classes and topics, update{" "}
        <code>src/config/classes.ts</code>.
      </p>

      {CLASSES.map((cls) => (
        <div
          key={cls.id}
          className="admin-card"
          style={{ marginBottom: "1rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "1rem",
            }}
          >
            <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>{cls.label}</h2>
            <span
              className={`admin-tag ${cls.available ? "student" : "admin"}`}
            >
              {cls.available ? "Available" : "Coming Soon"}
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "var(--muted)",
                marginLeft: "auto",
              }}
            >
              {cls.topics.length} topics · {cls.modes.length} modes
            </span>
          </div>

          {cls.topics.length > 0 && (
            <>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--muted)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Topics
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "1rem",
                }}
              >
                {cls.topics.map((t) => (
                  <span
                    key={t.id}
                    style={{
                      fontSize: "12px",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      background: `${t.color}20`,
                      color: t.color,
                      fontWeight: 600,
                    }}
                  >
                    {t.label}
                  </span>
                ))}
              </div>
            </>
          )}

          {cls.modes.length > 0 && (
            <>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--muted)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Modes
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {cls.modes.map((m) => (
                  <span
                    key={m.id}
                    style={{
                      fontSize: "12px",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      background: `${m.color}20`,
                      color: m.color,
                      fontWeight: 600,
                    }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminClasses;
