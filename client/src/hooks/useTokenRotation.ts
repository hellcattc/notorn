import { Token } from './../types/ApolloClientTypes';
import { gql, useQuery } from '@apollo/client';
import { useState } from "react"
 
const TOKEN_REQUEST = gql`
    query{
        getAccessToken {
            tokens
        }
    }
` 

const useTokenOnLogin = () => {
    const [currentToken, setCurrentToken] = useState<string>('')
    const {data, error} = useQuery<{getAccessToken: Token}>(TOKEN_REQUEST)
}

export default useTokenOnLogin