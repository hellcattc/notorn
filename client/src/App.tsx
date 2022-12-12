import './App.scss'
import SignUp from './pages/SignUpPage'
import React, { useContext, useEffect } from 'react'
import { tokenContext } from './context/TokenProvider'
import { useNavigate } from 'react-router-dom'

function App (): JSX.Element {
  const rerouter = useNavigate()
  const { rerouteRef, rerouteOnContext } = useContext(tokenContext)
  rerouteRef.current = rerouter

  useEffect(() => {
    rerouteOnContext()
  })

  return (
    <>
        <SignUp />
    </>
  )
}

export default App
