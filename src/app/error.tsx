"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        textAlign: "center",
        padding: "24px",
      }}
    >
      <h1 style={{ color: "var(--danger)" }}>Something went wrong</h1>
      <p style={{ color: "var(--muted)" }}>
        This page hit an unexpected error. You can try again or head back to
        your dashboard.
      </p>
      <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
        <button
          onClick={() => reset()}
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            background: "var(--blue)",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        <a
          href="/dashboard"
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}
