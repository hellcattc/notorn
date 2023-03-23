/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React from "react";
import ReactDOM from "react-dom/client";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
} from "@apollo/client";

import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { MY_INFO, TOKEN_REQUEST } from "./graphql/requests";
import { Token, UserInfo } from "./types/ApolloClientTypes";
import SignUpPage from "./pages/SignUpPage";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink]),
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    loader: async () => {
      const res = await client.query<{ getAccessToken: Token }>({
        query: TOKEN_REQUEST,
        fetchPolicy: "cache-first",
      });
      console.log(res);
      if (
        res.error !== undefined ||
        res.data.getAccessToken.accessToken == null
      ) {
        throw new Error("unauthorized");
      }
      const accessToken = res.data.getAccessToken.accessToken;
      document.cookie = `access_token=${accessToken}; SameSite=strict; domain=localhost`;
      return redirect("/home");
    },
    errorElement: <SignUpPage />,
  },
  {
    path: "/home",
    loader: async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const user = await client.query<UserInfo>({
        query: MY_INFO,
        errorPolicy: "all",
      });

      console.log(user);

      if (user.error !== undefined || user.errors !== undefined) {
        client.writeQuery({
          query: TOKEN_REQUEST,
          data: {
            getAccessToken: {
              accessToken: null,
            },
          },
        });
        return redirect("/");
      }

      return {};
    },
    element: <Home />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </ApolloProvider>
);
