import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

type UserType = {
  phone: string;
  name?: string;
  dob?: string;
  gender?: string;
  image?: string | null;
  bio?: string;
  preferences?: any;
};

type AuthContextType = {
  user: UserType | null;
  loading: boolean;
  login: (phone: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<UserType>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
      setLoading(false); // IMPORTANT
    };

    loadUser();
  }, []);

  const login = async (phone: string) => {
    const newUser: UserType = { phone };
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = async (data: Partial<UserType>) => {
    const updated = { ...user, ...data };
    await AsyncStorage.setItem("user", JSON.stringify(updated));
    setUser(updated as UserType);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);