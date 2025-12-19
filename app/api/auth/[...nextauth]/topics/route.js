import { getToken } from "next-auth/jwt"

export async function POST(req) {
  const token = await getToken({ req })

  if (!token) {
    return new Response("Unauthorized", { status: 401 })
  }

  if (token.username !== process.env.ADMIN_GITHUB_USERNAME) {
    return new Response("Forbidden", { status: 403 })
  }

  const body = await req.json()

  // Save to DB / file / markdown
  console.log("New topic:", body)

  return Response.json({ success: true })
}
