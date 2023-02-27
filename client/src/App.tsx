import './App.scss'
import SignUp from './pages/SignUpPage'
import React from 'react'
import useTokenOnLogin from './hooks/useTokenOnLogin'

function App (): JSX.Element {
  useTokenOnLogin()

  return (
    <>
        <SignUp />
    </>
  )
}

export default App
