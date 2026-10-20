const BASE_URL = process.env.HUNARAS_API_URL || 'https://hunaras.com'
const API_KEY = process.env.HUNARAS_API_KEY || ''

export class ApiError extends Error {
  constructor(public status: number, message: string, public upgradeRequired?: boolean) {
    super(message)
  }
}

async function request(method: string, path: string, body?: any): Promise<any> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const msg = data?.error || `API error: ${res.status}`
    throw new ApiError(res.status, msg, data?.upgradeRequired)
  }

  return data
}

export const api = {
  get: (path: string) => request('GET', path),
  post: (path: string, body?: any) => request('POST', path, body),
  patch: (path: string, body?: any) => request('PATCH', path, body),
}
