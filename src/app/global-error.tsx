"use client";
import "./globals.css";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else if (theme === 'system' || !theme) {
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      document.documentElement.classList.add('dark');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            textAlign: "center",
            padding: "24px",
          }}
        >
          <h1 style={{ color: "var(--danger)" }}>Something went wrong</h1>
          <p style={{ color: "var(--muted)" }}>
            The app hit an unexpected error. You can try again or head back
            home.
          </p>
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button
              onClick={() => reset()}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                background: "var(--blue)",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/* Plain anchor intentionally: the root layout/app tree may be
                broken here, so this needs a full page reload, not client
                navigation. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            >
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
