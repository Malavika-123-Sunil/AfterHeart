import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Play, Plus, Heart, MoreHorizontal } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

// Mock data for playlists
const mockPlaylists = [
  { id: 1, name: "Healing Melodies", songs: 24, image: "https://images.pexels.com/photos/3941855/pexels-photo-3941855.jpeg" },
  { id: 2, name: "Moving Forward", songs: 18, image: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg" },
  { id: 3, name: "Self-Love Journey", songs: 15, image: "https://images.pexels.com/photos/1028599/pexels-photo-1028599.jpeg" },
];

// Mock data for songs
const mockSongs = [
  { id: 1, title: "Healing Begins", artist: "Serene Sounds", duration: "3:45", liked: true },
  { id: 2, title: "Let It Go", artist: "The Healers", duration: "4:12", liked: false },
  { id: 3, title: "New Beginnings", artist: "Soul Revival", duration: "3:28", liked: true },
  { id: 4, title: "Inner Peace", artist: "Mindful Melodies", duration: "5:03", liked: false },
  { id: 5, title: "Rising Again", artist: "Phoenix Rising", duration: "4:37", liked: true },
  { id: 6, title: "Self-Compassion", artist: "Heart Whispers", duration: "3:51", liked: false },
];

const MusicRegion: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('discover');
  
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-800 mb-3">
            Music Therapy
          </h1>
          <p className="text-accent-700 mb-8 text-lg">
            Discover healing melodies and create playlists that support your emotional journey.
          </p>
        </motion.div>
        
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
          <div className="flex items-center p-4 border-b border-accent-100">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-accent-500" />
              </div>
              <input
                type="text"
                className="input pl-10"
                placeholder="Search songs, artists, or playlists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex border-b border-accent-100">
            <button
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                currentTab === 'discover'
                  ? 'text-primary-700 border-b-2 border-primary-500'
                  : 'text-accent-600 hover:text-primary-600'
              }`}
              onClick={() => setCurrentTab('discover')}
            >
              Discover
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                currentTab === 'playlists'
                  ? 'text-primary-700 border-b-2 border-primary-500'
                  : 'text-accent-600 hover:text-primary-600'
              }`}
              onClick={() => setCurrentTab('playlists')}
            >
              Your Playlists
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                currentTab === 'liked'
                  ? 'text-primary-700 border-b-2 border-primary-500'
                  : 'text-accent-600 hover:text-primary-600'
              }`}
              onClick={() => setCurrentTab('liked')}
            >
              Liked Songs
            </button>
          </div>
          
          {currentTab === 'discover' && (
            <div className="p-6">
              <h2 className="text-xl font-display font-semibold text-primary-800 mb-4">
                Healing Collections
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockPlaylists.map((playlist) => (
                  <motion.div
                    key={playlist.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-primary-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={playlist.image}
                        alt={playlist.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <button className="absolute bottom-4 right-4 bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-full shadow-lg transition-colors">
                        <Play size={20} fill="white" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-primary-800">{playlist.name}</h3>
                      <p className="text-sm text-accent-600">{playlist.songs} songs</p>
                    </div>
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-accent-50 rounded-xl overflow-hidden border-2 border-dashed border-accent-200 flex flex-col items-center justify-center h-48 text-accent-600 hover:bg-accent-100 transition-colors cursor-pointer"
                >
                  <Plus size={32} className="mb-2" />
                  <span className="font-medium">Create Playlist</span>
                </motion.div>
              </div>
              
              <h2 className="text-xl font-display font-semibold text-primary-800 mt-10 mb-4">
                Recommended for You
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-accent-600 border-b border-accent-100">
                      <th className="pb-3 pl-4">#</th>
                      <th className="pb-3">Title</th>
                      <th className="pb-3">Artist</th>
                      <th className="pb-3 text-right pr-4">Duration</th>
                      <th className="pb-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSongs.map((song, index) => (
                      <tr key={song.id} className="border-b border-accent-100 hover:bg-primary-50">
                        <td className="py-3 pl-4 text-accent-600">{index + 1}</td>
                        <td className="py-3 font-medium text-primary-800">{song.title}</td>
                        <td className="py-3 text-accent-700">{song.artist}</td>
                        <td className="py-3 text-right text-accent-600 pr-4">{song.duration}</td>
                        <td className="py-3">
                          <div className="flex items-center justify-center space-x-3">
                            <button className="text-accent-500 hover:text-primary-600">
                              <Play size={18} />
                            </button>
                            <button className={song.liked ? "text-secondary-500" : "text-accent-500 hover:text-secondary-500"}>
                              <Heart size={18} fill={song.liked ? "currentColor" : "none"} />
                            </button>
                            <button className="text-accent-500 hover:text-primary-600">
                              <MoreHorizontal size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {currentTab === 'playlists' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-display font-semibold text-primary-800">
                  Your Playlists
                </h2>
                <button className="btn-primary">
                  <Plus size={16} className="mr-2" />
                  New Playlist
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockPlaylists.map((playlist) => (
                  <motion.div
                    key={playlist.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-accent-100"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={playlist.image}
                        alt={playlist.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <button className="absolute bottom-4 right-4 bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-full shadow-lg transition-colors">
                        <Play size={20} fill="white" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-primary-800">{playlist.name}</h3>
                      <p className="text-sm text-accent-600">{playlist.songs} songs</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {currentTab === 'liked' && (
            <div className="p-6">
              <h2 className="text-xl font-display font-semibold text-primary-800 mb-6">
                Liked Songs
              </h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-accent-600 border-b border-accent-100">
                      <th className="pb-3 pl-4">#</th>
                      <th className="pb-3">Title</th>
                      <th className="pb-3">Artist</th>
                      <th className="pb-3 text-right pr-4">Duration</th>
                      <th className="pb-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSongs.filter(song => song.liked).map((song, index) => (
                      <tr key={song.id} className="border-b border-accent-100 hover:bg-primary-50">
                        <td className="py-3 pl-4 text-accent-600">{index + 1}</td>
                        <td className="py-3 font-medium text-primary-800">{song.title}</td>
                        <td className="py-3 text-accent-700">{song.artist}</td>
                        <td className="py-3 text-right text-accent-600 pr-4">{song.duration}</td>
                        <td className="py-3">
                          <div className="flex items-center justify-center space-x-3">
                            <button className="text-accent-500 hover:text-primary-600">
                              <Play size={18} />
                            </button>
                            <button className="text-secondary-500">
                              <Heart size={18} fill="currentColor" />
                            </button>
                            <button className="text-accent-500 hover:text-primary-600">
                              <MoreHorizontal size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="bg-white rounded-2xl shadow-md p-8 mb-8"
        >
          <h2 className="text-xl font-display font-semibold text-primary-800 mb-4">
            Music & Emotions
          </h2>
          <p className="text-accent-700 mb-6">
            Music therapy can be a powerful way to process emotions. Different types of music can help with different aspects of healing.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary-50 rounded-lg p-6">
              <h3 className="font-medium text-primary-800 mb-2">For Processing Grief</h3>
              <p className="text-accent-700 text-sm">
                Slow, reflective music can create a safe space to feel and process sadness and loss.
              </p>
            </div>
            <div className="bg-secondary-50 rounded-lg p-6">
              <h3 className="font-medium text-primary-800 mb-2">For Releasing Anger</h3>
              <p className="text-accent-700 text-sm">
                More intense or rhythmic music can help channel and release feelings of anger or frustration.
              </p>
            </div>
            <div className="bg-accent-50 rounded-lg p-6">
              <h3 className="font-medium text-primary-800 mb-2">For Boosting Mood</h3>
              <p className="text-accent-700 text-sm">
                Upbeat, positive music can help lift your spirits and remind you that joy is still possible.
              </p>
            </div>
            <div className="bg-success-50 rounded-lg p-6">
              <h3 className="font-medium text-primary-800 mb-2">For Finding Calm</h3>
              <p className="text-accent-700 text-sm">
                Ambient or nature-based sounds can reduce anxiety and promote a sense of peace.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default MusicRegion;