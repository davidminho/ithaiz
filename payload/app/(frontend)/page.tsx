import { redirect } from 'next/navigation'

export default function Page() {
  redirect(process.env.FRONTEND_URL || 'http://localhost:4173')
}
