export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const cron = await import("node-cron");
  const { resetExpiredStreaks } = await import("@/lib/streakReset");

  // Catch anything that already expired before this boot, then keep it current daily.
  resetExpiredStreaks().catch((err) =>
    console.error("[streak-reset] initial run failed", err),
  );

  cron.schedule("0 0 * * *", () => {
    resetExpiredStreaks().catch((err) =>
      console.error("[streak-reset] scheduled run failed", err),
    );
  });
}
