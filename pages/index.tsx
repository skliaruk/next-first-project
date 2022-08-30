
import { query } from 'firebase/firestore'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div>
      <Link prefetch={false} href={{
        pathname: '/[username]',
        query: {username: 'iliaskl'}
      }}> </Link>
    </div>
  )
}
