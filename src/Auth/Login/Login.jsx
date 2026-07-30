import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { setTokens } from '../../api/axiosClient'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../../store/authSlice'

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/api/auth/login', {
        email: data.email,
        password: data.password,
      })

      const { accessToken, refreshToken, isAdmin, user, message } = response.data || {}
      setTokens({ accessToken, refreshToken })

      const rawUser = user || response.data || {}
      const userData = {
        ...rawUser,
        id: rawUser.id || rawUser._id || response.data?.id,
        email: rawUser.email || data.email,
      }

      localStorage.setItem('isAdmin', isAdmin === true ? 'true' : 'false')
      localStorage.setItem('userData', JSON.stringify(userData))
      
      const authUser = { ...userData }
      delete authUser.password
      
      dispatch(loginSuccess({ user: authUser, token: accessToken }))
      
      toast.success(message || 'Login successful!')
      if (isAdmin === true) {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Unable to login at this time.'
      toast.error(errorMessage)
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950 text-white">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_30%)] pointer-events-none" />
      <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-[140px] pointer-events-none" />
      <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-violet-500/20 blur-[140px] pointer-events-none" />

      {/* Main Grid Container */}
      <div className="relative grid h-full w-full grid-cols-1 lg:grid-cols-2">
        
        {/* Left Section (Hidden on mobile/tablet, visible on large screens) */}
        <section className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-12 xl:p-16">
          <div>
            {/* Brand Component Placeholder */}
            <div className="flex items-center gap-2 font-bold text-lg text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">⚡</span>
              TaskFlow
            </div>

            <h1 className="mt-8 text-4xl font-bold leading-tight text-white xl:text-5xl">
              Manage Tasks
              <br />
              with Complete
              <span className="block bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Role Based Access
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-400">
              Streamline your team's productivity using an intelligent task
              management platform with modern workflow automation and secure access control.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-lg">
                  🚀
                </div>
                <h3 className="text-lg font-semibold text-white">Fast Workflow</h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Assign, organize and monitor tasks effortlessly.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-lg">
                  🔒
                </div>
                <h3 className="text-lg font-semibold text-white">Secure Access</h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Control permissions with robust RBAC.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl">
            <h3 className="text-sm font-semibold text-white">Task Flow Security</h3>
            <p className="mt-1 text-xs leading-6 text-slate-400">
              Built with React, Tailwind CSS, and RBAC to keep team data secure.
            </p>
          </div>
        </section>

        {/* Right Section (Login Form) */}
        <section className="flex items-center justify-center bg-slate-900/50 backdrop-blur-md px-6 py-8 sm:px-12 lg:px-16 h-full overflow-y-auto">
          <div className="w-full max-w-sm my-auto">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
                Welcome Back
              </p>
              <h2 className="mt-2 text-3xl font-bold text-white">Sign in</h2>
              <p className="mt-2 text-sm text-slate-400">
                Login to continue managing your projects.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-300">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="hello@taskflow.com"
                  aria-invalid={errors.email ? "true" : "false"}
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
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Enter password"
                    aria-invalid={errors.password ? "true" : "false"}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-xs text-rose-400">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex cursor-pointer items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    {...register("remember")}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-400"
                  />
                  Remember me
                </label>

                <Link
                  to="/forgot-password"
                  className="font-medium text-cyan-400 transition hover:text-cyan-300"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:opacity-90 hover:shadow-cyan-500/40"
              >
                Sign In
              </button>

              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300">
                <p className="font-semibold text-slate-100">Admin test credentials</p>
                <p className="mt-2 text-xs text-slate-400">Email: <span className="text-slate-100">admin@admin.com</span></p>
                <p className="text-xs text-slate-400">Password: <span className="text-slate-100">admin@000</span></p>
              </div>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-800"></div>
              <span className="text-xs text-slate-500">OR</span>
              <div className="h-px flex-1 bg-slate-800"></div>
            </div>

            {/* Social Login */}
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

            {/* Signup Link */}
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
