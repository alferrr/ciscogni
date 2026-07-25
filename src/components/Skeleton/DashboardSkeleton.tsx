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

        <div className="sk-section sk-streak">
          <Skeleton width="120px" height="14px" />
          <Skeleton width="80px" height="48px" />
          <Skeleton width="200px" height="14px" />
          <Skeleton width="160px" height="40px" borderRadius="999px" />
        </div>

        <div className="sk-section">
          <Skeleton width="160px" height="22px" />
          <div className="sk-comp-grid">
            <Skeleton height="100px" />
            <Skeleton height="100px" />
          </div>
        </div>

        <div className="sk-section">
          <Skeleton width="100px" height="22px" />
          <div className="sk-stats-row">
            <Skeleton height="50px" />
            <Skeleton height="50px" />
            <Skeleton height="50px" />
          </div>
        </div>

        <div className="sk-section">
          <Skeleton width="160px" height="22px" />
          <div className="sk-lesson-container">
            <Skeleton height="50px" />
            <Skeleton height="50px" />
            <Skeleton height="50px" />
          </div>
        </div>

        <div className="sk-section">
          <Skeleton width="140px" height="22px" />
          <div className="sk-activity-list">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="sk-activity-item">
                <div className="sk-activity-left">
                  <Skeleton width="18px" height="18px" borderRadius="50%" />
                  <div className="sk-activity-text">
                    <Skeleton width="200px" height="14px" />
                    <Skeleton width="120px" height="12px" />
                  </div>
                </div>
                <Skeleton width="36px" height="16px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
