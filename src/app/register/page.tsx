"use client";
import React, { useState } from "react";
import "../login/Login.css";
import Logo from "../../../public/assets/images/logo.png";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import axios from "axios";
import { COURSES } from "@/config/courses";

const Register = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [studentId, setStudentId] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/auth/register", { studentId, course, year });
      showToast("Account created! You can now sign in.", "success");
      router.push("/");
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Something went wrong.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="photo"></div>
      <div className="form">
        <div className="form-top">
          <Image src={Logo} alt="Ciscogni logo" className="logo" />
          <ThemeToggle />
        </div>

        <form onSubmit={handleRegister}>
          <h2>
            Create an <span>Account</span>
          </h2>
          <p>Enter your student ID to get started.</p>

          <div className="input">
            <p>Student ID</p>
            <input
              type="text"
              placeholder="19020241"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>

          <div className="input">
            <p>Course</p>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            >
              <option value="">Select course</option>
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="input">
            <p>Year</p>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            >
              <option value="">Select year</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>

          <p className="password-hint">
            Your default password is your{" "}
            <strong>last name + student ID</strong> (e.g. mercado19020241)
          </p>

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="signup">
          Already have an account? <a href="/">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
