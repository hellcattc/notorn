import React, { createContext, useCallback, useRef } from 'react'
import useTokenOnLogin from '../hooks/useTokenOnLogin'
import { LoginContext } from '../types/LoginContext'

export const tokenContext = createContext<LoginContext>({} as LoginContext)

const TokenProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
  const rerouteRef = useRef(null)
  const accessAllowed = useTokenOnLogin()
  let rerouteOnContext: () => void
  if (rerouteRef.current !== null) {
    const rerouteFn = rerouteRef.current as (arg0: string) => void
    rerouteOnContext = useCallback(() => {
      if (accessAllowed) rerouteFn('/me')
      else rerouteFn('/')
    }, [accessAllowed])
  }

  return (
    <tokenContext.Provider
		value={{
		  rerouteRef,
		  rerouteOnContext
		}}
		>
			{children}
		</tokenContext.Provider>
  )
}

export default TokenProvider
