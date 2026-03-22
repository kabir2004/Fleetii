import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setIsLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-5 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
          <Mail className="h-5 w-5 text-gray-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-2">Check your inbox</h1>
        <p className="text-sm text-gray-500 mb-1">We sent a reset link to</p>
        <p className="text-sm font-semibold text-gray-900 mb-8">{email}</p>
        <p className="text-xs text-gray-400 mb-8">
          Didn't receive it? Check your spam folder or{' '}
          <button
            onClick={() => setSubmitted(false)}
            className="text-gray-600 underline underline-offset-2 hover:text-gray-900"
          >
            try again
          </button>.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reset your password</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Work email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full h-11 rounded-xl border border-gray-300 bg-white px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 rounded-xl bg-gray-950 text-white text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Sending...
            </>
          ) : 'Send reset link'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
