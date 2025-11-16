import { useContext } from "react";
import { AuthContext } from "@/components/context/Authprovider";

const useAuth = () => {
    const context = useContext(AuthContext)

    if(!AuthContext) {
        throw new Error('useAuth must be used inside authprovider')
    }

    return context
}

export default useAuth