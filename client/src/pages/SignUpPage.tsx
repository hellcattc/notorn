import React, { useState, useContext }  from 'react'
import { gql, useMutation } from '@apollo/client'
import { UserSignUp, SignResponse } from '../types/ApolloClientTypes'
import { TextField, Grid, Container, Button, Box } from '@mui/material'
import { tokenContext } from '../context/TokenProvider'
import { useNavigate } from 'react-router-dom'


const SIGN_UP = gql`
    mutation ($username: String, $email: String!, $password: String!) {
        signUpAPI(user: {username: $username, email: $email, password: $password}) {
            accessToken
            refreshToken
        }
    }
`

const SignUp = () => {
    const { setCurrentToken } = useContext(tokenContext)
    const reroute = useNavigate();

    const [signUpUser, { data, loading, error }] = useMutation<SignResponse>(SIGN_UP, {
        onCompleted: (data) => {
            console.log(data)
            const { accessToken, refreshToken } = data.signUpAPI
            setCurrentToken(accessToken)
            localStorage.setItem('refreshToken', refreshToken) 
            document.cookie = `token=${accessToken}; SameSite=strict; domain=localhost`
            reroute('/me')
        }
    })

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
        <Box 
            height='100vh'
            justifyContent='center'
            display='flex'
            alignItems='center'
        >
            <Container maxWidth = 'sm'>
                <form onSubmit={(e) => handleUserSignUp(e)}>
                    <Grid container direction='column' rowGap={2} paddingTop={'3%'}>
                        <TextField 
                            id='username' 
                            autoFocus={true}
                            value={username}
                            variant='outlined'
                            onChange={(e) => setUsername(e.target.value)}
                            type='text'
                            placeholder='Enter your username'
                        />
                        <TextField 
                            id='email' 
                            value={email}
                            variant='outlined'
                            onChange={(e) => setEmail(e.target.value)}
                            type='text'
                            placeholder='Enter your email'
                        />
                        <TextField 
                            id='email' 
                            value={password}
                            variant='outlined'
                            onChange={(e) => setPassword(e.target.value)}
                            type='text'
                            placeholder='Enter your password'
                        />
                        <Button type='submit'>Sign Up</Button>
                    </Grid>
                </form>
            </Container>
        </Box>
    )
}

export default SignUp