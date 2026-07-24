import { DataTypes, Model } from "sequelize";
import sequelize from "@/lib/db";

class AdminTask extends Model {}

AdminTask.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    done: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "AdminTask",
    tableName: "admin_tasks",
  },
);

export default AdminTask;
