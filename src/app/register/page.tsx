"use client";
import React, { useState } from "react";
import "../login/Login.css";
import Logo from "../../../public/assets/images/logo.png";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import axios from "axios";

const Register = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/auth/register", {
        name,
        email,
        password,
        year,
        course,
      });

      showToast("Login with your credentials", "success");
      router.push("/");
    } catch (err: any) {
      showToast("Something went wrong", "error");
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
          <p>Fill in the details below to get started.</p>

          <div className="input">
            <p>Name</p>
            <input
              type="text"
              placeholder="Juan Dela Cruz"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          <div className="form-group">
            <div className="input select">
              <p>Year</p>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            <div className="input">
              <p>Course</p>
              <input
                type="text"
                placeholder="BSIT"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
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
