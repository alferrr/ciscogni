import { describe, it, expect, vi, afterEach } from "vitest";
import { shuffleArray, shuffleQuestionChoices } from "./shuffle";

describe("shuffleArray", () => {
  it("returns an array with the same elements", () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffleArray(input);
    expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it("does not mutate the input array", () => {
    const input = [1, 2, 3];
    const copy = [...input];
    shuffleArray(input);
    expect(input).toEqual(copy);
  });

  it("handles an empty array", () => {
    expect(shuffleArray([])).toEqual([]);
  });

  it("handles a single-element array", () => {
    expect(shuffleArray([42])).toEqual([42]);
  });
});

describe("shuffleQuestionChoices", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shuffles the choices of a plain object", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const questions = [{ id: 1, choices: ["a", "b", "c", "d"] }];
    const result = shuffleQuestionChoices(questions);

    expect(result[0].choices.sort()).toEqual(["a", "b", "c", "d"]);
    expect(result[0].id).toBe(1);
  });

  it("calls toJSON() on Sequelize-model-like instances before shuffling", () => {
    const toJSON = vi.fn(() => ({ id: 2, choices: ["x", "y"] }));
    const result = shuffleQuestionChoices([{ toJSON }]);

    expect(toJSON).toHaveBeenCalled();
    expect(result[0].id).toBe(2);
    expect(result[0].choices.sort()).toEqual(["x", "y"]);
  });

  it("preserves other fields on the question", () => {
    const result = shuffleQuestionChoices([
      { id: 1, topic: "loops", choices: ["a", "b"] },
    ]);
    expect(result[0].topic).toBe("loops");
  });
});
