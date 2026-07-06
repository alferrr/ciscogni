"use client";
import { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

// Clears stale auth state and returns to the login page whenever
// any API call comes back 401 (expired or invalid token).
const AuthInterceptor = () => {
  useEffect(() => {
    const id = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        const status = err?.response?.status;
        const url: string = err?.config?.url ?? "";
        if (status === 401 && !url.includes("/api/auth/")) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          Cookies.remove("token");
          if (window.location.pathname !== "/") {
            window.location.href = "/";
          }
        }
        return Promise.reject(err);
      },
    );
    return () => axios.interceptors.response.eject(id);
  }, []);

  return null;
};

export default AuthInterceptor;
