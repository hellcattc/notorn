import { gql, useQuery } from '@apollo/client'
import React from 'react'
import { Box, Container, Typography } from '@mui/material'
import { UserInfo } from '../types/ApolloClientTypes'

const MY_INFO = gql`
    query {
        userProfileAPI {
						userid
            email
            username
        }
    }
`

const User = () => {
	const {loading, error, data} = useQuery<UserInfo>(MY_INFO, {
    onCompleted: (data) => {
      console.log(data)
    }
  });

  return (
    <Box 
      height='100vh'
      display='flex'
      justifyContent='center'
      alignItems='center'
    >
      <Container maxWidth='md'>
        <Typography display='block' width='fit-content'>UserID: {data?.userProfileAPI.userid}</Typography>
        <Typography display='block' width='fit-content'>Username: {data?.userProfileAPI.username}</Typography>
        <Typography display='block' width='fit-content'>Email: {data?.userProfileAPI.email}</Typography>
      </Container>
    </Box>
  )
}

export default User