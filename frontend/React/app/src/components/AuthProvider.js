import { createContext, useEffect, useState } from "react";
export const AuthContext = createContext();


export default function AuthProvider({ children }) {
    const [user, setUserInfo] = useState(null);


    const UserJWT = () => localStorage.getItem('access');
    const UserRefreshJWT = () => localStorage.getItem('refresh');


    const login = (accessToken, refreshToken) => {
        localStorage.setItem('access', accessToken);
        localStorage.setItem('refresh', refreshToken);
    }


    const logout = async () => {
        try {
            const UserAccessToken = UserJWT();
            const UserRefreshToken = UserRefreshJWT();

            await fetch('http://127.0.0.1:8000/api/auth/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${UserAccessToken}`
                },
                body: JSON.stringify({
                    'refresh' : UserRefreshToken
                })
            });

            localStorage.removeItem('access');
            localStorage.removeItem('refresh');

        } catch (error) {
            console.log(error);
        }
    }


    const User = async () => {
        try {
            const UserAccessToken = UserJWT();

            if (!UserAccessToken) {
                return null;
            }
    
            const response = await fetch('http://127.0.0.1:8000/api/auth/user/', {
                method: 'GET',
                headers: {
                    'Authorization' : `Bearer ${UserAccessToken}`
                }
            });
            
            if (response.ok) {
                const responsebody = await response.json();
                return responsebody.user;
            } 
            else {
                return null;
            }

        } catch (error) {
            console.log(error);
            return null;
        }
    }


    useEffect(() => {
        const fetchUser = async () => {
            const UserInfo = await User();

            if (UserInfo === null) {
                setUserInfo({
                    username: 'AnonymousUser',
                    is_authenticated: false
                });
            } else {
                setUserInfo(UserInfo);
            }

        }

        fetchUser();
    }, []);


    return (
        <AuthContext.Provider value={{ login, logout, user }}>
            {children}
        </AuthContext.Provider>
    );
}
