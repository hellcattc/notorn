import React, { FC, useState } from "react";
import { useMutation } from "@apollo/client";
import { UserSignUp, Token } from "../types/ApolloClientTypes";
import { TextField, Grid, Container, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { faker } from "@faker-js/faker";
import { SIGN_UP } from "../graphql/requests";

const SignUp: FC = () => {
  const reroute = useNavigate();

  const [signUpUser] = useMutation<{ signUpAPI: Token }>(SIGN_UP, {
    onCompleted: ({ signUpAPI }) => {
      console.log("signed up");
      const { accessToken } = signUpAPI;
      document.cookie = `access_token=${accessToken}; SameSite=strict; domain=localhost`;
      reroute("/home");
    },
  });

  const handleUserSignUp = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const signUpData: UserSignUp = { username, email, password };
    void signUpUser({ variables: signUpData });
  };

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isEmailInvalid = validator.isEmail(email);

  return (
    <Box
      height="100vh"
      justifyContent="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Button
        variant="contained"
        onClick={() => {
          setUsername(faker.internet.userName());
          setEmail(faker.internet.email());
          setPassword(faker.internet.password());
        }}
      >
        Generate data
      </Button>
      <Container maxWidth="sm">
        <form onSubmit={(e) => handleUserSignUp(e)}>
          <Grid container direction="column" rowGap={2} paddingTop={"3%"}>
            <TextField
              id="username"
              autoFocus={true}
              value={username}
              variant="outlined"
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Enter your username"
            />
            <TextField
              id="email"
              value={email}
              variant="outlined"
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Enter your email"
              required
              error={isEmailInvalid}
            />
            <TextField
              id="email"
              value={password}
              variant="outlined"
              onChange={(e) => setPassword(e.target.value)}
              type="text"
              placeholder="Enter your password"
              required
            />
            <Button type="submit">Sign Up</Button>
          </Grid>
        </form>
      </Container>
    </Box>
  );
};

export default SignUp;
