import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Lock } from 'lucide-react';
import axios from 'axios';
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
      toast.success('Welcome to Lumeo!');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-500 mb-2">PlayZoon</h1>
          <p className="text-gray-400">Welcome back!</p>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-6 bg-gray-900 rounded-xl p-8 shadow-2xl">
          {/* Logo Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center border-4 border-orange-500">
              <Lock className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          {/* Text Inputs */}
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>

          {/* Signup Link */}
          <p className="text-center text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-orange-500 hover:text-orange-400 transition duration-200">
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
