'use client'

import Link from 'next/link'
import RegistrationForm from '@/components/auth/RegistrationForm'

export default function RegisterPage() {
  const handleRegister = async (data: {
    fullName: string
    email: string
    password: string
    phone: string
  }) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed')
      }

      // Registration successful
      return result
    } catch (error) {
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Fab & Fit
            </h1>
          </Link>
          <p className="text-gray-600 dark:text-gray-400">
            Gym Management System
          </p>
        </div>

        {/* Registration Form */}
        <RegistrationForm onRegister={handleRegister} />

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign in here
            </Link>
          </p>
          <Link 
            href="/" 
            className="inline-block mt-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
