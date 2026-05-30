import Skeleton from "./Skeleton";
import "./LeaderboardSkeleton.css";

const LeaderboardSkeleton = () => {
  return (
    <div className="leaderboard-skeleton">
      <div className="container">
        <div className="sk-lb-header">
          <Skeleton width="60px" height="60px" borderRadius="50%" />
          <Skeleton width="180px" height="36px" />
          <Skeleton width="240px" height="14px" />
        </div>

        <div className="sk-your-rank">
          <Skeleton width="80px" height="14px" />
          <Skeleton height="72px" borderRadius="16px" />
        </div>

        <div className="sk-lb-list">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="sk-lb-item">
              <Skeleton width="32px" height="20px" borderRadius="4px" />
              <Skeleton width="40px" height="40px" borderRadius="50%" />
              <div className="sk-lb-info">
                <Skeleton width="160px" height="14px" />
                <Skeleton width="120px" height="12px" />
              </div>
              <Skeleton width="70px" height="20px" borderRadius="999px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardSkeleton;
