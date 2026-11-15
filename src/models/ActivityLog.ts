import { DataTypes, Model } from "sequelize";
import sequelize from "@/lib/db";

// Append-only audit trail. userName/userRole are snapshots so entries stay
// readable after the user is renamed or deleted.
class ActivityLog extends Model {}

ActivityLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userRole: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    // Dotted event name, e.g. "auth.login", "admin.user.update".
    action: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    // Prefix of `action` ("auth", "admin", "quiz", ...), kept for filtering.
    category: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    target: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "ActivityLog",
    tableName: "activity_logs",
    updatedAt: false,
    indexes: [
      { fields: ["createdAt"] },
      { fields: ["userId"] },
      { fields: ["category"] },
    ],
  },
);

export default ActivityLog;
