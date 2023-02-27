import { useNavigate } from 'react-router-dom'
import { Token } from '../types/ApolloClientTypes'
import { gql, useLazyQuery } from '@apollo/client'
import { useEffect, useRef } from 'react'

const TOKEN_REQUEST = gql`
    query{
        getAccessToken {
          accessToken
        }
    }
`

const useTokenOnLogin = (): void => {
  const onFirstLoad = useRef(true)
  const reroute = useNavigate()

  console.log('called')

  const [getToken, { data, error }] = useLazyQuery<{ getAccessToken: Token }>(TOKEN_REQUEST, {
    onCompleted: (data) => {
      console.log('fetched token')
    }
  })

  useEffect(() => {
    if (onFirstLoad.current) {
      void getToken()
      console.log('called get token')
      if (error !== undefined) {
        onFirstLoad.current = false
        console.log(error)
      }
      if (data !== undefined) {
        const accessToken = data.getAccessToken.accessToken
        onFirstLoad.current = false
        document.cookie = `access_token=${accessToken}; SameSite=strict; domain=localhost`
        console.log('token grabbed')
        reroute('/me')
      }
    }
  }, [data, error, reroute, getToken])
}

export default useTokenOnLogin
