import React from 'react'
import '../Dashboard/dashboard.css'
import { Link, Outlet, useLocation,useNavigate } from 'react-router-dom'


const Dashboard = () => {
  const loction = useLocation();
  const navigate = useNavigate();


  const handleLogout = () => {
    // Remove user-related data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('logoUrl');
    localStorage.removeItem('channelName');
    
    // Redirect to login page
    navigate('/login');
  }

  return (
    <div className='dashboard-container'>
         <div className='side-nav'>
<div className='profile-container'>
    <img src={localStorage.getItem('logoUrl')}/>
    <h2>{localStorage.getItem('channelName')}</h2>
</div>
<div className='menu-container'>
            <Link  to="/allvideos" className={loction.pathname=='/dashboard/home'?'active-menu-link':'menu-link'} >Home</Link>
            <Link to="/dashboard/myvideo" className={loction.pathname=='/dashboard/myvideo'?'active-menu-link':'menu-link'}  >My Videos</Link>
            <Link to="/dashboard/uploadvideo" className={loction.pathname=='/dashboard/uploadvideo'?'active-menu-link':'menu-link'} >Upload Videos</Link>
 <Link to="/login" className='menu-link' onClick={handleLogout}   >Logout</Link>
            
         </div>
         </div>
         <div className='content-container'>
<Outlet/>
         </div>
    </div>
  )
}

export default Dashboard