import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Routes,Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'    // new
import ResetPasswordPage from './pages/ResetPasswordPage'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore'
const App = () => {
  const {authUser,checkAuth,isCheckingAuth} = useAuthStore();
  const {theme}=useThemeStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  useEffect(() => {
  document.documentElement.setAttribute("data-theme", theme);
}, [theme]);

     
  console.log({authUser});

if(isCheckingAuth && !authUser)
  return (<div className='flex justify-center items-center h-screen'>
    <Loader className = " size-20 animate-spin"  color='blue'/>   

  </div>)

  return (
    <div data-theme={theme}>

      <Navbar/>
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={!authUser ? <ForgotPasswordPage /> : <Navigate to="/" />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      
      <Toaster/>
    </div>
  )
}

export default App