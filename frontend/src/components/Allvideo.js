import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Search, User, ThumbsUp, ThumbsDown, Film, Play, Star, Sparkles, TrendingUp } from "lucide-react";

const AllVideos = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [activeTab, setActiveTab] = useState("Home");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        setIsLoading(true);
        let response;
        if (activeTab === "My Videos") {
          response = await axios.get("https://lumora-vbnl.onrender.com/video/own-video", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          response = await axios.get("https://lumora-vbnl.onrender.com/video/allvideos", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
        
        setVideos(response.data.videos);
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch videos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [navigate, activeTab]);

  useEffect(() => {
    const getFilteredAndSortedVideos = () => {
      let filtered = [...videos];
      
      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter((video) =>
          video.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Sort based on active category
      switch (activeCategory) {
        case "Popular":
          return filtered.sort((a, b) => b.like - a.like);
        case "Latest":
          return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        case "Most Watched":
          return filtered.sort((a, b) => b.views - a.views);
        default:
          return filtered;
      }
    };

    setFilteredVideos(getFilteredAndSortedVideos());
  }, [videos, searchTerm, activeCategory]);

  const handleLike = async (videoId) => {
    try {
      const video = videos.find(video => video._id === videoId);
      
      if (video.likedBy.includes(localStorage.getItem("userId"))) {
        toast.info("Already liked!");
        return;
      }

      // Optimistic update
      setVideos(videos.map(video =>
        video._id === videoId
          ? {
              ...video,
              like: video.like + 1,
              dislike: video.dislikedBy.includes(localStorage.getItem("userId"))
                ? video.dislike - 1
                : video.dislike,
              likedBy: [...video.likedBy, localStorage.getItem("userId")],
              dislikedBy: video.dislikedBy.filter(
                id => id !== localStorage.getItem("userId")
              ),
            }
          : video
      ));

      await axios.put(`https://lumora-vbnl.onrender.comvideo/like/${videoId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Video liked!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to like the video!");
      // Revert optimistic update
      setVideos(videos);
    }
  };

  const handleDislike = async (videoId) => {
    try {
      const video = videos.find(video => video._id === videoId);
      
      if (video.dislikedBy.includes(localStorage.getItem("userId"))) {
        toast.info("Already disliked!");
        return;
      }

      // Optimistic update
      setVideos(videos.map(video =>
        video._id === videoId
          ? {
              ...video,
              dislike: video.dislike + 1,
              like: video.likedBy.includes(localStorage.getItem("userId"))
                ? video.like - 1
                : video.like,
              dislikedBy: [...video.dislikedBy, localStorage.getItem("userId")],
              likedBy: video.likedBy.filter(
                id => id !== localStorage.getItem("userId")
              ),
            }
          : video
      ));

      await axios.put(`https://lumora-vbnl.onrender.com/video/dislike/${videoId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Video disliked!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to dislike the video!");
      // Revert optimistic update
      setVideos(videos);
    }
  };

  const handleUploadClick = () => {
    navigate("/dashboard/uploadvideo");
  };

  const categories = ["Popular", "Latest", "Most Watched"];
  const tabs = ["Home", "My Videos", "Upload"];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center">
        <div className="text-purple-300 text-xl">Loading videos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-purple-500/30 shadow-2xl shadow-purple-900/20">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl blur-lg opacity-75" />
                <div className="relative bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl p-3 shadow-2xl shadow-purple-500/50">
                  <Film className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Lum<span className="text-purple-400">ora</span>
                </span>
                <div className="flex items-center gap-1 text-purple-300 text-xs">
                  <Sparkles className="w-3 h-3" />
                  <span>Premium Experience</span>
                </div>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => tab === "Upload" ? handleUploadClick() : setActiveTab(tab)}
                  className={`relative transition-all duration-300 font-medium group ${
                    activeTab === tab
                      ? "text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {tab}
                  <div className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500 transition-all duration-300 ${
                    activeTab === tab ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-full blur-xl" />
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search videos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-80 pl-12 pr-6 py-4 rounded-full bg-black/40 border border-purple-500/40 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 backdrop-blur-xl transition-all shadow-2xl shadow-purple-900/20"
                  />
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-full blur-xl" />
                <button 
                  className="relative p-4 rounded-full bg-black/40 border border-purple-500/40 hover:bg-purple-600/20 text-purple-200 hover:text-white transition-all backdrop-blur-xl shadow-2xl shadow-purple-900/20"
                  onClick={() => navigate('/dashboard')}
                >
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-[80vh] overflow-hidden">
        <img
          src="/cinematic-movie-theater.png"
          alt="Featured Content"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-purple-900/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl animate-pulse delay-1000" />

        <div className="relative container mx-auto px-6 h-full flex items-center">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-400/40 rounded-full text-purple-200 text-sm font-semibold mb-6 backdrop-blur-xl shadow-2xl shadow-purple-900/30">
              <TrendingUp className="w-5 h-5" />
              Trending Now
              <Sparkles className="w-4 h-4" />
            </div>

            <h1 className="text-7xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Immerse Yourself
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                In Cinema Magic
              </span>
            </h1>

            <p className="text-gray-300 text-xl mb-10 leading-relaxed max-w-2xl">
              {activeTab === "My Videos" 
                ? "Your personal collection of uploaded videos"
                : "Experience the future of entertainment with our premium streaming platform. Discover blockbusters, indie gems, and exclusive content in stunning 4K quality."}
            </p>

            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full blur-xl opacity-75" />
                {/* <button 
                  className="relative flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-full hover:from-purple-600 hover:to-violet-700 transition-all shadow-2xl shadow-purple-500/50 font-bold text-lg"
                  onClick={() => {
                    if (filteredVideos.length > 0) {
                      navigate('/playvideo', { state: { video: filteredVideos[0] } });
                    }
                  }}
                >
                  <Play className="w-6 h-6" />
                  {activeTab === "My Videos" ? "Play Latest" : "Start Watching"}
                </button> */}
              </div>

              {activeTab === "My Videos" && (
                <button 
                  className="flex items-center gap-4 px-10 py-5 bg-black/40 border border-purple-500/40 text-white rounded-full hover:bg-purple-600/20 transition-all backdrop-blur-xl font-bold text-lg shadow-2xl shadow-purple-900/20"
                  onClick={handleUploadClick}
                >
                  <Star className="w-6 h-6" />
                  Upload New
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative container mx-auto px-6 py-16">
        {/* Categories */}
        <div className="flex items-center gap-10 mb-16 overflow-x-auto pb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative text-xl font-bold whitespace-nowrap transition-all duration-300 ${
                activeCategory === category
                  ? "text-transparent bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text"
                  : "text-gray-400 hover:text-purple-300"
              }`}
            >
              {category}
              {activeCategory === category && (
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video, index) => (
              <article key={video._id} className="group cursor-pointer" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="relative">
                  {/* Card Background Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-black/60 border border-purple-500/30 backdrop-blur-xl shadow-2xl shadow-purple-900/30 group-hover:shadow-purple-500/40 transition-all duration-500">
                    <img
                      src={video.thumbnailUrl || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onClick={() => navigate('/playvideo', { state: { video } })}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 text-purple-300 text-sm font-semibold mb-3">
                          {/* <Star className="w-4 h-4 fill-current" /> */}
                          {/* <span>{video.rating || "No rating"}</span>
                          <span className="text-purple-400">•</span>
                          <span>{video.duration || "No duration"}</span> */}
                          <span className="text-purple-400">•</span>
                          <span className="text-purple-200">{video.category}</span>
                        </div>
                        <h3 className="text-white font-bold text-xl mb-3 line-clamp-2">{video.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-purple-200">
                          <span>{video.views.toLocaleString()} views</span>
                          <span className="text-purple-400">•</span>
                          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="absolute top-6 right-6">
                        <div className="relative">
                          <div className="absolute inset-0 bg-purple-500/50 rounded-full blur-lg" />
                          <button 
                            className="relative p-4 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full hover:from-purple-600 hover:to-violet-700 transition-all shadow-2xl shadow-purple-500/50"
                            onClick={() => navigate('/playvideo', { state: { video } })}
                          >
                            <Play className="w-6 h-6 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between mt-6 px-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleLike(video._id);
                      }}
                      className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 ${
                        video.likedBy?.includes(localStorage.getItem("userId"))
                          ? "text-purple-300 bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-400/40 shadow-lg shadow-purple-500/20"
                          : "text-gray-400 hover:text-purple-300 hover:bg-purple-500/10 border border-purple-500/20 hover:border-purple-400/40"
                      } backdrop-blur-xl`}
                    >
                      <ThumbsUp className="w-5 h-5" />
                      <span className="font-semibold">{video.like.toLocaleString()}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDislike(video._id);
                      }}
                      className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 ${
                        video.dislikedBy?.includes(localStorage.getItem("userId"))
                          ? "text-purple-300 bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-400/40 shadow-lg shadow-purple-500/20"
                          : "text-gray-400 hover:text-purple-300 hover:bg-purple-500/10 border border-purple-500/20 hover:border-purple-400/40"
                      } backdrop-blur-xl`}
                    >
                      <ThumbsDown className="w-5 h-5" />
                      <span className="font-semibold">{video.dislike.toLocaleString()}</span>
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-3xl blur-2xl" />
                <div className="relative bg-black/40 border border-purple-500/30 rounded-3xl p-16 backdrop-blur-xl shadow-2xl shadow-purple-900/30">
                  <Film className="w-20 h-20 text-purple-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {activeTab === "My Videos" ? "You haven't uploaded any videos yet" : "No videos found"}
                  </h3>
                  <p className="text-gray-400 text-lg">
                    {activeTab === "My Videos" 
                      ? "Click 'Upload' to share your first video" 
                      : "Try adjusting your search terms or browse different categories"}
                  </p>
                  {activeTab === "My Videos" && (
                    <button
                      className="mt-6 bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-violet-700 transition-all"
                      onClick={handleUploadClick}
                    >
                      Upload Video
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllVideos;