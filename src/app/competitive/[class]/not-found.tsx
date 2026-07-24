import Header from "@/components/Header/Header";
import Link from "next/link";
import "../competitive.css";

export default function CompetitiveClassNotFound() {
  return (
    <>
      <Header />
      <div className="competitive">
        <div className="container">
          <p className="loading">
            That class doesn&apos;t exist.{" "}
            <Link href="/competitive">Back to Classes</Link>
          </p>
        </div>
      </div>
    </>
  );
}
