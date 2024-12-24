import React from 'react';
import { useLocation } from 'react-router-dom';
import './playvideo.css';


const PlayVideo = () => {
  const location = useLocation();
  const { video } = location.state; 

  if (!video) {
    return <p>No video selected. Please select a video to play.</p>;
  }

  return (
    <div className="play-video-container">
      <div className="video-player">
        <video controls>
          <source src={video.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="video-details">
        <h2>{video.title}</h2>
        <p>{video.description}</p>
        <p>Uploaded on: {new Date(video.createdAt).toLocaleDateString()}</p>
        <p>Views: {video.views}</p>
        <p>Likes: {video.like}</p>
        <p>Dislikes: {video.dislike}</p>
      </div>
    </div>
  );
};

export default PlayVideo;
