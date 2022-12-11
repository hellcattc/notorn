import React, { createContext, useEffect, useRef, useState } from "react";
import { TokenContextType } from "../types/TokenContext";

export const tokenContext = createContext({} as TokenContextType)

const TokenProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const [currentToken, setCurrentToken] = useState<string>('')
	const firstLoad = useRef(null)

    return (
        <tokenContext.Provider 
			value={{
				currentToken,
				setCurrentToken
			}}
		>
			{children}
		</tokenContext.Provider>
    )
}

export default TokenProvider