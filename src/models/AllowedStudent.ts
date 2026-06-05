import { DataTypes, Model } from "sequelize";
import sequelize from "@/lib/db";

class AllowedStudent extends Model {}

AllowedStudent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "AllowedStudent",
    tableName: "allowed_students",
    timestamps: false,
  },
);

export default AllowedStudent;
