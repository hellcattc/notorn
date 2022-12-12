import { Token } from '../types/ApolloClientTypes'
import { gql, useQuery } from '@apollo/client'
import { useRef } from 'react'

const TOKEN_REQUEST = gql`
    query{
        getAccessToken {
            tokens
        }
    }
`

const useTokenOnLogin = (): boolean => {
  const onFirstLoad = useRef(true)

  if (onFirstLoad.current) {
    const { data, error } = useQuery<{ getAccessToken: Token }>(TOKEN_REQUEST)
    if (error !== undefined) {
      return false
    }
    if (data !== undefined) {
      const accessToken = data.getAccessToken.accessToken
      document.cookie = `access_token=${accessToken}; SameSite=strict; domain=localhost`
      return true
    }
  }
  return false
}

export default useTokenOnLogin
