import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import {useNavigate } from 'react-router-dom';
import './myvideo.css'
const Myvideo = () => {

const [videos,setVideos] = useState([]);
const [editModal, setEditModal] = useState(false);
const [currentVideo, setCurrentVideo] = useState(null);


const navigate = useNavigate();
useEffect(()=>{
 getOwnVideo()
},[])

const getOwnVideo=()=>{
  axios.get('http://localhost:5000/video/own-video',{
    headers:{
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  })
  .then(res=>{
     console.log(res.data)
     setVideos(res.data.videos)
  })
  .catch(err=>{
    console.log(err)
  })
}

const handleEditClick = (video) => {
  setCurrentVideo(video);
  setEditModal(true);
};

const handleEditSubmit = (e) => {
  e.preventDefault();
  axios
    .put(`http://localhost:5000/video/update/${currentVideo._id}`, currentVideo, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then((res) => {
      toast.success('Video updated successfully!');
      setEditModal(false);
      getOwnVideo(); // Refresh the video list
    })
    .catch((err) => {
      toast.error('Failed to update video!');
      console.log(err);
    });
};

const handleChange = (e) => {
  const { name, value } = e.target;
  setCurrentVideo((prev) => ({ ...prev, [name]: value }));
};

const playVideoHandler = (video) => {
  navigate('/playvideo', { state: { video } }); 
};


const deleteVideo = (videoId) => {
  const confirmDelete = window.confirm('Are you sure you want to delete this video?');
  if (confirmDelete) {
    axios
      .delete(`http://localhost:5000/video/${videoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        toast.success('Video deleted successfully!');
        setVideos((prevVideos) => prevVideos.filter((video) => video._id !== videoId));
      })
      .catch((err) => {
        console.log(err);
        toast.error('Failed to delete video.');
      });
  }
};

  return (
    <div className='myvideos-contaimer'>
      <table className='video-table'>
        <thead>
          <tr>
            <th>Video</th>
            <th>Title</th>
            <th>Date</th>
            <th>Views</th>
            <td>Likes vs Dislikes</td> 
            <th>Delete</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {
            videos.map(video=>(
<tr key={video._id}>
  <td><img alt= 'thumbnail' src={video.thumbnailUrl}
  onClick={() => playVideoHandler(video)} // Navigate on click
                  style={{ cursor: 'pointer' }}
                />
   </td>
  <td>{video.title}</td>
  <td>{video.createdAt}</td>
  <td>{video.views}</td>
  <td>{video.like}/{video.dislike}</td>
  <td><button onClick={() => deleteVideo(video._id)} >Delete</button></td>
  <td><button onClick={() => handleEditClick(video)} >Edit</button></td>
</tr>
            )
            )}
        </tbody>
      </table>
      {editModal && currentVideo && (
        <div className="edit-modal">
          <div className="modal-content">
            <h3>Edit Video Details</h3>
            <form onSubmit={handleEditSubmit}>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={currentVideo.title}
                onChange={handleChange}
                required
              />
              <label>Description:</label>
              <textarea
                name="description"
                value={currentVideo.description}
                onChange={handleChange}
                required
              />
              <label>Category:</label>
              <select
                name="category"
                value={currentVideo.category}
                onChange={handleChange}
                required
              >
                <option value="science">Science</option>
                <option value="technology">Technology</option>
                <option value="education">Education</option>
                <option value="entertainment">Entertainment</option>
                <option value="motivation">Motivation</option>
              </select>
              <label>Tags:</label>
              <input
                type="text"
                name="tags"
                value={currentVideo.tags}
                onChange={handleChange}
              />
              <button type="submit">Save Changes</button>
              <button
                type="button"
                onClick={() => setEditModal(false)}
                className="close-btn"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
</div>
  );
}

export default Myvideo