import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Play, Plus, Heart, MoreHorizontal } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import SpotifyAuth from '../../components/SpotifyAuth';
import CreatePlaylistModal from '../../components/CreatePlaylistModal';
import MusicPlayer from '../../components/MusicPlayer';
import { useAuth } from '../../contexts/AuthContext';
import { spotifyService } from '../../services/spotify';
import { musicFirebaseService } from '../../services/musicFirebase';
import { useSpotifyPlayer } from '../../hooks/useSpotifyPlayer';
import { useLocation } from 'react-router-dom';

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  duration_ms: number;
  uri: string;
  album: {
    name: string;
    images: { url: string }[];
  };
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  tracks: {
    total: number;
  };
}

const MusicRegion: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('discover');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [likedSongs, setLikedSongs] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const { currentUser } = useAuth();
  const { playTrack } = useSpotifyPlayer();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    if (token) {
      spotifyService.setAccessToken(token);
      setIsAuthenticated(true);
      loadUserContent();
    }

    // Check for authentication errors
    const state = location.state as { error?: string };
    if (state?.error) {
      console.error('Authentication error:', state.error);
    }
  }, [location]);

  const loadUserContent = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      // Load playlists
      const userPlaylists = await spotifyService.getUserPlaylists();
      setPlaylists(userPlaylists);

      // Load liked songs
      const likedSongs = await musicFirebaseService.getLikedSongs(currentUser.id);
      // Convert Firebase liked songs to Spotify track format
      const likedTracks = likedSongs.map(song => ({
        id: song.spotifyTrackId,
        name: song.name,
        artists: [{ name: song.artist }],
        album: {
          name: song.name,
          images: [{ url: song.imageUrl }]
        },
        duration_ms: 0,
        uri: `spotify:track:${song.spotifyTrackId}`
      } as Track));
      setLikedSongs(likedTracks);
    } catch (error) {
      console.error('Error loading user content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await spotifyService.searchTracks(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handlePlayTrack = async (track: Track) => {
    try {
      await playTrack(track.uri);
      await musicFirebaseService.addRecentlyPlayed(currentUser!.id, track);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const handleToggleLike = async (track: Track) => {
    if (!currentUser) return;

    try {
      const isLiked = await musicFirebaseService.toggleLikedSong(currentUser.id, track);
      if (isLiked) {
        setLikedSongs(prev => [...prev, track]);
      } else {
        setLikedSongs(prev => prev.filter(t => t.id !== track.id));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAuthSuccess = (token: string) => {
    spotifyService.setAccessToken(token);
    setIsAuthenticated(true);
    loadUserContent();
  };

  if (!isAuthenticated) {
    return (
      <DashboardLayout>
        <SpotifyAuth onAuthSuccess={handleAuthSuccess} />
      </DashboardLayout>
    );
  }

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
                onChange={(e) => handleSearch(e.target.value)}
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
                {searchQuery ? 'Search Results' : 'Recommended for You'}
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
                    {(searchQuery ? searchResults : []).map((track, index) => (
                      <tr key={track.id} className="border-b border-accent-100 hover:bg-primary-50">
                        <td className="py-3 pl-4 text-accent-600">{index + 1}</td>
                        <td className="py-3 font-medium text-primary-800">{track.name}</td>
                        <td className="py-3 text-accent-700">
                          {track.artists.map(a => a.name).join(', ')}
                        </td>
                        <td className="py-3 text-right text-accent-600 pr-4">
                          {Math.floor(track.duration_ms / 60000)}:
                          {Math.floor((track.duration_ms % 60000) / 1000)
                            .toString()
                            .padStart(2, '0')}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center justify-center space-x-3">
                            <button
                              onClick={() => handlePlayTrack(track)}
                              className="text-accent-500 hover:text-primary-600"
                            >
                              <Play size={18} />
                            </button>
                            <button
                              onClick={() => handleToggleLike(track)}
                              className={
                                likedSongs.some(s => s.id === track.id)
                                  ? "text-secondary-500"
                                  : "text-accent-500 hover:text-secondary-500"
                              }
                            >
                              <Heart
                                size={18}
                                fill={likedSongs.some(s => s.id === track.id) ? "currentColor" : "none"}
                              />
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
                <button
                  className="btn-primary"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Plus size={16} className="mr-2" />
                  New Playlist
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {playlists.map((playlist) => (
                  <motion.div
                    key={playlist.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-accent-100"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={playlist.images[0]?.url || '/placeholder.jpg'}
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
                      <p className="text-sm text-accent-600">{playlist.tracks.total} songs</p>
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
                      <th className="pb-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {likedSongs.map((track, index) => (
                      <tr key={track.id} className="border-b border-accent-100 hover:bg-primary-50">
                        <td className="py-3 pl-4 text-accent-600">{index + 1}</td>
                        <td className="py-3 font-medium text-primary-800">{track.name}</td>
                        <td className="py-3 text-accent-700">
                          {track.artists.map(a => a.name).join(', ')}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center justify-center space-x-3">
                            <button
                              onClick={() => handlePlayTrack(track)}
                              className="text-accent-500 hover:text-primary-600"
                            >
                              <Play size={18} />
                            </button>
                            <button
                              onClick={() => handleToggleLike(track)}
                              className="text-secondary-500"
                            >
                              <Heart size={18} fill="currentColor" />
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
      </div>

      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPlaylistCreated={loadUserContent}
      />

      <MusicPlayer />
    </DashboardLayout>
  );
};

export default MusicRegion;