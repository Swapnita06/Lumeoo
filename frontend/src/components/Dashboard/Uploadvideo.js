import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Upload, Video, ImageIcon, Play, X } from 'lucide-react';

const UploadVideo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('science');
  const [tags, setTags] = useState('');
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const videoHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setVideoUrl(URL.createObjectURL(file));
    }
  };

  const thumbnailHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        setVideo(file);
        setVideoUrl(URL.createObjectURL(file));
      }
    }
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoUrl(null);
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setImageUrl(null);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('video', video);
    formData.append('thumbnail', thumbnail);

    try {
      const response = await axios.post('http://localhost:5000/video/upload', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setLoading(false);
      toast.success('Video uploaded successfully!');
      navigate('/dashboard/myvideo');
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error(err.response?.data?.error || 'Failed to upload video');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-violet-900/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent mb-4">
              Upload Your Video
            </h1>
            <p className="text-gray-400 text-lg">Share your content with the world</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Video Upload */}
              <div className="space-y-6">
                {/* Video Upload Area */}
                <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Video className="w-5 h-5 text-purple-400" />
                    Video File
                  </h3>

                  {!video ? (
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                        dragActive
                          ? "border-purple-400 bg-purple-500/10"
                          : "border-purple-500/30 hover:border-purple-400/50"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                      <p className="text-white mb-2">Drag and drop your video here</p>
                      <p className="text-gray-400 text-sm mb-4">or</p>
                      <label className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                        Choose Video File
                        <input 
                          type="file" 
                          accept="video/*" 
                          onChange={videoHandler} 
                          className="hidden" 
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="relative bg-black/60 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Play className="w-5 h-5 text-purple-400" />
                          <span className="text-white font-medium">{video.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={removeVideo}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      {videoUrl && (
                        <video 
                          src={videoUrl} 
                          controls 
                          className="w-full rounded-lg" 
                          style={{ maxHeight: "200px" }} 
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Thumbnail Upload */}
                <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-purple-400" />
                    Thumbnail
                  </h3>

                  {!thumbnail ? (
                    <label className="block border-2 border-dashed border-purple-500/30 rounded-xl p-6 text-center cursor-pointer hover:border-purple-400/50 transition-all duration-300">
                      <ImageIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <p className="text-white mb-1">Upload Thumbnail</p>
                      <p className="text-gray-400 text-sm">PNG, JPG up to 10MB</p>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={thumbnailHandler} 
                        className="hidden" 
                      />
                    </label>
                  ) : (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="absolute top-2 right-2 bg-red-500/80 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <img
                        src={imageUrl}
                        alt="Thumbnail preview"
                        className="w-full rounded-xl object-cover"
                        style={{ maxHeight: "200px" }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Video Details */}
              <div className="space-y-6">
                <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Video Details</h3>

                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter video title"
                        className="w-full bg-black/60 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your video"
                        rows={4}
                        className="w-full bg-black/60 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-black/60 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:border-purple-400 focus:outline-none transition-colors"
                      >
                        <option value="science">Science</option>
                        <option value="technology">Technology</option>
                        <option value="education">Education</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="motivation">Motivation</option>
                      </select>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                      <textarea
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Enter tags separated by commas"
                        rows={3}
                        className="w-full bg-black/60 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Upload Button */}
                <button
                  type="submit"
                  disabled={!video || !title || isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload Video
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadVideo;