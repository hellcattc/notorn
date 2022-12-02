import React from "react"

export type TokenContextType = {
    currentToken: string,
    setCurrentToken: React.Dispatch<React.SetStateAction<string>>
}