"use client"
import { useSession, signIn, signOut } from "next-auth/react"

export default function Header() {
  const { data: session } = useSession()

  return (
    <header>
      <h2>TanviTech</h2>
      {session ? (
        <button onClick={() => signOut()}>Logout</button>
      ) : (
        <button onClick={() => signIn("github")}>Login</button>
      )}
    </header>
  )
}
