import React, { useState } from 'react'
import './uploadvideo.css'
import { toast } from 'react-toastify'
import axios from 'axios'

const Uploadvideo = () => {
  const [title,setTite] = useState('')
  const [description,setDescription] = useState('')
  const [category,setCategory] = useState('')
  const [tags,setTags] = useState('')
  const [video,setVideo] = useState(null)
  const [thumbnail,setThumbnail] = useState(null)
  const [isLoading,setLoading] = useState(false)
  const [imageUrl,setImageUrl] = useState(null)

const videohandler=(e)=>{
 setVideo(e.target.files[0])
}

const thumbnailhandler=(e)=>{
  setThumbnail(e.target.files[0])
  setImageUrl(URL.createObjectURL(e.target.files[0]))
}

const submithandler = (e)=>{
  e.preventDefault();
  setLoading(true)
  console.log(title,description,tags,category,video,thumbnail)
const formData = new formData()
formData.append('title',title)
formData.append('description',description)
formData.append('category',category)
formData.append('tags',tags)
formData.append('video',video)
formData.append('thumbnail',thumbnail)

axios.post('http://localhost:3000/video/upload',formData,{
  headers:{
    Authorization:'Bearer' +localStorage.getItem('token')
  }
})
.then(res=>{
 setLoading(false)
 console.log(res.data)
 toast("Video is uploaded")
})
.catch(err=>{
  console.log(err)
  setLoading(false)
  toast.error(err.response.data.error)
})
}

  return (
    <div className='upload-container'>
      <h2>Upload video</h2>
      <form onSubmit={submithandler} className='upload-form'>
        <input onChange={(e)=>{setTite(e.target.value)}} placeholder='Title'/>
        <textarea onChange={(e)=>{setDescription(e.target.value)}} placeholder='description'/>
        <select onChange={(e)=>{setCategory(e.target.value)}}>
          <option value='science'>Science</option>
          <option value='technology'>Technology</option>
          <option value='education'>Education</option>
          <option value='entertainment'>Entertainment</option>
          <option value='motivation'>Motivation</option>
        </select>
        <textarea onChange={(e)=>{setTags(e.target.value)}} placeholder='tags'/>
        <label>Select video</label>
        <input onChange={videohandler} type='file'/>

        <label>thumbnail</label>
        <input onChange={thumbnailhandler} type='file'/>
        {imageUrl && <img className='thumbnail' alt='thumbnail'src = {imageUrl}/>}
        <button type='submit'>{isLoading && <i class="fa-solid fa-spinner fa-spin-pulse"></i>}Upload</button>
      </form>
    </div>
  )
}

export default Uploadvideo