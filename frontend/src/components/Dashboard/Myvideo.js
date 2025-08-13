import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Play, Edit3, Trash2, Eye, ThumbsUp, ThumbsDown, Calendar, X } from 'lucide-react';

const MyVideo = () => {
  const [editModal, setEditModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getOwnVideo();
  }, []);

  const getOwnVideo = () => {
    axios.get('http://localhost:5000/video/own-video', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
    .then(res => {
      setVideos(res.data.videos);
    })
    .catch(err => {
      console.log(err);
      toast.error('Failed to fetch videos');
    });
  };

  const handleEditClick = (video) => {
    setCurrentVideo(video);
    setEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/video/update/${currentVideo._id}`, currentVideo, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
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
      axios.delete(`http://localhost:5000/video/${videoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + "M";
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + "K";
    }
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(120,119,198,0.3),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(255,119,198,0.15),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,_rgba(120,119,198,0.1),_transparent_50%)]" />

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent mb-2">
            My Videos
          </h1>
          <p className="text-purple-200/70">Manage and edit your uploaded content</p>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div 
              key={video._id} 
              className="group relative cursor-pointer"
              onClick={() => playVideoHandler(video)}
            >
              <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
                {/* Thumbnail */}
                <div className="relative mb-4 rounded-xl overflow-hidden">
                  <img
                    src={video.thumbnailUrl || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-purple-600/90 backdrop-blur-sm rounded-full p-3">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-purple-200 transition-colors">
                    {video.title}
                  </h3>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-purple-200/70">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{formatViews(video.views)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{video.like}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsDown className="w-4 h-4" />
                        <span>{video.dislike}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(video.createdAt)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(video);
                      }}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteVideo(video._id);
                      }}
                      className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 hover:border-red-400/50 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editModal && currentVideo && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-purple-950/90 to-black/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Edit Video Details
                </h3>
                <button
                  onClick={() => setEditModal(false)}
                  className="text-purple-300 hover:text-white transition-colors p-2 hover:bg-purple-500/20 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={currentVideo.title}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-purple-300/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={currentVideo.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-purple-300/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">Category</label>
                  <select
                    name="category"
                    value={currentVideo.category}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all"
                  >
                    <option value="science">Science</option>
                    <option value="technology">Technology</option>
                    <option value="education">Education</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="motivation">Motivation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    value={currentVideo.tags}
                    onChange={handleChange}
                    placeholder="Separate tags with commas"
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-purple-300/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditModal(false)}
                    className="flex-1 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 hover:border-gray-400/50 text-gray-300 hover:text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyVideo;