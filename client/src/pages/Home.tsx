import { useQuery } from "@apollo/client";
import { Box, Container, Typography } from "@mui/material";
import React, { FC } from "react";
import { UserInfo } from "../types/ApolloClientTypes";
import { MY_INFO } from "../graphql/requests";

const Home: FC = () => {
  const { data, error } = useQuery<UserInfo>(MY_INFO, {
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
    fetchPolicy: "cache-only",
  });

  console.log(error);

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Container maxWidth="md">
        <Typography display="block" width="fit-content">
          UserID: {data?.userProfile.outeruserid}
        </Typography>
        <Typography display="block" width="fit-content">
          Username: {data?.userProfile.username}
        </Typography>
        <Typography display="block" width="fit-content">
          Email: {data?.userProfile.email}
        </Typography>
      </Container>
    </Box>
  );
};

export default Home;
