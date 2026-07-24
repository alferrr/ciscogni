import Header from "@/components/Header/Header";
import QuizSkeleton from "@/components/Skeleton/QuizSkeleton";

export default function Loading() {
  return (
    <>
      <Header />
      <QuizSkeleton showBack />
    </>
  );
}
