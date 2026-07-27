import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { setTokens } from '../../api/axiosClient'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'

const signupSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [serverMessage, setServerMessage] = useState('')
  const [serverError, setServerError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: '', email: '', password: '' },
    mode: 'onTouched',
  })

  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setServerError('')
    setServerMessage('')

    try {
      const response = await api.post('/api/auth/signup', {
        username: data.username,
        email: data.email,
        password: data.password,
      })

      const { accessToken, refreshToken, message } = response.data || {}
      setTokens({ accessToken, refreshToken })
      toast.success(message || 'Signup successful!')
      navigate('/dashboard')
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Unable to sign up at this time.'
      setServerError(errorMessage)
      toast.error(errorMessage)
    }
  }

 return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950 text-white">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_30%)] pointer-events-none" />
      <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-[140px] pointer-events-none" />
      <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-violet-500/20 blur-[140px] pointer-events-none" />

      {/* Main Grid Container (Matches Login Page structure) */}
      <div className="relative grid h-full w-full grid-cols-1 lg:grid-cols-2">
        
        {/* Left Section (Branding & Features - Mirroring Login) */}
        <section className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-12 xl:p-16">
          <div>
            {/* Brand Component Placeholder */}
            <div className="flex items-center gap-2 font-bold text-lg text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">⚡</span>
              TaskFlow
            </div>

            <h1 className="mt-8 text-4xl font-bold leading-tight text-white xl:text-5xl">
              Start Managing
              <br />
              Projects with
              <span className="block bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Complete Control
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-400">
              Join thousands of teams boosting their productivity with advanced role-based access control, secure environments, and streamlined workflows.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-lg">
                  ⚡
                </div>
                <h3 className="text-lg font-semibold text-white">Quick Setup</h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Get your team up and running in under a minute.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-lg">
                  🛡️
                </div>
                <h3 className="text-lg font-semibold text-white">Enterprise Ready</h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Secure data protection and granular access rules.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl">
            <h3 className="text-sm font-semibold text-white">Task Flow Ecosystem</h3>
            <p className="mt-1 text-xs leading-6 text-slate-400">
              Trusted by high-performing engineering and product teams worldwide.
            </p>
          </div>
        </section>

        {/* Right Section (Signup Form - Matches Login Right Section layout) */}
        <section className="flex items-center justify-center bg-slate-900/50 backdrop-blur-md px-6 py-8 sm:px-12 lg:px-16 h-full overflow-y-auto">
          <div className="w-full max-w-sm my-auto">
            <div className="mb-6">
              <span className="inline-flex rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-400">
                Get Started
              </span>
              <h2 className="mt-3 text-3xl font-bold text-white">Create Account</h2>
              <p className="mt-2 text-sm text-slate-400">
                Sign up to start organizing tasks and teams.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              {serverMessage && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  {serverMessage}
                </div>
              )}
              {serverError && (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {serverError}
                </div>
              )}

              {/* Username */}
              <div>
                <label htmlFor="username" className="mb-1.5 block text-xs font-medium text-slate-300">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  {...register('username')}
                  placeholder="Your display name"
                  aria-invalid={errors.username ? 'true' : 'false'}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                />
                {errors.username && (
                  <p className="mt-2 text-xs text-rose-400">{errors.username.message}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-300">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="you@example.com"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                />
                {errors.email && (
                  <p className="mt-2 text-xs text-rose-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="Create a strong password"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-xs text-rose-400">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:opacity-90 hover:shadow-cyan-500/40 mt-1"
              >
                Create account
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-800"></div>
              <span className="text-xs text-slate-500">OR</span>
              <div className="h-px flex-1 bg-slate-800"></div>
            </div>

            {/* Social Signups (Matching Login page's auxiliary layout) */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="rounded-xl border border-slate-700 bg-slate-950 py-2.5 text-xs font-medium transition-all duration-300 hover:border-cyan-500 hover:bg-slate-800"
              >
                Google
              </button>
              <button
                type="button"
                className="rounded-xl border border-slate-700 bg-slate-950 py-2.5 text-xs font-medium transition-all duration-300 hover:border-violet-500 hover:bg-slate-800"
              >
                GitHub
              </button>
            </div>

            {/* Footer Link */}
            <div className="mt-6 text-center text-xs text-slate-400">
              <p>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Signup
