import React, { useState } from 'react';
import { Loader2, Lock } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
const navigate = useNavigate();
   const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/user/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data._id);
      localStorage.setItem('channelName', res.data.channelName);
      localStorage.setItem('logoUrl', res.data.logoUrl);

      navigate('/allvideos');
       toast.success('Welcome to Lumora!');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">Lumora</h1>
          <p className="text-gray-400 text-lg">Welcome back!</p>
        </div>

        {/* Form */}
        <div className="space-y-6 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          {/* Logo Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-28 h-28 rounded-2xl bg-white/5 backdrop-blur-lg flex items-center justify-center border border-white/20 shadow-lg">
              <Lock className="w-10 h-10 text-gray-300" />
            </div>
          </div>

          {/* Text Inputs */}
          <div className="space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 backdrop-blur-lg text-white px-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/10 transition duration-200 placeholder-gray-500 border border-white/10"
                required
              />
            </div>
            
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 backdrop-blur-lg text-white px-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/10 transition duration-200 placeholder-gray-500 border border-white/10"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white/10 backdrop-blur-lg hover:bg-white/15 text-white py-4 rounded-xl font-semibold transition duration-300 flex items-center justify-center space-x-2 mt-6 disabled:opacity-50 border border-white/20 shadow-lg"
            onClick={submitHandler}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>

          {/* Signup Link */}
          <p className="text-center text-gray-500 mt-6">
            Don't have an account?{' '}
            <a href="/signup" className="text-white hover:text-gray-300 transition duration-200 font-medium">
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;