import Skeleton from "./Skeleton";
import "./OnboardingSkeleton.css";

const OnboardingSkeleton = () => {
  return (
    <div className="onboarding-skeleton">
      <div className="os-card">
        <div className="os-header">
          <Skeleton width="220px" height="26px" />
          <Skeleton width="260px" height="14px" />
        </div>
        <div className="os-field">
          <Skeleton width="120px" height="12px" />
          <Skeleton height="42px" borderRadius="10px" />
        </div>
        <Skeleton width="100%" height="46px" borderRadius="12px" />
      </div>
    </div>
  );
};

export default OnboardingSkeleton;
