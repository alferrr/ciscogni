import Skeleton from "./Skeleton";
import "./DashboardSkeleton.css";

const DashboardSkeleton = () => {
  return (
    <div className="dashboard-skeleton">
      <div className="container">
        <div className="sk-greeting">
          <Skeleton width="200px" height="36px" />
          <Skeleton width="280px" height="16px" />
        </div>

        <div className="sk-streak-box">
          <Skeleton width="24px" height="24px" borderRadius="50%" />
          <Skeleton width="120px" height="14px" />
          <Skeleton width="80px" height="48px" />
          <Skeleton width="200px" height="14px" />
          <Skeleton width="160px" height="40px" borderRadius="999px" />
        </div>

        <Skeleton width="160px" height="22px" />
        <div className="sk-comp-grid">
          <Skeleton height="140px" borderRadius="20px" />
          <Skeleton height="140px" borderRadius="20px" />
        </div>

        <Skeleton width="100px" height="22px" />
        <div className="sk-stats-row">
          <Skeleton height="80px" borderRadius="16px" />
          <Skeleton height="80px" borderRadius="16px" />
          <Skeleton height="80px" borderRadius="16px" />
        </div>

        <Skeleton width="160px" height="22px" />
        <div className="sk-lesson-container">
          <Skeleton height="100px" borderRadius="16px" />
          <Skeleton height="100px" borderRadius="16px" />
          <Skeleton height="100px" borderRadius="16px" />
          <Skeleton height="100px" borderRadius="16px" />
        </div>

        <Skeleton width="140px" height="22px" />
        <div className="sk-activity-list">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="sk-activity-item">
              <div className="sk-activity-left">
                <Skeleton width="36px" height="36px" borderRadius="50%" />
                <div className="sk-activity-text">
                  <Skeleton width="200px" height="14px" />
                  <Skeleton width="120px" height="12px" />
                </div>
              </div>
              <Skeleton width="50px" height="28px" borderRadius="999px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
