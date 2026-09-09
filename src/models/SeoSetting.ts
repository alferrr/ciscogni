import { DataTypes, Model } from "sequelize";
import sequelize from "@/lib/db";

class SeoSetting extends Model {}

// Singleton row (id always 1) holding the editable metadata for the
// public-facing pages (title/description/OG image shown in search
// results and link previews).
SeoSetting.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(70),
      allowNull: false,
      defaultValue: "Ciscogni — Programming Practice for USC Students",
    },
    description: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue:
        "Ciscogni is a gamified practice platform for USC (University of San Carlos) students taking Programming 1 and Programming 2. Drill output prediction, bug detection, and logic tracing questions with XP, streaks, and a class leaderboard.",
    },
    keywords: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue:
        "Ciscogni, USC, University of San Carlos, Programming 1, Programming 2, C programming practice, programming quiz",
    },
    ogImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "SeoSetting",
    tableName: "seo_settings",
    timestamps: true,
  },
);

export default SeoSetting;
