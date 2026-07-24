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

const SNIPPETS = [
  "const x = 1;",
  "if (x > 0) {",
  "return true;",
  "function solve() {",
  "for (i = 0; i < n; i++)",
];

const TYPE_SPEED = 70;
const DELETE_SPEED = 35;
const PAUSE_AFTER_TYPE = 1200;
const PAUSE_AFTER_DELETE = 300;

interface LoaderProps {
  message?: string;
}

const Loader = ({ message }: LoaderProps) => {
  const [currentMessage, setCurrentMessage] = useState("Loading...");
  const [dots, setDots] = useState("");
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [deleting, setDeleting] = useState(false);

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

  useEffect(() => {
    const snippet = SNIPPETS[snippetIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting) {
      if (typedText.length < snippet.length) {
        timeout = setTimeout(
          () => setTypedText(snippet.slice(0, typedText.length + 1)),
          TYPE_SPEED,
        );
      } else {
        timeout = setTimeout(() => setDeleting(true), PAUSE_AFTER_TYPE);
      }
    } else {
      if (typedText.length > 0) {
        timeout = setTimeout(
          () => setTypedText(snippet.slice(0, typedText.length - 1)),
          DELETE_SPEED,
        );
      } else {
        timeout = setTimeout(() => {
          setDeleting(false);
          setSnippetIndex((i) => (i + 1) % SNIPPETS.length);
        }, PAUSE_AFTER_DELETE);
      }
    }

    return () => clearTimeout(timeout);
  }, [typedText, deleting, snippetIndex]);

  return (
    <div className="loader-wrapper">
      <div className="loader-card">
        <div className="loader-icon">
          <span className="loader-typed">{typedText}</span>
          <span className="loader-cursor">|</span>
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
