import React from 'react'
import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Eye, EyeOff, Lock, Loader2, Mail, MessageSquare, User } from "lucide-react"
import { Link } from 'react-router-dom'
import AuthImagePattern from '../components/AuthImagePattern'
import  toast  from 'react-hot-toast'

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  })
  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim())
      return toast.error("Full name is required");
    if (!formData.email.trim())
      return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password.trim())
      return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();


    const success = validateForm();
    
    if (success === true) signup(formData);
  }



  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* left */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-16'>
        <div className='w-full max-w-md space-y-8'>
          {/*logo*/}
          <div className="text-center mb-8">
            <div className='flex flex-col items-center gap-2 group'>
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">

                <MessageSquare className="size-6 text-primary" />

              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with free account</p>
            </div>
          </div>

          {/*form*/}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="flex justify-start items-center border rounded-md border-base-content/10">
                <div className="p-3">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input w-full border-none outline-none focus:ring-0 ring-none focus:outline-none`}
                  placeholder="e.g. John Dove"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>


            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="flex justify-start items-center border rounded-md border-base-content/10">
                <div className="p-3">
                  <Mail className="w-5 h-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={"input w-full border-none focus:outline-none"}
                  placeholder="you@mail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>


            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="flex items-center border rounded-md border-base-content/10">
                <div className="p-3">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input w-full border-none focus:outline-none`}
                  placeholder='********'
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* right */}
      <AuthImagePattern
        title="Join the community"
        subtitle="Connect with like-minded individuals and share your thoughts."
      />

    </div>
  );
};



export default SignupPage;