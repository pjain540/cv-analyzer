import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userService, User } from '../services/userService';

// --- Cookie Helpers ---
const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const getCookie = (name: string): string => {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
};

const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// --- Context Types ---
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Initial check on mount
    useEffect(() => {
        const initAuth = () => {
            const token = getCookie('accessToken');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                setUser(JSON.parse(savedUser));
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    // 2. Login function
    const login = async (credentials: any) => {
        try {
            const response = await userService.loginUser(credentials);

            if (response.success) {
                const { user, accessToken } = response.data;

                // Store token in Cookie (valid for 1 day)
                setCookie('accessToken', accessToken, 1);

                // Store user details in state and localStorage
                setUser(user);
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    // 3. Logout function
    const logout = async () => {
        try {
            await userService.logoutUser();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            deleteCookie('accessToken');
            localStorage.removeItem('user');
            setUser(null);
            window.location.href = '/#/login';
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// --- Custom Hook ---
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
