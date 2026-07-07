import Skeleton from "./Skeleton";

interface AdminTableSkeletonProps {
  columns: number;
  rows?: number;
}

const AdminTableSkeleton = ({ columns, rows = 6 }: AdminTableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: columns }).map((_, c) => (
            <td key={c}>
              <Skeleton height="14px" width={c === columns - 1 ? "28px" : "80%"} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default AdminTableSkeleton;
