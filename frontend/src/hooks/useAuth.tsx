import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import privateApi from "~/lib/private-api";

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const checkAuth = async (): Promise<boolean> => {
        try {
            const response = await privateApi.get("/api/auth/check");
            const authenticated = response.data.success;
            setIsAuthenticated(authenticated);
            return authenticated;
        } catch {
            setIsAuthenticated(false);
            return false;
        }
    };

    const login = async (username: string, password: string) => {
        const response = await privateApi.post("/api/auth/login", { username, password });

        if (response.data.success) {
            setIsAuthenticated(true);
        } else {
            throw new Error(response.data.message || "Đăng nhập thất bại");
        }
    };

    const logout = async () => {
        try {
            await privateApi.post("/api/auth/logout", {});
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setIsAuthenticated(false);
            navigate("/login");
        }
    };

    useEffect(() => {
        checkAuth().finally(() => setIsLoading(false));
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
