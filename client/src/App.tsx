import { useState } from 'react'
import './App.scss'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import SignUp from './components/SignUp'

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache
})

function App() {
  const [count, setCount] = useState(0)

  return (
    <ApolloProvider client={client}>
      <div className="App">
        Hello World
        <SignUp />
      </div>
    </ApolloProvider>
  )
}

export default App
