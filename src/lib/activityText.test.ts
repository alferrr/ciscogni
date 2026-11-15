import { describe, it, expect } from "vitest";
import { describeAction, describeDetails, categoryLabel } from "./activityText";

const row = (o: Partial<Parameters<typeof describeAction>[0]>) => ({
  action: "",
  userName: "Ann",
  userId: 1,
  target: null,
  details: null,
  ...o,
});

describe("activityText", () => {
  it("uses the student ID as the subject for auth events", () => {
    expect(describeAction(row({ action: "auth.login", target: "19020241" }))).toBe(
      "19020241 logged in",
    );
  });
  it("describes quiz answers with the result", () => {
    expect(
      describeAction(
        row({ action: "quiz.practice_answer", details: '{"isCorrect":true}' }),
      ),
    ).toBe("Ann answered a practice question correctly");
  });
  it("falls back gracefully for unknown actions", () => {
    expect(describeAction(row({ action: "foo.some_thing" }))).toBe("Ann: some thing");
  });
  it("formats scores and labels", () => {
    expect(
      describeDetails(
        row({ action: "quiz.session_complete", details: '{"score":8,"total":10,"xpEarned":40}' }),
      ),
    ).toBe("Score 8/10 · +40 XP");
    expect(categoryLabel("auth")).toBe("Sign in & accounts");
  });
});
