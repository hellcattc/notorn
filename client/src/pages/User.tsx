import { gql, useQuery } from '@apollo/client'
import React from 'react'

const ME_INFO = gql`
    query {
        userProfileAPI {
						userid
            email
            username
        }
    }
`

const User = () => {
	const {loading, error, data} = useQuery(ME_INFO);

  return (
    <div>{data}</div>
  )
}

export default User