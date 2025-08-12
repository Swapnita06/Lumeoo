import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import './playvideo.css';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlayVideo = () => {
  const { videoId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [video, setVideo] = useState(location.state?.video || null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [isOwnVideo, setIsOwnVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false); // New loading state for subscription
  
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // Debug logs to verify critical values
  console.log('Current user ID:', userId);
  console.log('Video data:', video);
  console.log('Auth token exists:', !!token);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        if (!video) {
          const response = await axios.get(`http://localhost:5000/video/${videoId}`);
          setVideo(response.data);
        }
      } catch (error) {
        console.error('Error fetching video:', error);
        toast.error('Failed to load video');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId, navigate, video]);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!video?.userId || !userId) {
        console.log('Skipping subscription check - missing video.user_id or userId');
        return;
      }

      try {
        console.log('Checking subscription status for channel:', video.user_id);
        
        if (userId === video.user_id) {
          console.log('Video belongs to current user');
          setIsOwnVideo(true);
          return;
        }

        const subResponse = await axios.get(
          `http://localhost:5000/user/check-subscription/${video.user_id}`,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
        console.log('Subscription check response:', subResponse.data);
        setIsSubscribed(subResponse.data.isSubscribed);

        const channelResponse = await axios.get(
          `http://localhost:5000/user/${video.user_id}`
        );
        console.log('Channel data response:', channelResponse.data);
        setSubscribersCount(channelResponse.data.subscribers || 0);
      } catch (error) {
        console.error('Subscription check error:', error);
        toast.error('Failed to check subscription status');
      }
    };

    if (video?.userId && token) {
      checkSubscription();
    }
  }, [video, userId, token]);

const handleSubscription = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  console.log('Subscribe button clicked');

  if (!token) {
    console.log('No token - redirecting to login');
    toast.error('Please login to subscribe');
    navigate('/login');
    return;
  }

  if (!video?.user_id) {
    console.error('Missing video.user_id - video object:', video);
    toast.error('Channel information not available');
    return;
  }

  // Prevent self-subscription
  const currentChannelId =
    //video.user_id?._id?.$oid  
    video.user_id?._id 
    //video.user_id?.$oid 
    //video.user_id || 
    //null;

  if (!currentChannelId) {
    console.error('Could not determine channel ID from video.user_id');
    toast.error('Channel information not available');
    return;
  }

  if (userId === currentChannelId) {
    console.log('User attempted self-subscription');
    toast.error("You can't subscribe to your own channel");
    return;
  }

  setIsSubscribing(true);
  console.log(`Attempting to ${isSubscribed ? 'unsubscribe' : 'subscribe'}`);

  try {
    const endpoint = isSubscribed ? 'unsubscribe' : 'subscribe';
    console.log('Channel ID (x) is', currentChannelId);

    const response = await axios.put(
      `http://localhost:5000/user/${endpoint}/${currentChannelId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Subscription response:', response.data);

    if (response.status === 200) {
      setIsSubscribed(!isSubscribed);
      setSubscribersCount(prev => isSubscribed ? prev - 1 : prev + 1);
      toast.success(isSubscribed ? 'Unsubscribed successfully' : 'Subscribed successfully');
    } else {
      throw new Error(response.data.error || 'Subscription failed');
    }
  } catch (error) {
    console.error('Subscription error:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      toast.error(error.response.data.error || 'Subscription failed');
    } else {
      toast.error('Network error. Please try again.');
    }
  } finally {
    setIsSubscribing(false);
  }
};


  const handleVideoEnd = async () => {
    try {
      await axios.put(
        `http://localhost:5000/video/views/${videoId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('View count update error:', err);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading video...</div>;
  }

  if (!video) {
    return <div className="error">Video not found</div>;
  }

  return (
    <div className="play-video-container">
      <div className="video-player">
        <video 
          controls 
          onEnded={handleVideoEnd}
          key={video.videoUrl}
        >
          <source src={video.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="video-details">
        <div className="channel-info">
          <div className="channel-details">
            <h3>{video.title || 'Unknown Channel'}</h3>
            <p>{subscribersCount} subscribers</p>
          </div>
          
          {!isOwnVideo && userId && (
            <button 
              onClick={handleSubscription}
              className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`}
              //disabled={!video.user_id || isSubscribing}
              data-testid="subscribe-button"
            >
              {isSubscribing ? 'Processing...' : isSubscribed ? 'Unsubscribe' : 'Subscribe'}
            </button>
          )}
        </div>

        <div className="video-meta">
          <h2>{video.title}</h2>
          <p className="description">{video.description}</p>
          <div className="stats">
            <span>{video.views} views</span>
            <span>Uploaded on: {new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayVideo;