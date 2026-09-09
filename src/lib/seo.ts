import { syncDB } from "@/lib/sync";
import SeoSetting from "@/models/SeoSetting";

const SINGLETON_ID = 1;

export type SeoSettingsData = {
  title: string;
  description: string;
  keywords: string;
  ogImageUrl: string | null;
};

const DEFAULTS: SeoSettingsData = {
  title: "Ciscogni — Programming Practice for USC Students",
  description:
    "Ciscogni is a gamified practice platform for USC (University of San Carlos) students taking Programming 1 and Programming 2. Drill output prediction, bug detection, and logic tracing questions with XP, streaks, and a class leaderboard.",
  keywords:
    "Ciscogni, USC, University of San Carlos, Programming 1, Programming 2, C programming practice, programming quiz",
  ogImageUrl: null,
};

// Falls back to hardcoded defaults if the DB isn't reachable (e.g. during
// a build step) so metadata resolution never blocks page rendering.
export async function getSeoSettings(): Promise<SeoSettingsData> {
  try {
    await syncDB();
    const [row] = await SeoSetting.findOrCreate({
      where: { id: SINGLETON_ID },
      defaults: { id: SINGLETON_ID },
    });
    return {
      title: row.getDataValue("title"),
      description: row.getDataValue("description"),
      keywords: row.getDataValue("keywords"),
      ogImageUrl: row.getDataValue("ogImageUrl"),
    };
  } catch (err) {
    console.error("[seo] falling back to default metadata", err);
    return DEFAULTS;
  }
}

export async function updateSeoSettings(updates: Partial<SeoSettingsData>) {
  await syncDB();
  const [row] = await SeoSetting.findOrCreate({
    where: { id: SINGLETON_ID },
    defaults: { id: SINGLETON_ID },
  });
  await row.update(updates);
  return getSeoSettings();
}
