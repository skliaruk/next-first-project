import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function NavBar() {
  const { user, username} = useContext(UserContext);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button>Feed</button>
          </Link>
        </li>
        {username && (
          <>
            <li className="push-left">
              <Link href="/admin">
                <button>Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoUrl}></img>
              </Link>
            </li>
          </>
        )}

        {!username && (
          <>
            <li>
              <Link href="/login">
                <button className="btn-blue">Log in</button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
