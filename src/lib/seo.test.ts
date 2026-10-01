import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/sync", () => ({ syncDB: vi.fn() }));
vi.mock("@/models/SeoSetting", () => ({
  default: { findOrCreate: vi.fn() },
}));

import { getSeoSettings, updateSeoSettings } from "./seo";
import SeoSetting from "@/models/SeoSetting";

const fakeRow = (data: Record<string, unknown>) => ({
  getDataValue: (key: string) => data[key],
  update: vi.fn(async (updates: Record<string, unknown>) =>
    Object.assign(data, updates),
  ),
});

describe("getSeoSettings", () => {
  beforeEach(() => {
    vi.mocked(SeoSetting.findOrCreate).mockReset();
  });

  it("returns the stored settings when the DB is reachable", async () => {
    const row = fakeRow({
      title: "Custom title",
      description: "Custom description",
      keywords: "a, b",
      ogImageUrl: "/img.png",
    });
    vi.mocked(SeoSetting.findOrCreate).mockResolvedValue([row, false] as any);

    const settings = await getSeoSettings();
    expect(settings).toEqual({
      title: "Custom title",
      description: "Custom description",
      keywords: "a, b",
      ogImageUrl: "/img.png",
    });
  });

  it("falls back to defaults when the DB throws", async () => {
    vi.mocked(SeoSetting.findOrCreate).mockRejectedValue(new Error("no db"));

    const settings = await getSeoSettings();
    expect(settings.title).toContain("Ciscogni");
    expect(settings.ogImageUrl).toBeNull();
  });
});

describe("updateSeoSettings", () => {
  beforeEach(() => {
    vi.mocked(SeoSetting.findOrCreate).mockReset();
  });

  it("updates the singleton row and returns the refreshed settings", async () => {
    const row = fakeRow({
      title: "Old",
      description: "Old desc",
      keywords: "old",
      ogImageUrl: null,
    });
    vi.mocked(SeoSetting.findOrCreate).mockResolvedValue([row, false] as any);

    const result = await updateSeoSettings({ title: "New title" });

    expect(row.update).toHaveBeenCalledWith({ title: "New title" });
    expect(result.title).toBe("New title");
  });
});
