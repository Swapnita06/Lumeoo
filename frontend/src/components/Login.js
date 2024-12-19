import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/Signup.css'
import axios  from 'axios'
import { toast } from 'react-toastify';
 
const Login = ()=>{
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [isLoading,setLoading]= useState(false);
    const navigate= useNavigate();

    const submitHandler=(e)=>{
        e.preventDefault();
        setLoading(true);
       
        
        axios.post('http://localhost:3000/user/login',{
          email:email,
          password:password
        })
        .then(res=>{
            setLoading(false);
            console.log(res.data)
            localStorage.setItem('token',res.data.token)
            localStorage.setItem('userId',res.data._id)
            navigate('/dashboard')
            toast.success("Welcome to Lumeo!")
        })
        .catch(err=>{
            setLoading(false);
            console.log(err.response.data.error)
            toast.error(err.response.data.error)
        })
    }
return(
    <div className="main-wrapper">
        <div className='wrapper-header'>
            <img className='logo-image' alt='logo' src={require('../assets/yputubeimg.png')}/>
            <h2 className='c-name'>Lumeo</h2>
        </div>
       
        <form className="form-wrapper" onSubmit={submitHandler}>
        <input required  onChange={(e)=>{setEmail(e.target.value)}} type='email' placeholder='Email' />
        <input required  onChange={(e)=>{setPassword(e.target.value)}} type='password' placeholder='Password' />
        <button type='submit'>{isLoading && <i class="fa-solid fa-spinner fa-spin-pulse"></i>}Submit</button>
        <Link to = '/signup' className='link' >Create your Account</Link>
        
        </form>
      
    </div>
)
}

export default Login;