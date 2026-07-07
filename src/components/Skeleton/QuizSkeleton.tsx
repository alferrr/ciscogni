import Skeleton from "./Skeleton";
import "./QuizSkeleton.css";

interface QuizSkeletonProps {
  variant?: "progress" | "timer";
  showBack?: boolean;
  showHeader?: boolean;
}

const QuizSkeleton = ({
  variant = "progress",
  showBack,
  showHeader,
}: QuizSkeletonProps) => {
  return (
    <div className="quiz-skeleton">
      <div className="container">
        {showBack && (
          <div className="qs-back-row">
            <Skeleton width="90px" height="36px" borderRadius="10px" />
          </div>
        )}

        {showHeader && (
          <div className="qs-header">
            <Skeleton width="220px" height="28px" />
            <Skeleton width="280px" height="14px" />
          </div>
        )}

        <div className="qs-card">
          <div className="qs-meta">
            <Skeleton width="60px" height="14px" />
            {variant === "timer" ? (
              <Skeleton width="70px" height="24px" borderRadius="999px" />
            ) : (
              <Skeleton width="90px" height="20px" borderRadius="999px" />
            )}
          </div>

          <Skeleton height="6px" borderRadius="999px" />

          <div className="qs-text">
            <Skeleton height="20px" />
            <Skeleton width="70%" height="20px" />
          </div>

          <Skeleton height="90px" borderRadius="12px" />

          <div className="qs-choices">
            <Skeleton height="46px" borderRadius="12px" />
            <Skeleton height="46px" borderRadius="12px" />
            <Skeleton height="46px" borderRadius="12px" />
            <Skeleton height="46px" borderRadius="12px" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSkeleton;
