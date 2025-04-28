"use client";

import CustomLoader from "./components/feedback/CustomLoader";
import { useCheckAuthQuery } from "./store/apis/AuthApi";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { error, isLoading } = useCheckAuthQuery(undefined, { skip: false });
  console.log("error => ", error);

  if (isLoading) {
    return <CustomLoader />;
  }

  return <>{children}</>;
}
