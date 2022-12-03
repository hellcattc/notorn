import './App.scss'
import SignUp from './pages/SignUpPage'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    // let tokenCookie = document.cookie
    //   .split('; ')
    //   .find((row) => row.startsWith('token='))?.split('=')[1]
    document.cookie = 'token =; expires= Thu, 01 Jan 1970 00:00:00 GMT'
    localStorage.clear()
  })

  return (
    <>
        <SignUp />
    </>
  )
}

export default App
