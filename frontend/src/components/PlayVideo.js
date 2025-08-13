import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ArrowLeft, Play, Volume2, Maximize, Heart, Share2, Download, Eye, Calendar, MessageSquare, Send } from 'lucide-react';

const PlayVideo = () => {
  const { videoId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [video, setVideo] = useState(location.state?.video || null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [isOwnVideo, setIsOwnVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        if (!video) {
          const response = await axios.get(`https://lumora-vbnl.onrender.com/video/${videoId}`);
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
    const fetchComments = async () => {
      try {
        const response = await axios.get(`https://lumora-vbnl.onrender.com/comments/${videoId}`);
        setComments(response.data.commentList || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast.error('Failed to load comments');
      }
    };

    if (videoId) {
      fetchComments();
    }
  }, [videoId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    if (!token) {
      toast.error('Please login to comment');
      navigate('/login');
      return;
    }

    setIsCommenting(true);
    try {
      console.log('video id-:', videoId);
      const response = await axios.post(
        `https://lumora-vbnl.onrender.com/comment/new-comment/${videoId}`,
        { commentText: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setComments([response.data.newComment, ...comments]);
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsCommenting(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editCommentText.trim()) return;
    
    try {
      const response = await axios.put(
        `https://lumora-vbnl.onrender.com/comments/${commentId}`,
        { commentText: editCommentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setComments(comments.map(comment => 
        comment._id === commentId ? response.data.updatedComment : comment
      ));
      setEditingCommentId(null);
      setEditCommentText('');
      toast.success('Comment updated!');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await axios.delete(
        `https://lumora-vbnl.onrender.com/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setComments(comments.filter(comment => comment._id !== commentId));
      toast.success('Comment deleted!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    const checkSubscription = async () => {
      if (!video?.user_id?._id) {
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
        const currentChannelId = video.user_id?._id || video.user_id;
        console.log('currentChannelId ',currentChannelId);
        
        const subResponse = await axios.get(
          `https://lumora-vbnl.onrender.com/user/check-subscription/${currentChannelId}`,
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
          `https://lumora-vbnl.onrender.com/user/${currentChannelId}`,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
        console.log('Channel data response:', channelResponse.data);
        setSubscribersCount(channelResponse.data.subscribers || 0);
      } catch (error) {
        console.error('Subscription check error:', error);
        toast.error('Failed to check subscription status');
      }
    };

    if (video?.user_id && token) {
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

    const currentChannelId = video.user_id?._id || video.user_id;

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
        `https://lumora-vbnl.onrender.com/user/${endpoint}/${currentChannelId}`,
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

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      toast.error('Please login to like videos');
      navigate('/login');
      return;
    }

    const isAlreadyLiked = video.likedBy?.includes(userId);
    const endpoint = isAlreadyLiked ? 'dislike' : 'like';

    // Optimistic UI update
    setVideo(prev => ({
      ...prev,
      like: isAlreadyLiked ? prev.like - 1 : prev.like + 1,
      dislike: isAlreadyLiked ? prev.dislike : 
               (prev.dislikedBy?.includes(userId) ? prev.dislike - 1 : prev.dislike),
      likedBy: isAlreadyLiked 
        ? prev.likedBy?.filter(id => id !== userId) 
        : [...(prev.likedBy || []), userId],
      dislikedBy: isAlreadyLiked 
        ? prev.dislikedBy 
        : (prev.dislikedBy || []).filter(id => id !== userId)
    }));

    try {
      await axios.put(
        `https://lumora-vbnl.onrender.com/video/${endpoint}/${video._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(isAlreadyLiked ? 'Removed like' : 'Video liked!');
    } catch (error) {
      console.error('Like error:', error);
      // Rollback optimistic update
      setVideo(prev => ({
        ...prev,
        like: isAlreadyLiked ? prev.like + 1 : prev.like - 1,
        dislike: isAlreadyLiked ? prev.dislike : 
                 (prev.dislikedBy?.includes(userId) ? prev.dislike + 1 : prev.dislike),
        likedBy: isAlreadyLiked 
          ? [...(prev.likedBy || []), userId]
          : prev.likedBy?.filter(id => id !== userId),
        dislikedBy: isAlreadyLiked 
          ? prev.dislikedBy 
          : (prev.dislikedBy || []).filter(id => id !== userId)
      }));
      toast.error(`Failed to ${isAlreadyLiked ? 'Dislike' : 'like'} the video!`);
    }
  };

  const handleVideoEnd = async () => {
    try {
      await axios.put(
        `https://lumora-vbnl.onrender.com/video/views/${video._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('View count update error:', err);
    }
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center">
        <div className="text-purple-300">Loading video...</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center">
        <div className="text-purple-300">Video not found</div>
      </div>
    );
  }

  const isLiked = video.likedBy?.includes(userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-3 rounded-xl bg-black/40 backdrop-blur-md border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:bg-purple-500/10 group"
          >
            <ArrowLeft className="w-5 h-5 text-purple-300 group-hover:text-purple-200 transition-colors" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-violet-300 bg-clip-text text-transparent">
            Now Playing
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden bg-black/60 backdrop-blur-md border border-purple-500/20 shadow-2xl shadow-purple-500/10">
              {/* Video Container */}
              <div className="relative aspect-video bg-gradient-to-br from-purple-900/20 to-black/40">
                <video
                  className="w-full h-full object-cover"
                  controls
                  onEnded={handleVideoEnd}
                  src={video.videoUrl}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Video Info */}
            <div className="mt-6 p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-purple-500/20">
              <h2 className="text-2xl font-bold text-white mb-3">{video.title}</h2>
              <div className="border-t border-purple-500/20 pt-4">
                <p className="text-purple-200 leading-relaxed">
                  {Array.isArray(video.tags)
                    ? video.tags.map(tag => `#${tag}`).join(", ")
                    : `#${video.tags}`}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-purple-300 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{formatViews(video.views)} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isLiked
                      ? "bg-purple-500/20 text-purple-300 border border-purple-400/30"
                      : "bg-black/40 text-purple-400 border border-purple-500/20 hover:bg-purple-500/10"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? "fill-purple-500 text-purple-500" : ""}`} />
                  <span>{video.like || 0}</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 text-purple-400 border border-purple-500/20 hover:bg-purple-500/10 transition-all duration-300">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 text-purple-400 border border-purple-500/20 hover:bg-purple-500/10 transition-all duration-300">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>

              {/* Description */}
              <div className="border-t border-purple-500/20 pt-4">
                <p className="text-purple-200 leading-relaxed">{video.description}</p>
              </div>

              {/* Comments Section */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-300" />
                  <span>Comments ({comments.length})</span>
                </h3>

                {/* Add Comment Form */}
                {token && (
                  <form onSubmit={handleAddComment} className="mb-8">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="w-full bg-black/40 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isCommenting || !newComment.trim()}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl hover:from-purple-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        {isCommenting ? 'Posting...' : 'Post'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.length === 0 ? (
                    <p className="text-purple-300/70 text-center py-8">No comments yet. Be the first to comment!</p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment._id} className="p-4 rounded-xl bg-black/30 border border-purple-500/20">
                        {editingCommentId === comment._id ? (
                          <div className="space-y-3">
                            <textarea
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                              rows="3"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditComment(comment._id)}
                                className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-500"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingCommentId(null);
                                  setEditCommentText('');
                                }}
                                className="px-3 py-1 bg-black/40 border border-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/10"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                                {comment.userId?.channelName?.charAt(0) || 'U'}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-white">
                                    {comment.userId?.channelName || 'User'}
                                  </h4>
                                  <span className="text-xs text-purple-400">
                                    {formatDate(comment.createdAt)}
                                  </span>
                                </div>
                                <p className="text-purple-200 mt-1">{comment.commentText}</p>
                              </div>
                            </div>
                            {userId === comment.userId?._id && (
                              <div className="flex gap-3 text-sm text-purple-400">
                                <button
                                  onClick={() => {
                                    setEditingCommentId(comment._id);
                                    setEditCommentText(comment.commentText);
                                  }}
                                  className="hover:text-purple-300"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(comment._id)}
                                  className="hover:text-purple-300"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Channel Info Sidebar */}
          <div className="space-y-6">
            {/* Channel Card */}
            <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-purple-500/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 p-0.5">
                  <div className="w-full h-full rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {video.channelName?.charAt(0) || 'C'}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{video.user_id.channelName|| 'Channel'}</h3>
                  <p className="text-purple-300 text-sm">{subscribersCount.toLocaleString()} subscribers</p>
                </div>
              </div>

              {!isOwnVideo && (
                <button
                  onClick={handleSubscription}
                  disabled={isSubscribing}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    isSubscribed
                      ? "bg-purple-500/20 text-purple-300 border border-purple-400/30 hover:bg-purple-500/30"
                      : "bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-500 hover:to-violet-500 shadow-lg shadow-purple-500/25"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSubscribing ? "Processing..." : isSubscribed ? "Unsubscribe" : "Subscribe"}
                </button>
              )}
            </div>

            {/* Related Videos */}
            <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-purple-500/20">
              <h3 className="text-lg font-bold text-white mb-4">Up Next</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex gap-3 p-3 rounded-xl bg-black/20 hover:bg-purple-500/10 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="w-20 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center">
                      <Play className="w-4 h-4 text-purple-300 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-medium mb-1 group-hover:text-purple-200 transition-colors">
                        Related Video {i}
                      </h4>
                      <p className="text-purple-400 text-xs">{video.title || 'Channel'}</p>
                      <p className="text-purple-400 text-xs">{Math.floor(Math.random() * 100)}K views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayVideo;