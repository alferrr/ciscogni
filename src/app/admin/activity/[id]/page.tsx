"use client";
import { use, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import QuizResultView, {
  type QuizResult,
} from "@/components/QuizResultView/QuizResultView";

export default function QuizResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">(
    "loading",
  );

  useEffect(() => {
    axios
      .get(`/api/admin/activity/${id}`)
      .then(({ data }) => {
        setResult(data);
        setStatus("ready");
      })
      .catch(() => setStatus("missing"));
  }, [id]);

  return (
    <div>
      <Link href="/admin/activity" className="admin-btn secondary">
        <FaArrowLeft /> Back to Activity Logs
      </Link>

      {status === "loading" && <p className="activity-muted" style={{ marginTop: "1rem" }}>Loading...</p>}
      {status === "missing" && (
        <div className="admin-card" style={{ padding: "1.5rem", marginTop: "1rem" }}>
          No saved results were found for this quiz.
        </div>
      )}
      {status === "ready" && result && <QuizResultView result={result} />}
    </div>
  );
}
