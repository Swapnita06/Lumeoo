import React, { useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function App() {
  const [channelName, setChannelName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [logo, setLogo] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setLoading] = useState(false);
const navigate = useNavigate();
  const fileHandler = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
   try {
    const formData = new FormData();
    formData.append('channelName', channelName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('phone', phone);
    formData.append('logo', logo);

    const res = await axios.post('http://localhost:5000/user/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // Handle successful signup
   toast.success('Account created successfully!', {
  onClose: () => navigate('/login')
});
  } catch (err) {
    toast.error(err?.response?.data?.error || 'Signup failed');
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
          <p className="text-gray-400">Create your channel today</p>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-6 bg-gray-900 rounded-xl p-8 shadow-2xl">
          {/* Logo Preview */}
          <div className="flex justify-center">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt="Channel logo" 
                className="w-32 h-32 rounded-full object-cover border-4 border-orange-500"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center border-4 border-orange-500">
                <Camera className="w-12 h-12 text-orange-500" />
              </div>
            )}
          </div>

          {/* File Input */}
          <div className="relative">
            <input
              type="file"
              onChange={fileHandler}
              className="hidden"
              id="logo-upload"
              accept="image/*"
            />
            <label
              htmlFor="logo-upload"
              className="w-full py-3 px-4 text-center bg-gray-800 hover:bg-gray-700 text-white rounded-lg cursor-pointer transition duration-200 block"
            >
              Upload Channel Logo
            </label>
          </div>

          {/* Text Inputs */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Channel Name"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
              required
            />
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
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>

          {/* Login Link */}
          <p className="text-center text-gray-400">
            Already have an account?{' '}
            {/* <a href="/login" className="text-orange-500 hover:text-orange-400 transition duration-200">
              Sign in
            </a> */}
             <Link to="/login" className="text-orange-500 hover:text-orange-400 transition duration-200">
            Login!
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default App;
