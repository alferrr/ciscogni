import Skeleton from "./Skeleton";
import "./AdminDashboardSkeleton.css";
import "@/app/admin/dashboard.css";

const AdminDashboardSkeleton = () => {
  return (
    <div className="dash">
      <div className="dash-head">
        <div className="ads-title-block">
          <Skeleton width="180px" height="32px" />
          <Skeleton width="260px" height="15px" />
        </div>
      </div>

      <div className="dash-top">
        <div className="stat-stack">
          {[0, 1, 2].map((i) => (
            <div key={i} className="stat-card">
              <div className="ads-header-text">
                <Skeleton width="90px" height="14px" />
                <Skeleton width="120px" height="30px" />
                <Skeleton width="110px" height="12px" />
              </div>
              <Skeleton width="86px" height="60px" borderRadius="12px" />
            </div>
          ))}
        </div>
        <div className="dash-card">
          <div className="ads-header-text">
            <Skeleton width="150px" height="18px" />
            <Skeleton width="200px" height="38px" />
          </div>
          <Skeleton height="260px" borderRadius="18px" />
        </div>
      </div>

      <div className="dash-lower">
        {[0, 1, 2].map((i) => (
          <div key={i} className="dash-card">
            <div className="ads-header-text">
              <Skeleton width="130px" height="18px" />
            </div>
            {[0, 1, 2, 3].map((j) => (
              <div key={j} className="ads-row">
                <Skeleton width="38px" height="38px" borderRadius="12px" />
                <div className="ads-header-text">
                  <Skeleton width="120px" height="13px" />
                  <Skeleton width="80px" height="11px" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardSkeleton;
