import { redirect } from 'next/navigation'
export default async function HomePage() {
  const user = true

  // If user is authenticated, redirect to projects
  if (user) {
    redirect('/projects')
  }

  // If not authenticated, redirect to login
  redirect('/login')
}
