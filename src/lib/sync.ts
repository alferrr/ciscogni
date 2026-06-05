import sequelize from "./db";
import "../models/User";
import "../models/Question";
import "../models/Attempt";
import "../models/Session";
import "../models/associations";
import "../models/AllowedStudent";

let synced = false;

export const syncDB = async () => {
  if (synced) return;
  await sequelize.sync({ alter: false });
  synced = true;
};
