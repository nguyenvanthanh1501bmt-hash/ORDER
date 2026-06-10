import client from "@/api/client"

export async function authFetch(url, options = {}) {
  let token = options.token

  if (!token) {
    const { data, error } = await client.auth.getSession()

    if (error) {
      console.error("authFetch getSession error:", error)
    }

    token = data.session?.access_token
  }

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const { token: _token, ...fetchOptions } = options

  return fetch(url, {
    ...fetchOptions,
    headers,
  })
}