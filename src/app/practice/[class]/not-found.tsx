import Header from "@/components/Header/Header";
import Link from "next/link";
import "../practice.css";

export default function PracticeClassNotFound() {
  return (
    <>
      <Header />
      <div className="practice">
        <div className="container">
          <div className="coming-soon-box">
            <h2>Class not found</h2>
            <p>That class doesn&apos;t exist.</p>
            <Link className="back-btn" href="/practice">
              Back to Classes
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
