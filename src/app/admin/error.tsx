"use client";
import { useRouter } from "next/navigation";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="admin-card" style={{ textAlign: "center", padding: "48px 24px" }}>
      <h2 style={{ color: "var(--danger)" }}>Something went wrong</h2>
      <p style={{ color: "var(--muted)", marginTop: "8px" }}>
        This admin page hit an unexpected error.
      </p>
      <div
        style={{
          display: "flex",
          gap: "12px",
          justifyContent: "center",
          marginTop: "16px",
        }}
      >
        <button className="admin-btn secondary" onClick={() => reset()}>
          Try again
        </button>
        <button
          className="admin-btn primary"
          onClick={() => router.push("/admin")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
