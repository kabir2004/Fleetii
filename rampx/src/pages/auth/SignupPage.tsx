import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

const GoogleIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const MicrosoftIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
    <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
    <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
    <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
  </svg>
)

const inputClass = "w-full h-11 rounded-xl border border-gray-300 bg-white px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5"

export default function SignupPage() {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', company: '', password: '',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const passwordStrength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2
    : 3

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setUser({
      id: 'profile-new',
      email: form.email,
      first_name: form.firstName,
      last_name: form.lastName,
      role: 'owner',
      company_id: 'company-new',
      onboarding_step: 0,
    })
    setIsLoading(false)
    navigate('/onboarding')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create your account</h1>
        <p className="mt-1.5 text-sm text-gray-500">Free trial, no credit card required</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="first" className={labelClass}>First name</label>
            <input id="first" placeholder="Alex" value={form.firstName} onChange={set('firstName')} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="last" className={labelClass}>Last name</label>
            <input id="last" placeholder="Morgan" value={form.lastName} onChange={set('lastName')} required className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={set('email')}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="company" className={labelClass}>Company name</label>
          <input
            id="company"
            placeholder="Northbound Freight LLC"
            value={form.company}
            onChange={set('company')}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={set('password')}
              required
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {form.password && (
            <div className="flex gap-1 mt-2">
              {[1, 2, 3].map(level => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    passwordStrength >= level
                      ? level === 1 ? 'bg-red-400' : level === 2 ? 'bg-amber-400' : 'bg-green-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 rounded-xl bg-gray-950 text-white text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Creating account...
            </>
          ) : 'Create account'}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="space-y-2.5">
        <button
          type="button"
          className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <GoogleIcon />
          Continue with Google
        </button>
        <button
          type="button"
          className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <MicrosoftIcon />
          Continue with Microsoft
        </button>
      </div>

      <p className="mt-5 text-center text-xs text-gray-400 leading-relaxed">
        By creating an account you agree to our{' '}
        <a href="#" className="text-gray-600 hover:text-gray-900 underline underline-offset-2">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="text-gray-600 hover:text-gray-900 underline underline-offset-2">Privacy Policy</a>.
      </p>

      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-gray-900 hover:underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  )
}
