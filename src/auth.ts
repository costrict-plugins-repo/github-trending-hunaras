export interface AuthenticatedUser {
  id: string
  role: string
  email: string
  name: string | null
  company: string | null
  plan: string
}

export async function authenticateApiKey(): Promise<AuthenticatedUser | null> {
  const apiKey = process.env.HUNARAS_API_KEY
  if (!apiKey?.startsWith('hnar_')) return null

  const { api } = await import('./api.js')
  try {
    const user = await api.get('/api/user')
    return {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
      company: user.company,
      plan: user.plan || 'free',
    }
  } catch {
    return null
  }
}
