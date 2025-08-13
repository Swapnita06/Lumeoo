import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Video, Upload, LogOut, Menu, X } from 'lucide-react';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get user data from localStorage
  const channelName = localStorage.getItem('channelName') || "Creative Studio";
  const logoUrl = localStorage.getItem('logoUrl') || "/abstract-channel-avatar.png";

  const handleLogout = () => {
    // Remove user-related data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('logoUrl');
    localStorage.removeItem('channelName');
    
    // Redirect to login page
    navigate('/login');
  };

  const menuItems = [
    { href: "/allvideos", label: "Home", icon: Home },
    { href: "/dashboard/myvideo", label: "My Videos", icon: Video },
    { href: "/dashboard/uploadvideo", label: "Upload Videos", icon: Upload },
  ];

  const isActiveLink = (href) => location.pathname === href;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/3 w-64 h-64 bg-fuchsia-500/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-black/20 backdrop-blur-md border border-purple-500/20 text-white hover:bg-purple-500/20 transition-all duration-300"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar Navigation */}
        <div
          className={`
          fixed lg:relative inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          <div className="h-full bg-black/40 backdrop-blur-xl border-r border-purple-500/20 flex flex-col">
            {/* Profile Section */}
            <div className="p-8 border-b border-purple-500/20">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <img
                    src={logoUrl}
                    alt="Channel Logo"
                    className="relative w-20 h-20 rounded-full border-2 border-purple-500/30 object-cover"
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    {channelName}
                  </h2>
                  <p className="text-purple-300/70 text-sm mt-1">Content Creator</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 p-6">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveLink(item.href);

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group
                        ${
                          isActive
                            ? "bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-500/30 text-white shadow-lg shadow-purple-500/10"
                            : "text-purple-200/80 hover:text-white hover:bg-purple-500/10 hover:border-purple-500/20 border border-transparent"
                        }
                      `}
                    >
                      <Icon
                        size={20}
                        className={`
                          transition-all duration-300
                          ${isActive ? "text-purple-300" : "text-purple-400 group-hover:text-purple-300"}
                        `}
                      />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full"></div>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Logout Button */}
            <div className="p-6 border-t border-purple-500/20">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-300 hover:text-red-200 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all duration-300 group"
              >
                <LogOut size={20} className="text-red-400 group-hover:text-red-300 transition-colors duration-300" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile overlay */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-0 overflow-auto">
          <div className="min-h-full bg-gradient-to-br from-black/20 via-purple-900/10 to-black/20 backdrop-blur-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;