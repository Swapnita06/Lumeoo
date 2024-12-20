import React from 'react'
import '../Dashboard/dashboard.css'
import { Link, Outlet, useLocation } from 'react-router-dom'


const Dashboard = () => {
  const loction = useLocation();
  return (
    <div className='dashboard-container'>
         <div className='side-nav'>
<div className='profile-container'>
    <img src={localStorage.getItem('logoUrl')}/>
    <h2>{localStorage.getItem('channelName')}</h2>
</div>
<div className='menu-container'>
            <Link  to="/dashboard/home" className={loction.pathname=='/dashboard/home'?'active-menu-link':'menu-link'} >Home</Link>
            <Link to="/dashboard/myvideo" className={loction.pathname=='/dashboard/myvideo'?'active-menu-link':'menu-link'}  >My Videos</Link>
            <Link to="/dashboard/uploadvideo" className={loction.pathname=='/dashboard/uploadvideo'?'active-menu-link':'menu-link'} >Upload Videos</Link>
            <Link className='menu-link'  >Logout</Link>
            
         </div>
         </div>
         <div className='content-container'>
<Outlet/>
         </div>
    </div>
  )
}

export default Dashboard