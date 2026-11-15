import { describe, it, expect } from "vitest";
import { actionType, describeAction, categoryLabel } from "./activityText";

const row = (o: Partial<Parameters<typeof describeAction>[0]>) => ({
  action: "",
  userName: "Ann",
  userId: 1,
  target: null,
  ...o,
});

describe("activityText", () => {
  it("uses the student ID as the subject for auth events", () => {
    expect(
      describeAction(row({ action: "auth.login", target: "19020241", userName: null, userId: null })),
    ).toBe("[19020241] logged in.");
  });
  it("shows student ID and name together", () => {
    expect(
      describeAction(row({ action: "auth.login", studentId: "19020241", userName: "Alfer Brent Mercado" })),
    ).toBe("[19020241 - Alfer Brent Mercado] logged in.");
    expect(actionType("auth.login")).toBe("SESSION START");
  });
  it("falls back gracefully for unknown actions", () => {
    expect(describeAction(row({ action: "foo.some_thing" }))).toBe("[Ann]: some thing.");
  });
  it("labels categories", () => {
    expect(categoryLabel("auth")).toBe("Sign in & accounts");
  });
});
