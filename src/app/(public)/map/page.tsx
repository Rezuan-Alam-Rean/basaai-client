"use client";

import dynamic from "next/dynamic";

const MapViewPage = dynamic(
  () => import("@/app/pages/map-view").then((m) => m.MapViewPage),
  { ssr: false }
);

export default function Page() {
  return <MapViewPage />;
}