import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { LoginCredentials, User } from "../types";

interface LoginProviderProps {
    children: React.ReactNode
}

export const AuthProvider = ({ children }: LoginProviderProps) => {
    const [{ user, isAuth }, setState] = useState<{
        user?: User;
        isAuth: boolean;
    }>({
        user: undefined,
        isAuth: false,
    });

    const checkStatus = useCallback(() => {
        // Normally we would call the backend using a stored token
        const authUser = localStorage.getItem("user");
        let mockReturnedUser: undefined = undefined;
        if (authUser) {
            mockReturnedUser = JSON.parse(authUser);
        }
        setState((prev) => ({
            ...prev,
            isAuth: !!mockReturnedUser,
            user: mockReturnedUser
        }));
    }, []);

    useEffect(() => {
        checkStatus()
    }, []);

    const login = useCallback((creds: LoginCredentials) => {
        // Handle Login Request to backend happens here

        // On successful login we store the returned user (if api returns a User) and we store the auth token in localStorage
        // We can use sessionStorage to store the token if we want but the user would lose the token when they close the window

        // Mocked successful login
        const mockReturnedUser: User = { firstName: 'Kevin', lastName: 'Burnside' };
        localStorage.setItem("user", JSON.stringify(mockReturnedUser));
        setState((prev) => ({
            ...prev,
            user: mockReturnedUser,
            isAuth: true
        }))
    }, []);

    const logout = useCallback(() => {
        // Call to the backend api to logout (if backend requires), remove the token and user details from localstorage
        localStorage.removeItem("user");
        checkStatus();
    }, []);


    return (
        <AuthContext.Provider
            value={{
                user,
                isAuth,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );

}