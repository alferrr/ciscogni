import { DataTypes, Model } from "sequelize";
import sequelize from "@/lib/db";

class PageView extends Model {}

PageView.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "PageView",
    tableName: "page_views",
    updatedAt: false,
  },
);

export default PageView;
