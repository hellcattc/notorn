import './App.scss'
import SignUp from './pages/SignUpPage'
import { useEffect } from 'react'
import useTokenOnLogin from './hooks/useTokenRotation'

function App() {
  useTokenOnLogin()

  return (
    <>
        <SignUp />
    </>
  )
}

export default App
