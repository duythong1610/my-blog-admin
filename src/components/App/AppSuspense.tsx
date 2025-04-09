import { Spin } from "antd";
import { Suspense } from "react";
import { AppLoading } from "./AppLoading";
import { AppLogo } from "./AppLogo";

interface AppSuspenseProps {
  children: React.ReactNode;
}

export const AppSuspense = ({ children }: AppSuspenseProps) => {
  return <Suspense fallback={<AppLoading />}>{children}</Suspense>;
};
