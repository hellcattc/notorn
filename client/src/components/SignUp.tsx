import React, { useState }  from 'react'
import { gql, useMutation } from '@apollo/client'
import { UserSignUp, TokenData } from '../types/ApolloClientTypes'

const SIGN_UP = gql`
    mutation ($username: String, $email: String!, $password: String!) {
        signUpAPI(user: {username: $username, email: $email, password: $password}) {
            accessToken
            refreshToken
        }
    }
`

const SignUp = () => {

    const [signUpUser, { data, loading, error}] = useMutation(SIGN_UP)

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleUserSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        signUpUser({variables: {username, email, password} as UserSignUp})
    }

    if (loading) return <p>Please, wait</p>
    if (error) return <p>{error.message}</p>

    return (
        <div>
            <form onSubmit={(e) => handleUserSignUp(e)}>
                <input 
                    type = 'text'
                    value = {username}
                    onChange = {(e) => setUsername(e.target.value)}
                ></input>
                <input
                    type = 'text'
                    value = {email}
                    onChange = {(e) => setEmail(e.target.value)}
                ></input>
                <input
                    type = 'text'
                    value = {password}
                    onChange = {(e) => setPassword(e.target.value)}
                ></input>
                <button type='submit'>Sign Up</button>
            </form>
            {data?.signUpAPI.accessToken ?? "No Access token"}
            {data?.signUpAPI.refreshToken ?? "No Refresh token"}
        </div>
    )
}

export default SignUp