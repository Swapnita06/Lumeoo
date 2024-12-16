import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/Signup.css'
import axios  from 'axios'
import { toast } from 'react-toastify';
 
const Signup = ()=>{
    const [channelName,setChannelName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [phone,setPhone]=useState('');
    const [logo,setLogo] = useState(null);
    const [imageUrl,setImageUrl]= useState('');
    const [isLoading,setLoading]= useState(false);
    const navigate= useNavigate();

    const fileHandler=(e)=>{
        console.log(e.target.files[0]);
        setLogo(e.target.files[0])
        setImageUrl(URL.createObjectURL(e.target.files[0]))
    }

    const submitHandler=(e)=>{
        e.preventDefault();
        setLoading(true);
        const formData =new FormData();
        formData.append('channelName',channelName)
        formData.append('email',email)
        formData.append('phone',phone)
        formData.append('password',password)
        formData.append('logo',logo)

        axios.post('http://localhost:3000/user/signup',formData)
        .then(res=>{
            setLoading(false);
            navigate('/login')
            console.log(res.data)
            toast.success("Registered Successfully!")
        })
        .catch(err=>{
            setLoading(false);
            console.log(err)
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
        <input required onChange={(e)=>{setChannelName(e.target.value)}} type='text' placeholder='Channel Name' />
        <input required  onChange={(e)=>{setEmail(e.target.value)}} type='email' placeholder='Email' />
        <input required  onChange={(e)=>{setPassword(e.target.value)}} type='password' placeholder='Password' />
        <input required  onChange={(e)=>{setPhone(e.target.value)}} type='text' placeholder='Phone' />
        <input required  onChange={fileHandler} type='file' />
        {imageUrl && <img className='preview-img' alt='logo-image' src={imageUrl}/>}
        <button type='submit'>{isLoading && <i class="fa-solid fa-spinner fa-spin-pulse"></i>}Submit</button>
        <Link to = '/login' className='link' >Already registered?</Link>
        
        </form>
      
    </div>
)
}

export default Signup;