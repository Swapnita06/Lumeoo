import React, { useState } from 'react';
import { Camera, Loader2, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">Lumora</h1>
          <p className="text-gray-400 text-lg">Create your channel today</p>
        </div>

        {/* Form */}
        <div className="space-y-6 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          {/* Logo Preview */}
          <div className="flex justify-center mb-6">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt="Channel logo" 
                className="w-28 h-28 rounded-2xl object-cover border-2 border-purple-400"
              />
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-white/5 backdrop-blur-lg flex items-center justify-center border border-white/20 shadow-lg">
                <Camera className="w-10 h-10 text-gray-300" />
              </div>
            )}
          </div>

          {/* File Input */}
          <div className="relative mb-6">
            <input
              type="file"
              onChange={fileHandler}
              className="hidden"
              id="logo-upload"
              accept="image/*"
            />
            <label
              htmlFor="logo-upload"
              className="w-full py-3 px-6 text-center bg-white/10 backdrop-blur-lg hover:bg-white/15 text-white rounded-xl cursor-pointer transition duration-300 block font-medium border border-white/20"
            >
              Upload Logo
            </label>
          </div>

          {/* Text Inputs */}
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Channel Name"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                className="w-full bg-white/5 backdrop-blur-lg text-white px-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/10 transition duration-200 placeholder-gray-500 border border-white/10"
                required
              />
            </div>
            
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
                className="w-full bg-white/5 backdrop-blur-lg text-white px-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/10 transition duration-200 placeholder-gray-500 border border-white/10 pr-12"
                required
              />
              <Eye className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 cursor-pointer" />
            </div>
            
            <div className="relative">
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>

          {/* Login Link */}
          <p className="text-center text-gray-300 mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-purple-400 hover:text-purple-300 transition duration-200 font-medium">
              Login!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;