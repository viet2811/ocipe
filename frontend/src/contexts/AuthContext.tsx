import { axiosInstance } from "@/api/axios";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = (token: string) => {
    setAccessToken(token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    // call backend to logout
    try {
      await axiosInstance.post("/user/logout/", {}, { withCredentials: true });
      setAccessToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem("name");
    } catch (e) {
      console.log(e);
    }
  };

  // Run when mount: Instantly get refresh token when reopening
  // => the page request will work immediately instead of getting 401 and retry
  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await axiosInstance.post("user/token/refresh/", {});
        const newAccessToken = response.data.access;
        setAccessToken(newAccessToken);
        setIsAuthenticated(true);
      } catch (error) {
        // Refresh token expires
        await logout();
      } finally {
        setIsLoading(false);
      }
    };
    refreshToken();
  }, []);

  useEffect(() => {
    // Embed the bearer token before making a request
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    // If request got error - 401 Unauthorized
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.status === 401 && !originalRequest._retry) {
          // First time getting 401 message, attempt to refresh token
          originalRequest._retry = true;
          try {
            const response = await axiosInstance.post(
              "user/token/refresh/",
              {}
            );
            console.log(response);

            const newAccessToken = response.data.access;
            setAccessToken(newAccessToken);
            setIsAuthenticated(true);

            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            return axiosInstance(originalRequest);
          } catch (error) {
            // Refresh token expires
            await logout();
          }
        }
        return Promise.reject(error);
      }
    );

    // Clean up function
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, setAccessToken, logout, isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{ accessToken, isAuthenticated, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
