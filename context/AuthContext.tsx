"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

//   ACCOUNT_ID: number;
//   NAME: string;
//   EMAIL: string;
//   PHONE_NUMBER: string;
//   GENDER: string;
//   AVATAR: string | null;
//   USER_TYPE: string;
//   GRABCOINS: number | null;
//   DRIVER_LICENSE_GRADE: string | null;
//   CURRENT_BALANCE: number | null;
//   AVERAGE_RATING: number | null;
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  userType?: "Passenger" | "Driver";
  avatar?: string;
  averageRating?: number;
  currentBalance?: number;
  grabCoins?: number;
  driverLicenseGrade?: string;
}

interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  signOut: () => void;
  signIn: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserState(userData);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
  };

  const signIn = (userData: User) => {
    setUser(userData);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/auth/signin";
  };

  const value: AuthContextType = {
    user,
    isSignedIn: !!user,
    isLoading,
    setUser,
    signOut,
    signIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
