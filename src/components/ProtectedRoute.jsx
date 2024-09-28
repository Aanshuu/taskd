// components/ProtectedRoute.js
'use client'

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn(); // Redirect to sign-in if unauthenticated
    }
  }, [status]);

  if (status === 'loading') {
    return <div>Loading...</div>; // Optional: You can customize this
  }

  if (session) {
    return children; // Render protected content
  }

  return null; // Prevent rendering if redirecting
}
