import Skeleton from "./Skeleton";
import "./ProfileSkeleton.css";

const ProfileSkeleton = () => {
  return (
    <div className="profile-skeleton">
      <div className="ps-sidebar">
        <Skeleton width="80px" height="80px" borderRadius="50%" />
        <Skeleton width="140px" height="20px" />
        <Skeleton width="180px" height="12px" />
        <Skeleton width="120px" height="12px" />

        <div className="ps-badges">
          <Skeleton height="36px" borderRadius="10px" />
          <Skeleton height="36px" borderRadius="10px" />
          <Skeleton height="36px" borderRadius="10px" />
        </div>

        <div className="ps-nav">
          <Skeleton height="40px" borderRadius="10px" />
          <Skeleton height="40px" borderRadius="10px" />
          <Skeleton height="40px" borderRadius="10px" />
        </div>
      </div>

      <div className="ps-content">
        <div className="ps-section-title">
          <Skeleton width="24px" height="24px" borderRadius="50%" />
          <Skeleton width="160px" height="28px" />
        </div>

        <div className="ps-stats-row">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="ps-stat-card">
              <Skeleton width="24px" height="24px" borderRadius="50%" />
              <Skeleton width="60px" height="28px" />
              <Skeleton width="80px" height="12px" />
            </div>
          ))}
        </div>

        <Skeleton width="180px" height="20px" />
        <div className="ps-topic-list">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="ps-topic-item">
              <div className="ps-topic-info">
                <Skeleton width="200px" height="14px" />
                <Skeleton width="80px" height="12px" />
              </div>
              <div className="ps-topic-bar">
                <Skeleton height="8px" borderRadius="999px" />
                <Skeleton width="36px" height="14px" />
              </div>
            </div>
          ))}
        </div>

        <Skeleton width="220px" height="20px" />
        <div className="ps-type-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="ps-type-card">
              <Skeleton width="120px" height="12px" />
              <Skeleton width="60px" height="32px" />
              <Skeleton width="100px" height="12px" />
              <Skeleton height="6px" borderRadius="999px" />
            </div>
          ))}
        </div>

        <Skeleton width="140px" height="20px" />
        <div className="ps-sessions">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="ps-session-item">
              <div className="ps-session-left">
                <Skeleton width="24px" height="24px" borderRadius="50%" />
                <div className="ps-session-text">
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

export default ProfileSkeleton;
