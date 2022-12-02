import './App.scss'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import SignUp from './components/SignUp'

function App() {

  return (
    <div className="App">
      <SignUp />
    </div>
  )
}

export default App
