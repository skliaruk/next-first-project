import Link from "next/link";

export default function NavBar() { 

    const user = true;
    const username = true;

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href='/'>
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
                                <img src={ user?.photoUrl}></img>
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