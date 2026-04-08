import React, { createContext, useState, useCallback, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
        try{
            const response = await fetch("http://localhost:5000/api/auth/refresh", {
                method: "POST",
                credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            setAccessToken(data.accessToken);
            console.log("Access token restored:", data.accessToken); // Temporary debug log

            const storedUser = sessionStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
        } catch (error) {
            console.error("Error restoring session:", error);
        } finally {
            setLoading(false);
        }
        };
        restoreSession();
    }, []);

    const login = useCallback((token, userData) => {
        setAccessToken(token);
        setUser(userData);

        sessionStorage.setItem("user", JSON.stringify(userData));
        console.log("Access token set:", token); // Temporary debug log
    }, []);

    const logout = useCallback(async () => {
        try {
            await fetch("http://localhost:5000/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Error during logout:", error);
        }finally {
            setAccessToken(null);
            setUser(null);
            sessionStorage.removeItem("user");
        }
    }, []);

    const refreshToken = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/refresh", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setAccessToken(data.accessToken);
                return data.accessToken;
            } else {
                setAccessToken(null);
                setUser(null);
                sessionStorage.removeItem("user");
                return null;
            } 
        } catch (error) {
                console.error("Error refreshing token:", error);
                return null;
            }
    }, []);


    const updateUser = useCallback((updatedUserData) => {
        setUser(prevUser => ({
            ...prevUser,
            ...updatedUserData
        }));
        const storedUser = sessionStorage.getItem("user");
        const user = JSON.parse(storedUser);
        sessionStorage.setItem("user", JSON.stringify({
            ...user,
            ...updatedUserData
        }));
    }, []);

    const value = {
        accessToken,
        user,
        loading,
        login,
        logout,
        refreshToken,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}