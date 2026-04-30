import client from "@/api/client"

export async function authFetch(url, options = {}) {
    const { data } = await client.auth.getSession()
    const token = data.session?.access_token

    return fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    })
}