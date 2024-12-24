import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './allvideo.css';  // Add your CSS here for styling
import { Link } from 'react-router-dom';

const AllVideos = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Fetch all videos except the ones uploaded by the current user
    axios.get('http://localhost:3000/video/allvideos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(res => {
      setVideos(res.data.videos);  // Set the videos data to the state
    })
    .catch(err => {
      console.log(err);
    });
  }, []);

//   // When the video starts playing
// const videoId = 'videoIdFromUrl'; // Replace with the actual video ID
// axios.put(`/video/views/${videoId}`)
//   .then(response => {
//     console.log('View count updated:', response.data.views);
//   })
//   .catch(error => {
//     console.error('Error updating view count:', error);
//   });


  const handleLike = (videoId) => {
    const video = videos.find(video => video._id === videoId);

    if (video.likedBy.includes(localStorage.getItem('userId'))) {
      toast.info('Already liked!');
      return;
    }

    setVideos(videos.map(video =>
      video._id === videoId
        ? {
            ...video,
            like: video.like + 1,
            dislike: video.dislikedBy.includes(localStorage.getItem('userId'))
              ? video.dislike - 1
              : video.dislike,
            likedBy: [...video.likedBy, localStorage.getItem('userId')],
            dislikedBy: video.dislikedBy.filter(
              id => id !== localStorage.getItem('userId')
            ),
          }
        : video
    ));

    axios.put(`http://localhost:3000/video/like/${videoId}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => {
        toast.success('Video liked!');
      })
      .catch(err => {
        console.log(err);
        toast.error('Failed to like the video!');
      });
  };

  const handleDislike = (videoId) => {
    const video = videos.find(video => video._id === videoId);

    if (video.dislikedBy.includes(localStorage.getItem('userId'))) {
      toast.info('Already disliked!');
      return;
    }

    setVideos(videos.map(video =>
      video._id === videoId
        ? {
            ...video,
            dislike: video.dislike + 1,
            like: video.likedBy.includes(localStorage.getItem('userId'))
              ? video.like - 1
              : video.like,
            dislikedBy: [...video.dislikedBy, localStorage.getItem('userId')],
            likedBy: video.likedBy.filter(
              id => id !== localStorage.getItem('userId')
            ),
          }
        : video
    ));

    axios.put(`http://localhost:3000/video/dislike/${videoId}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => {
        toast.success('Video disliked!');
      })
      .catch(err => {
        console.log(err);
        toast.error('Failed to dislike the video!');
      });
  };


  return (
    <div className="main-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
        <h2>All Videos</h2>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search" />
        </div>
        <div className="user-icon-container">
      <Link to="/dashboard">
        <div className="user-icon">User</div>
      </Link>
    </div>
      </header>

      {/* Content Section */}
      <div className="content-container">
        <div className="sidebar">
          <h3>Categories</h3>
          <ul>
            <li>Trending</li>
            <li>Music</li>
            <li>Gaming</li>
            <li>News</li>
            <li>Sports</li>
          </ul>
        </div>

        {/* Video Grid */}
        <div className="video-grid">
          {videos.length > 0 ? (
            videos.map(video => (
              <div className="video-card" key={video._id}>
               <Link
  to="/playvideo"
  state={{ video }} 
>
  <img className="thumbnail" alt="thumbnail" src={video.thumbnailUrl} />
</Link>

                <div className="video-info">
                  <h4 className="title">{video.title}</h4>
                  <p className="views">{video.views} views</p>
                  <p className="date">{new Date(video.createdAt).toLocaleDateString()}</p>
                  <div className="like-dislike-container">
                  <button onClick={() => handleLike(video._id)}>👍 {video.like}</button>
                    <button onClick={() => handleDislike(video._id)}>👎 {video.dislike}</button>
                 
               </div>
                    </div>
              </div>
            ))
          ) : (
            <p>No videos available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllVideos;
