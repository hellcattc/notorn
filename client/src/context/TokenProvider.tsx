import React, { createContext, useState } from "react";
import { TokenContextType } from "../types/TokenContext";

export const tokenContext = createContext({} as TokenContextType)

const TokenProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const [token, setToken] = useState<string>('')

    return (
        <tokenContext.Provider 
			value={{
				currentToken: token,
				setCurrentToken: setToken
			}}
		>
			{children}
		</tokenContext.Provider>
    )
}

export default TokenProvider