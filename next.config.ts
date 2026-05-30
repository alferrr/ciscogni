import type { NextConfig } from "next";

const nextConfig = {
  turbopack: {},
  serverExternalPackages: ["sequelize", "mysql2"],
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
  },
};

export default nextConfig;
