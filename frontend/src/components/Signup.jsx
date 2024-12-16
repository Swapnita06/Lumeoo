import { useState } from 'react';
import '../components/Signup.css'
const Signup = ()=>{
    const [channelName,setChannelName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [phone,setPhone]=useState('');
    const [logo,setLogo] = useState(null);
    const [imageUrl,setImageUrl]= useState('');


    const fileHandler=(e)=>{
        console.log(e.target.files[0]);
        setLogo(e.target.files[0])
        setImageUrl(URL.createObjectURL(e.target.files[0]))
    }

    const submitHandler=(e)=>{
        e.preventDefault();
        const formData =new FormData();
        formData.append('channelName',channelName)
        formData.append('email',email)
        formData.append('phone',phone)
        formData.append('password',password)
        formData.append('logo',logo)

        axios.post('http://localhost:3000/user/signup',formData)
        .then(res=>{
            console.log(res)
        })
        .catch(err=>{
            console.log(err)
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
        <img className='preview-img' alt='logo-image' src={imageUrl}/>
        <button type='submit'>Submit</button>
        </form>
      
    </div>
)
}

export default Signup;