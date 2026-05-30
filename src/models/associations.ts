import User from "./User";
import Question from "./Question";
import Attempt from "./Attempt";
import Session from "./Session";

Attempt.belongsTo(Question, { foreignKey: "questionId", as: "question" });
Question.hasMany(Attempt, { foreignKey: "questionId", as: "attempts" });
Attempt.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Attempt, { foreignKey: "userId", as: "attempts" });
Session.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Session, { foreignKey: "userId", as: "sessions" });
