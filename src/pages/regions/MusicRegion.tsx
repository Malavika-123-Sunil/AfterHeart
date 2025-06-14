// MusicRegion.tsx (Updated Table Layout and Enhanced Tabs)
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Heart } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import SpotifyAuth from '../../components/SpotifyAuth';
import CreatePlaylistModal from '../../components/CreatePlaylistModal';
import MusicPlayer from '../../components/MusicPlayer';
import { useAuth } from '../../contexts/AuthContext';
import { spotifyService, isSpotifyTokenExpired } from '../../services/spotify';
import { musicFirebaseService } from '../../services/musicFirebase';
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
  const [currentTab, setCurrentTab] = useState<'search' | 'playlists' | 'liked'>('search');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [likedSongs, setLikedSongs] = useState<Track[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { currentUser } = useAuth();
  const location = useLocation();

  const openInSpotify = (trackUri: string) => {
    const trackId = trackUri.split(':')[2];
    window.open(`https://open.spotify.com/track/${trackId}`, '_blank');
  };

  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    if (!token || isSpotifyTokenExpired()) {
      setTokenExpired(true);
      return;
    }
    spotifyService.setAccessToken(token);
    setIsAuthenticated(true);
    loadUserContent();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const loadUserContent = async () => {
    if (!currentUser) return;
    try {
      const userPlaylists = await spotifyService.getUserPlaylists();
      setPlaylists(userPlaylists);

      const likedSongs = await musicFirebaseService.getLikedSongs(currentUser.id);
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
    } catch (err) {
      console.error('Loading content failed:', err);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      const results = await spotifyService.searchTracks(query);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleLike = async (track: Track) => {
    if (!currentUser) return;
    try {
      const isLiked = await musicFirebaseService.toggleLikedSong(currentUser.id, track);
      if (isLiked) {
        setLikedSongs(prev => [...prev, track]);
      } else {
        setLikedSongs(prev => prev.filter(t => t.id !== track.id));
      }
    } catch (err) {
      console.error('Liking song failed:', err);
    }
  };

  if (tokenExpired) {
    return (
      <DashboardLayout>
        <div className="text-center p-6">
          <h2 className="text-xl font-semibold text-primary-800 mb-3">Spotify Session Expired</h2>
          <p className="text-accent-600 mb-4">Please reconnect your Spotify to continue.</p>
          <SpotifyAuth onAuthSuccess={(token) => {
            spotifyService.setAccessToken(token);
            setTokenExpired(false);
            setIsAuthenticated(true);
            loadUserContent();
          }} />
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <DashboardLayout>
        <SpotifyAuth onAuthSuccess={(token) => {
          spotifyService.setAccessToken(token);
          setIsAuthenticated(true);
          loadUserContent();
        }} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-display font-bold text-primary-800 mb-4">Music Therapy</h1>
          <div className="flex space-x-4 mb-6">
            <button onClick={() => setCurrentTab('search')} className={currentTab === 'search' ? 'font-semibold text-primary-700 underline' : 'text-accent-600'}>Search</button>
            <button onClick={() => setCurrentTab('playlists')} className={currentTab === 'playlists' ? 'font-semibold text-primary-700 underline' : 'text-accent-600'}>Playlists</button>
            <button onClick={() => setCurrentTab('liked')} className={currentTab === 'liked' ? 'font-semibold text-primary-700 underline' : 'text-accent-600'}>Liked Songs</button>
          </div>
        </motion.div>

        <div className="bg-white rounded-xl shadow-md">
          <div className="p-6">
            {currentTab === 'search' && (
              <>
                <div className="mb-4 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Search size={18} className="text-accent-500" />
                  </div>
                  <input
                    type="text"
                    className="input pl-10"
                    placeholder="Search songs or artists..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-accent-600 border-b border-accent-100">
                      <th className="pb-3 pl-4">Title</th>
                      <th className="pb-3">Artist</th>
                      <th className="pb-3">Playlist</th>
                      <th className="pb-3">Liked</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((track) => (
                      <tr key={track.id} className="border-b border-accent-100 hover:bg-primary-50">
                        <td className="py-3 pl-4 font-medium text-primary-800">{track.name}</td>
                        <td className="py-3 text-accent-700">{track.artists.map(a => a.name).join(', ')}</td>
                        <td className="py-3 text-accent-600">-</td>
                        <td className="py-3 text-accent-600">
                          <button onClick={() => handleLike(track)}>
                            <Heart
                              size={16}
                              className={likedSongs.some(s => s.id === track.id) ? 'text-secondary-500' : 'text-accent-400'}
                              fill={likedSongs.some(s => s.id === track.id) ? 'currentColor' : 'none'}
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {currentTab === 'playlists' && (
              <>
                <h2 className="text-xl font-semibold mb-4">Your Playlists</h2>
                {playlists.length === 0 ? (
                  <p className="text-accent-600">No playlists found.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {playlists.map((playlist) => (
                      <div key={playlist.id} className="border rounded-lg overflow-hidden shadow-sm">
                        <img src={playlist.images[0]?.url} alt={playlist.name} className="w-full h-40 object-cover" />
                        <div className="p-4">
                          <h3 className="font-medium text-primary-800">{playlist.name}</h3>
                          <p className="text-sm text-accent-600">{playlist.tracks.total} songs</p>
                          <button onClick={() => window.open(`https://open.spotify.com/playlist/${playlist.id}`, '_blank')} className="text-xs text-primary-600 mt-2 underline">Open in Spotify</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {currentTab === 'liked' && (
              <>
                <h2 className="text-xl font-semibold mb-4">Liked Songs</h2>
                {likedSongs.length === 0 ? (
                  <p className="text-accent-600">No liked songs yet.</p>
                ) : (
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-left text-accent-600 border-b border-accent-100">
                        <th className="pb-3 pl-4">Title</th>
                        <th className="pb-3">Artist</th>
                        <th className="pb-3">Playlist</th>
                        <th className="pb-3">Liked</th>
                      </tr>
                    </thead>
                    <tbody>
                      {likedSongs.map((track) => (
                        <tr key={track.id} className="border-b border-accent-100 hover:bg-primary-50">
                          <td className="py-3 pl-4 font-medium text-primary-800">{track.name}</td>
                          <td className="py-3 text-accent-700">{track.artists.map(a => a.name).join(', ')}</td>
                          <td className="py-3 text-accent-600">-</td>
                          <td className="py-3 text-accent-600">
                            <button onClick={() => handleLike(track)}>
                              <Heart
                                size={16}
                                className={likedSongs.some(s => s.id === track.id) ? 'text-secondary-500' : 'text-accent-400'}
                                fill={likedSongs.some(s => s.id === track.id) ? 'currentColor' : 'none'}
                              />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
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
