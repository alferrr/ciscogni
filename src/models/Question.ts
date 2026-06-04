import { DataTypes, Model } from "sequelize";
import sequelize from "@/lib/db";
import Attempt from "./Attempt";

class Question extends Model {}

Question.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM(
        "output_prediction",
        "bug_detection",
        "logic_tracing",
        "concept",
      ),
      allowNull: false,
    },
    questionText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    codeSnippet: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    choices: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    correctAnswer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    explanation: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.ENUM("easy", "medium", "hard"),
      allowNull: false,
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mode: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "practice",
    },
  },
  {
    sequelize,
    modelName: "Question",
    tableName: "questions",
  },
);

export default Question;
