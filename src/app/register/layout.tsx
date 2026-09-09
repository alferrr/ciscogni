import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create your Ciscogni account with your USC student ID to start practicing Programming 1 and Programming 2 questions.",
  alternates: { canonical: "/register" },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
