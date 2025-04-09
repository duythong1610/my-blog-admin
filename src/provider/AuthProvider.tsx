import { AppLoading } from "components/App/AppLoading";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userStore } from "store/userStore";
import { getToken } from "utils/auth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigation = useNavigate();
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const token = getToken();

    if (isLoaded) {
      handleAuth();
    }
  }, [navigation, isLoaded]);

  const handleAuth = async () => {
    try {
      await userStore.getProfile();
    } catch (error) {
      userStore.logout();
      navigation("/login");
    }
  };

  if (!isLoaded) {
    return <AppLoading />;
  }

  return <>{children}</>;
};
