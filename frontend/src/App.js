import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard/Dashboard'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from './components/Dashboard/Home';
import Myvideo from './components/Dashboard/Myvideo';
import Uploadvideo from './components/Dashboard/Uploadvideo';
import PlayVideo from './components/PlayVideo';
import AllVideos from './components/Allvideo';


function App() {
  return (
    <div>
  
    <BrowserRouter>
    <Routes>
     <Route exact path="/" element={<Signup />}></Route>
      <Route exact path="/signup" element={<Signup/>}/>
      <Route exact path="/login" element={<Login/>}/>
      <Route exact path="/playvideo" element={<PlayVideo/>}/>
      <Route path="/allvideos" element={<AllVideos />} />
      <Route exact path="/dashboard" element={<Dashboard/>}>
      <Route path='' element={<Myvideo/>}/>
      <Route path="home" element={<Home/>}/>
      <Route path="myvideo" element={<Myvideo/>}/>
      <Route path="uploadvideo" element={<Uploadvideo/>}/>
      </Route>
     </Routes>
     </BrowserRouter>
     <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </div>

  );
}

export default App;
