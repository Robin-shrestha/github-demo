import { useCallback, useState } from "react";

const AUTH_STORAGE_KEY = "mock-auth";

export interface UseMockAuthResult {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

// Mocked auth: a boolean flag in localStorage, not a real login system.
function useMockAuth(): UseMockAuthResult {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => localStorage.getItem(AUTH_STORAGE_KEY) === "true"
  );

  const login = useCallback((): void => {
    localStorage.setItem(AUTH_STORAGE_KEY, "true");
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback((): void => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
}

export default useMockAuth;
