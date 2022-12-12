import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { UserSignUp, Token } from '../types/ApolloClientTypes'
import { TextField, Grid, Container, Button, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import validator from 'validator'

const SIGN_UP = gql`
    mutation ($username: String, $email: String!, $password: String!) {
        signUpAPI(user: {username: $username, email: $email, password: $password}) {
            accessToken
        }
    }
`

const SignUp = (): JSX.Element => {
  const reroute = useNavigate()

  const [signUpUser, { loading, error }] = useMutation<{ signUpAPI: Token }>(SIGN_UP, {
    onCompleted: ({ signUpAPI }) => {
      const { accessToken } = signUpAPI
      document.cookie = `access_token=${accessToken}; SameSite=strict; domain=localhost`
      reroute('/me')
    }
  })

  const handleUserSignUp = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const signUpData: UserSignUp = { username, email, password }
    void signUpUser({ variables: signUpData })
  }

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const isEmailInvalid = validator.isEmail(email)

  if (loading) return <p>Please, wait</p>
  if (error !== undefined) return <p>{error.message}</p>

  return (
        <Box
            height='100vh'
            justifyContent='center'
            display='flex'
            alignItems='center'
        >
            <Container maxWidth = 'sm'>
                <form onSubmit={ (e) => handleUserSignUp(e) }>
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
                            required
                            error={isEmailInvalid}
                        />
                        <TextField
                            id='email'
                            value={password}
                            variant='outlined'
                            onChange={(e) => setPassword(e.target.value)}
                            type='text'
                            placeholder='Enter your password'
                            required
                        />
                        <Button type='submit'>Sign Up</Button>
                    </Grid>
                </form>
            </Container>
        </Box>
  )
}

export default SignUp
