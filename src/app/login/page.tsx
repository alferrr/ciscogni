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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post("/api/auth/login", { email, password });

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
          <p>Enter your email and password to continue.</p>

          <div className="input">
            <p>Email</p>
            <input
              type="email"
              placeholder="19020241@usc.edu.ph"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input">
            <p>Password</p>
            <input
              type="password"
              placeholder="*******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="signup">
          Don&apos;t have an account? <a href="/register">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
