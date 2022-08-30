import { Toaster } from 'react-hot-toast'
import NavBar from '../components/NavBar'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NavBar/>
      <Component {...pageProps} />
      <Toaster/>
    </>)
}

export default MyApp
