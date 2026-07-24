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
    // References a PREVIEW_PAGES id (src/config/previewPages.ts). Null means
    // a general note not tied to a specific preview page.
    pageId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "AdminTask",
    tableName: "admin_tasks",
  },
);

export default AdminTask;
