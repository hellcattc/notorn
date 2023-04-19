/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React from "react";
import ReactDOM from "react-dom/client";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  Operation,
} from "@apollo/client";

import { TokenRefreshLink } from "apollo-link-token-refresh";

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
import { TokenWorker, TokenWorkerRes } from "./types/TokenWorker";

const SWURL = new URL("./serviceWorker.ts", import.meta.url);
const tokenWorker = new Worker(
  new URL("./workers/tokenWorker.ts", import.meta.url)
);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register(SWURL, {
      type: "module",
    })
    .then((registration) => {
      console.log("Service Worker registered:", registration);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

// const debugLink: ApolloLink = () => {};

const refreshLink = new TokenRefreshLink({
  accessTokenField: "accessToken",
  isTokenValidOrUndefined: () => {
    // const data = await new Promise<TokenWorkerRes>((resolve) => {
    //   tokenWorker.onmessage = ({ data }: MessageEvent) => {
    //     resolve(data);
    //   };
    //   tokenWorker.postMessage({ action: "GET" } as TokenWorker);
    // });
    // if (data.status === "ok") {
    //   return true;
    // } else {
    //   console.log("not ok");
    //   return false;
    // }
    return false;
  },
  fetchAccessToken: async () => {
    return await fetch(import.meta.env.VITE_API_URI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `{
          refreshToken {
            accessToken
          }
        }`,
      }),
      credentials: "include",
    });
  },
  handleFetch: (accessToken, operation) => {
    const ctx = operation.getContext();
    ctx.headers = {
      ...ctx.headers,
      Authorization: `Bearer ${accessToken}`,
    };
    operation.setContext(ctx);
  },
  handleResponse:
    (operation: Operation, accessTokenField: string) =>
    async (response: Response) => {
      return await response
        .text()
        .then((bodyText) => {
          return JSON.parse(bodyText);
        })
        .then((parsedBody) => {
          const tokenObj = {
            accessToken: parsedBody.data.refreshToken.accessToken,
          };
          console.log(tokenObj);
          return tokenObj;
        });
    },
});

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URI,
  credentials: "include",
  fetch,
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([refreshLink, httpLink]),
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    loader: async () => {
      const user = await client.query<UserInfo>({
        query: MY_INFO,
        errorPolicy: "all",
      });

      if (user.error !== undefined || user.errors !== undefined) {
        throw new Error("unauthorized");
      }
      // const accessToken = res.data.getAccessToken.accessToken;
      // document.cookie = `access_token=${accessToken}; SameSite=strict; domain=localhost`;
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
            refreshToken: {
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
