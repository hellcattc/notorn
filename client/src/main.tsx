import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import App from './App'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import User from './pages/User'

const link = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include'
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/me',
    element: <User />
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ApolloProvider client = {client}>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
  </ApolloProvider>
)
