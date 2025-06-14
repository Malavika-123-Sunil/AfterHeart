// Full working MusicRegion.tsx with session handling + full UI
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Play, Plus, Heart, MoreHorizontal } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import SpotifyAuth from '../../components/SpotifyAuth';
import CreatePlaylistModal from '../../components/CreatePlaylistModal';
import MusicPlayer from '../../components/MusicPlayer';
import { useAuth } from '../../contexts/AuthContext';
import { spotifyService, isSpotifyTokenExpired } from '../../services/spotify';
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
  const [tokenExpired, setTokenExpired] = useState(false);

  const { currentUser } = useAuth();
  const { playTrack } = useSpotifyPlayer();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    if (!token || isSpotifyTokenExpired()) {
      setTokenExpired(true);
      setIsAuthenticated(false);
      return;
    }

    spotifyService.setAccessToken(token);
    setIsAuthenticated(true);
    loadUserContent();

    const state = location.state as { error?: string };
    if (state?.error) {
      console.error('Authentication error:', state.error);
    }
  }, [location]);

  const loadUserContent = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const userPlaylists = await spotifyService.getUserPlaylists();
      console.log('🎶 Playlists:', userPlaylists);
      setPlaylists(userPlaylists);

      const likedSongs = await musicFirebaseService.getLikedSongs(currentUser.id);
      console.log('❤️ Liked Songs:', likedSongs);
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
      }));
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
      if (isLiked) setLikedSongs(prev => [...prev, track]);
      else setLikedSongs(prev => prev.filter(t => t.id !== track.id));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAuthSuccess = (token: string) => {
    spotifyService.setAccessToken(token);
    setTokenExpired(false);
    setIsAuthenticated(true);
    loadUserContent();
  };

  if (tokenExpired) {
    return (
      <DashboardLayout>
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-primary-800 mb-3">
            Spotify Session Expired
          </h2>
          <p className="text-accent-600 mb-4">
            Your Spotify session has expired. Please reconnect to continue using music features.
          </p>
          <SpotifyAuth onAuthSuccess={handleAuthSuccess} />
        </div>
      </DashboardLayout>
    );
  }

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
          <h1 className="text-3xl font-display font-bold text-primary-800 mb-2">Music Therapy</h1>
          <p className="text-accent-700 mb-6">
            Discover healing melodies and create playlists that support your emotional journey.
          </p>
          <div className="bg-yellow-50 text-yellow-800 px-5 py-4 rounded-xl shadow-sm text-sm text-center mb-4">
            🎧 <strong>Note:</strong> Spotify Premium is required to play music inside this app. But you can still explore, like, and open songs in the Spotify app.
          </div>
        </motion.div>

        <div className="flex items-center p-4 bg-white rounded-xl shadow mb-4">
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

        <div className="bg-white rounded-xl shadow">
          <div className="flex border-b border-accent-100">
            {['discover', 'playlists', 'liked'].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-3 font-medium text-sm transition-colors ${
                  currentTab === tab
                    ? 'text-primary-700 border-b-2 border-primary-500'
                    : 'text-accent-600 hover:text-primary-600'
                }`}
                onClick={() => setCurrentTab(tab)}
              >
                {tab === 'discover' ? 'Discover' : tab === 'playlists' ? 'Your Playlists' : 'Liked Songs'}
              </button>
            ))}
          </div>

          <div className="p-4">
            {currentTab === 'discover' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">{searchQuery ? 'Search Results' : 'Explore Songs'}</h2>
                {searchResults.length === 0 && (
                  <p className="text-accent-500 text-sm">Start typing above to search for songs 🎵</p>
                )}
                <ul>
                  {searchResults.map((track, i) => (
                    <li key={track.id} className="py-2 flex justify-between items-center border-b">
                      <div>
                        <div className="font-medium">{track.name}</div>
                        <div className="text-sm text-accent-600">{track.artists.map(a => a.name).join(', ')}</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button onClick={() => handlePlayTrack(track)}><Play size={16} /></button>
                        <button onClick={() => handleToggleLike(track)}>
                          <Heart
                            size={16}
                            fill={likedSongs.some(s => s.id === track.id) ? 'currentColor' : 'none'}
                            className={likedSongs.some(s => s.id === track.id) ? 'text-secondary-500' : 'text-accent-500'}
                          />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {currentTab === 'playlists' && (
              <div>
                <div className="flex justify-between mb-4">
                  <h2 className="text-lg font-semibold">Your Playlists</h2>
                  <button className="btn-primary" onClick={() => setIsCreateModalOpen(true)}>
                    <Plus size={16} className="mr-1" /> Create
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {playlists.map(p => (
                    <div key={p.id} className="bg-accent-50 rounded-lg p-4 shadow">
                      <img src={p.images[0]?.url} alt={p.name} className="rounded mb-2" />
                      <div className="font-semibold text-primary-800">{p.name}</div>
                      <div className="text-sm text-accent-500">{p.tracks.total} songs</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentTab === 'liked' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Liked Songs</h2>
                <ul>
                  {likedSongs.map((track, i) => (
                    <li key={track.id} className="py-2 flex justify-between items-center border-b">
                      <div>
                        <div className="font-medium">{track.name}</div>
                        <div className="text-sm text-accent-600">{track.artists.map(a => a.name).join(', ')}</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button onClick={() => handlePlayTrack(track)}><Play size={16} /></button>
                        <button onClick={() => handleToggleLike(track)}>
                          <Heart size={16} fill="currentColor" className="text-secondary-500" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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
