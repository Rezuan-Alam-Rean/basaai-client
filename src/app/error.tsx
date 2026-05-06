"use client";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-muted-foreground max-w-md">{error.message || "An unexpected error occurred while loading the page."}</p>
      <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground" onClick={reset}>
        Try again
      </button>
    </div>
  );
}