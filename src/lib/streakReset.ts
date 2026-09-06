import { Op } from "sequelize";
import { syncDB } from "@/lib/sync";
import User from "@/models/User";

function isoDate(offsetDays: number) {
  return new Date(Date.now() - offsetDays * 86400000).toISOString().split("T")[0];
}

// Mirrors the grace-day rule used when a user's profile is fetched:
// a streak only breaks once two full days have passed without a claim.
export async function resetExpiredStreaks() {
  await syncDB();

  const today = isoDate(0);
  const yesterday = isoDate(1);
  const twoDaysAgo = isoDate(2);

  const [count] = await User.update(
    { streak: 0 },
    {
      where: {
        streak: { [Op.gt]: 0 },
        lastDailyAt: {
          [Op.and]: [
            { [Op.ne]: today },
            { [Op.ne]: yesterday },
            { [Op.ne]: twoDaysAgo },
          ],
        },
      },
    },
  );

  return count;
}
