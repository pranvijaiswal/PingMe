import React from 'react'
import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
const SignupPage = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
      fullName: "",
      email: "",
      password: "",
    })
  const {signup,isSigningUp} = useAuthStore();
  
  const validateForm = () => {}

  const handleSubmit = (e) => {
    e.preventDefault();
}



  return <div className=' min-h-screen grid lg:grid-cols-2'>
   {/* left */}
   <div className='flex flex-col justify-center items-center p-6 sm:p-16'>
    <div className='w-full max-w-nd space-y-8'>
      <div classname ="text-center nb-8">
        <div className='flex flex-col items-center gap-2 group'>
          <div
          className="size-12 rounded-xl bg-primary/10 flex items-center justify-center
          group-hover:bg-primary/20 transition-colors">

            <MessageSquare className="size-6 text-primary"/>
          
          </div>
        </div>
      </div>


    </div>
   </div>
  </div>
}

export default SignupPage