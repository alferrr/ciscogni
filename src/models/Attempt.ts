import { DataTypes, Model } from "sequelize";
import sequelize from "@/lib/db";
import Question from "./Question";

class Attempt extends Model {}

Attempt.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    selectedAnswer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Attempt",
    tableName: "attempts",
  },
);

export default Attempt;
