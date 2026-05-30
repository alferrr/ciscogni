import Skeleton from "./Skeleton";
import "./ProgressSkeleton.css";

const ProgressSkeleton = () => {
  return (
    <div className="progress-skeleton">
      <div className="container">
        <div className="sk-progress-header">
          <Skeleton width="48px" height="48px" borderRadius="50%" />
          <div className="sk-progress-header-text">
            <Skeleton width="200px" height="32px" />
            <Skeleton width="260px" height="14px" />
          </div>
        </div>

        <div className="sk-stats-row">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="sk-stat-card">
              <Skeleton width="24px" height="24px" borderRadius="50%" />
              <Skeleton width="60px" height="28px" />
              <Skeleton width="80px" height="12px" />
            </div>
          ))}
        </div>

        <Skeleton width="180px" height="22px" />
        <div className="sk-topic-list">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="sk-topic-item">
              <div className="sk-topic-info">
                <Skeleton width="180px" height="14px" />
                <Skeleton width="80px" height="12px" />
              </div>
              <div className="sk-topic-bar-wrap">
                <Skeleton height="8px" borderRadius="999px" />
                <Skeleton width="36px" height="14px" />
              </div>
            </div>
          ))}
        </div>

        <Skeleton width="220px" height="22px" />
        <div className="sk-type-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="sk-type-card">
              <Skeleton width="120px" height="12px" />
              <Skeleton width="60px" height="32px" />
              <Skeleton width="100px" height="12px" />
              <Skeleton height="6px" borderRadius="999px" />
            </div>
          ))}
        </div>

        <Skeleton width="140px" height="22px" />
        <div className="sk-sessions-list">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="sk-session-item">
              <div className="sk-session-left">
                <Skeleton width="24px" height="24px" borderRadius="50%" />
                <div className="sk-session-text">
                  <Skeleton width="200px" height="14px" />
                  <Skeleton width="140px" height="12px" />
                </div>
              </div>
              <Skeleton width="48px" height="24px" borderRadius="8px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressSkeleton;
