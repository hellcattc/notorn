import { Container, Typography } from "@mui/material";
import React, { FC } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorPage: FC = () => {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <Container maxWidth="sm">
        <Typography>{error.data}</Typography>
      </Container>
    );
  } else {
    return <Typography>...</Typography>;
  }
};

export default ErrorPage;
