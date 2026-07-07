import Skeleton from "./Skeleton";
import "./AdminDashboardSkeleton.css";

const AdminDashboardSkeleton = () => {
  return (
    <div>
      <div className="ads-title-block">
        <Skeleton width="180px" height="32px" />
        <Skeleton width="260px" height="15px" />
      </div>

      <div className="dash-grid">
        <div className="dash-actions">
          {[0, 1, 2].map((i) => (
            <div key={i} className="ads-action-card">
              <Skeleton width="60%" height="18px" />
              <Skeleton width="90%" height="13px" />
              <div className="ads-action-footer">
                <Skeleton width="80px" height="13px" />
                <Skeleton width="34px" height="34px" borderRadius="999px" />
              </div>
            </div>
          ))}
        </div>

        <div className="dash-main">
          <div className="dash-card">
            <div className="dash-card-header">
              <div className="ads-header-text">
                <Skeleton width="160px" height="18px" />
                <Skeleton width="220px" height="13px" />
              </div>
              <Skeleton width="140px" height="20px" />
            </div>
            <Skeleton height="240px" borderRadius="14px" />
          </div>

          <div className="bottom-grid">
            <div className="dash-card">
              <div className="dash-card-header">
                <div className="ads-header-text">
                  <Skeleton width="140px" height="18px" />
                  <Skeleton width="180px" height="13px" />
                </div>
              </div>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="breakdown-row">
                  <Skeleton width="36px" height="36px" borderRadius="10px" />
                  <div className="breakdown-info">
                    <Skeleton className="breakdown-label" width="140px" height="13px" />
                    <Skeleton height="6px" borderRadius="999px" />
                  </div>
                  <Skeleton width="24px" height="14px" />
                </div>
              ))}
            </div>

            <div className="dash-card">
              <div className="dash-card-header">
                <div className="ads-header-text">
                  <Skeleton width="120px" height="18px" />
                  <Skeleton width="100px" height="13px" />
                </div>
              </div>
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="leaderboard-row">
                  <Skeleton width="38px" height="38px" borderRadius="999px" />
                  <div className="leaderboard-info">
                    <Skeleton className="leaderboard-name" width="120px" height="13px" />
                    <Skeleton width="90px" height="11px" />
                  </div>
                  <Skeleton width="50px" height="15px" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardSkeleton;
