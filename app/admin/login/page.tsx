import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Restricted access',
  robots: { index: false, follow: false },
}

export default function AdminLoginDeprecatedPage() {
  redirect('/access-restricted')
}
