"use client";
import React, { useState } from "react";
import "./Login.css";
import Logo from "../../../public/assets/images/logo.png";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import axios from "axios";
import Cookies from "js-cookie";

const Login = () => {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post("/api/auth/login", {
        studentId,
        password,
      });

      Cookies.remove("token");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      Cookies.set("token", data.token, { expires: 7 });

      showToast("Welcome back!", "success");
      router.push("/dashboard");
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

        <form onSubmit={handleLogin}>
          <h2>
            Welcome to <span>Ciscogni</span>
          </h2>
          <p>Sign in with your student ID and default password.</p>

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
            <p>Password</p>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                setHasSpecialChar(/[^a-zA-Z0-9]/.test(value));
              }}
              className={hasSpecialChar ? "special-char" : ""}
              required
            />
            {hasSpecialChar && (
              <div className="special-char-popup">
                Special letters are simplified (e.g. ñ → n).
              </div>
            )}
          </div>

          <div className="password-hint">
            <ul>
              <li>Can&apos;t sign in? Contact a Cisco officer for help.</li>
            </ul>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
