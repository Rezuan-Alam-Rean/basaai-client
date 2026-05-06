"use client";

import { SeekerDashboard } from "@/app/pages/seeker-dashboard";
import { ListerDashboard } from "@/app/pages/lister-dashboard";
import { useAppSelector } from "@/app/redux/hooks";

export default function Page() {
  const user = useAppSelector((state) => state.auth.user);
  return user?.role === "LISTER" ? <ListerDashboard /> : <SeekerDashboard />;
}