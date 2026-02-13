import { createContext, useContext, useState } from "react";

interface AuthContextType {
    loggedUser: any,
    setLoggedUser: React.Dispatch<any> | undefined
}

const AuthContext = createContext<AuthContextType>({ loggedUser: undefined, setLoggedUser: undefined });

export const AuthProvider = ({ children } : any) => {

    const [loggedUser, setLoggedUser] = useState<any>(null);

    return(
        <AuthContext.Provider value = {{ loggedUser, setLoggedUser }}>
            {children}
        </AuthContext.Provider>
    );

}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
