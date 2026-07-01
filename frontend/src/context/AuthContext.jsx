import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  loginUser,
  signupUser,
  logoutUser,
  getCurrentUser,
} from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getCurrentUser();

        if (data?.authenticated) {
          setUser({
            id: data.user.id,
            name: data.user.username,
            email: data.user.email,
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  async function login(credentials) {
    const data = await loginUser(credentials);

    if (!data.success) {
      throw new Error(data.message || "Login failed");
    }

    setUser({
      id: data.user.id,
      name: data.user.username,
      email: data.user.email,
    });

    return data.user;
  }

  async function signup(formData) {
    const data = await signupUser(formData);

    if (!data.success) {
      throw new Error("Signup failed");
    }

    setUser({
      id: data.user.id,
      name: data.user.username,
      email: data.user.email,
    });

    return data.user;
  }

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}