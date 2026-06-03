"use client";
import { useState, useEffect } from "react";
import { BarLoader } from "react-spinners";
import "./Loader.css";

const messages = [
  "Shuffling questions...",
  "Warming up your brain...",
  "Loading brain exercises...",
  "Preparing the challenge...",
  "Almost there...",
  "Getting things ready...",
  "Fetching questions...",
  "Setting up the arena...",
];

interface LoaderProps {
  message?: string;
}

const Loader = ({ message }: LoaderProps) => {
  const [currentMessage, setCurrentMessage] = useState("Loading...");
  const [dots, setDots] = useState("");

  useEffect(() => {
    setCurrentMessage(
      message ?? messages[Math.floor(Math.random() * messages.length)],
    );

    if (message) return;

    const interval = setInterval(() => {
      setCurrentMessage(messages[Math.floor(Math.random() * messages.length)]);
    }, 2000);
    return () => clearInterval(interval);
  }, [message]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loader-wrapper">
      <div className="loader-card">
        <div className="loader-icon">
          <span>{"{ }"}</span>
        </div>
        <p className="loader-message">
          {currentMessage}
          <span className="loader-dots">{dots}</span>
        </p>
        <BarLoader color="#1752f0" width={200} height={4} />
      </div>
    </div>
  );
};

export default Loader;
