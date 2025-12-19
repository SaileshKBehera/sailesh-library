"use client"

import { useSession, signIn } from "next-auth/react"

export default function AddTopicPage() {
  const { data: session, status } = useSession()

  if (status === "loading") return null

  if (!session) {
    return (
      <div>
        <h2>Authentication Required</h2>
        <button onClick={() => signIn("github")}>
          Sign in with GitHub
        </button>
      </div>
    )
  }

  return <AddTopicForm />
}

function AddTopicForm() {
  async function handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)

    await fetch("/api/topics", {
      method: "POST",
      body: JSON.stringify({
        title: formData.get("title"),
        content: formData.get("content"),
      }),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Topic title" required />
      <textarea name="content" placeholder="Content" required />
      <button type="submit">Add Topic</button>
    </form>
  )
}
