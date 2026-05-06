"use client";

import { useEffect } from "react";
import { useAppDispatch } from "../redux/hooks";
import { useGetMeQuery } from "../redux/features/auth/authApi";

export function useAuthInit() {
  const dispatch = useAppDispatch();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  // Skip the query if no token is present
  const { isError } = useGetMeQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (isError) {
      localStorage.removeItem("token");
    }
  }, [isError]);
}
