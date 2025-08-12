import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ThumbsUp, ThumbsDown, TrendingUp, Music, Gamepad2, Newspaper, Trophy, Film, Play } from 'lucide-react';


const AllVideos = () => {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Popular');
  const navigate = useNavigate();

  // useEffect(() => {
  //   axios.get('http://localhost:5000/video/allvideos', {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     },
  //   })
  //   .then(res => {
  //     setVideos(res.data.videos);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     toast.error('Failed to fetch videos');
  //   });
  // }, []);


  useEffect(() => {
  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/video/allvideos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Access the videos array from response.data
      setVideos(response.data.videos);
    } catch (err) {
      console.log(err);
      toast.error('Failed to fetch videos');
    }
  };

  fetchVideos();
}, [navigate]);

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

    axios.put(`http://localhost:5000/video/like/${videoId}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(() => {
        toast.success('Video liked!');
      })
      .catch(() => {
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

    axios.put(`http://localhost:5000/video/dislike/${videoId}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(() => {
        toast.success('Video disliked!');
      })
      .catch(() => {
        toast.error('Failed to dislike the video!');
      });
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = ['Popular', 'Latest', 'Recommended'];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-orange-500 rounded-lg p-2">
                <Film className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Play<span className="text-orange-500">Zoon</span></span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8 text-gray-400">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <Link to="/genre" className="hover:text-white transition">Genre</Link>
              <Link to="/top-rated" className="hover:text-white transition">Top Rated</Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-gray-700"
                />
              </div>

              <Link to="/dashboard" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-200 transition">
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-[70vh] bg-gradient-to-b from-transparent to-[#0A0A0A]">
        <img
          src="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80"
          alt="Featured Movie"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-white mb-4">Thrilling Movie</h1>
            <p className="text-gray-300 text-lg mb-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <button className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition">
              <Play className="w-5 h-5" />
              Watch Now
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Categories */}
        <div className="flex items-center gap-8 mb-8 overflow-x-auto pb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-lg font-medium whitespace-nowrap ${
                activeCategory === category
                  ? 'text-orange-500'
                  : 'text-gray-400 hover:text-white'
              } transition`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <article
                key={video._id}
                className="group"
              >
                <Link to="/playvideo" state={{ video }} className="block">
                  <div className="aspect-video relative rounded-xl overflow-hidden bg-gray-800">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition">
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-medium line-clamp-1">{video.title}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
                          <span>{video.views.toLocaleString()} views</span>
                          <span>•</span>
                          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={() => handleLike(video._id)}
                    className={`flex items-center gap-1 ${
                      video.likedBy.includes(localStorage.getItem('userId'))
                        ? 'text-orange-500'
                        : 'text-gray-400 hover:text-orange-500'
                    } transition`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{video.like}</span>
                  </button>
                  <button
                    onClick={() => handleDislike(video._id)}
                    className={`flex items-center gap-1 ${
                      video.dislikedBy.includes(localStorage.getItem('userId'))
                        ? 'text-orange-500'
                        : 'text-gray-400 hover:text-orange-500'
                    } transition`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>{video.dislike}</span>
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">No videos found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllVideos;