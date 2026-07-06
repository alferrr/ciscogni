export const shuffleArray = <T>(arr: T[]): T[] => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// Randomizes each question's `choices` order so the correct answer isn't
// always in the same position (seed data frequently lists it first).
export const shuffleQuestionChoices = (questions: any[]) =>
  questions.map((q) => {
    const plain = typeof q.toJSON === "function" ? q.toJSON() : q;
    return { ...plain, choices: shuffleArray(plain.choices) };
  });
