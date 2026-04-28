import { Loader } from "@/components/shared/loader";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader label="Loading page..." />
    </div>
  );
}
