import "./Skeleton.css";

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

const Skeleton = ({
  width = "100%",
  height = "16px",
  borderRadius = "8px",
  className = "",
}: SkeletonProps) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
};

export default Skeleton;
