import './App.scss'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import SignUp from './components/SignUp'

function App() {

  return (
    <div className="App">
      Hello World
      <SignUp />
    </div>
  )
}

export default App
