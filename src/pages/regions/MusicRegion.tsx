import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Play, Heart, MoreHorizontal } from 'lucide-react';
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
  const [currentTab, setCurrentTab] = useState<'search' | 'playlists' | 'liked'>('search');
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

  const openInSpotify = (trackUri: string) => {
    const trackId = trackUri.split(':')[2];
    window.open(`https://open.spotify.com/track/${trackId}`, '_blank');
  };

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
      setPlaylists(userPlaylists);

      const likedSongs = await musicFirebaseService.getLikedSongs(currentUser.id);
      const likedTracks = likedSongs.map(song => ({
        id: song.spotifyTrackId,
        name: song.name,
        artists: [{ name: song.artist }],
        album: {
          name: song.name,
          images: [{ url: song.imageUrl }],
        },
        duration_ms: 0,
        uri: `spotify:track:${song.spotifyTrackId}`,
      } as Track));
      setLikedSongs(likedTracks);
    } catch (error) {
      console.error('Error loading user content:', error);
    } finally {
      setIsLoading(false);
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

  const displayedTracks =
    currentTab === 'search' ? searchResults : currentTab === 'liked' ? likedSongs : [];

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
          <p className="text-accent-700 mb-6 text-lg">
            Discover healing melodies and create playlists that support your emotional journey.
          </p>
        </motion.div>

        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              currentTab === 'search'
                ? 'bg-primary-600 text-white'
                : 'bg-accent-100 text-accent-700'
            }`}
            onClick={() => setCurrentTab('search')}
          >
            Search
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              currentTab === 'playlists'
                ? 'bg-primary-600 text-white'
                : 'bg-accent-100 text-accent-700'
            }`}
            onClick={() => setCurrentTab('playlists')}
          >
            Playlists
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              currentTab === 'liked'
                ? 'bg-primary-600 text-white'
                : 'bg-accent-100 text-accent-700'
            }`}
            onClick={() => setCurrentTab('liked')}
          >
            Liked Songs
          </button>
        </div>

        {currentTab === 'playlists' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
              >
                <img
                  src={playlist.images[0]?.url || '/placeholder.jpg'}
                  alt={playlist.name}
                  className="rounded-lg w-full h-40 object-cover mb-3"
                />
                <h3 className="text-primary-800 font-semibold text-lg">
                  {playlist.name}
                </h3>
                <button
                  onClick={() => window.open(`https://open.spotify.com/playlist/${playlist.id}`, '_blank')}
                  className="text-sm text-primary-600 hover:underline mt-2"
                >
                  Open in Spotify
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-accent-600 border-b border-accent-100">
                  <th className="pb-3 pl-4">#</th>
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Artist</th>
                  <th className="pb-3 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedTracks.map((track, index) => (
                  <tr key={track.id} className="border-b border-accent-100 hover:bg-primary-50">
                    <td className="py-3 pl-4 text-accent-600">{index + 1}</td>
                    <td className="py-3 font-medium text-primary-800">{track.name}</td>
                    <td className="py-3 text-accent-700">
                      {track.artists.map((a) => a.name).join(', ')}
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleLike(track)}
                          className={
                            likedSongs.some((s) => s.id === track.id)
                              ? 'text-secondary-500'
                              : 'text-accent-500 hover:text-secondary-500'
                          }
                        >
                          <Heart
                            size={18}
                            fill={likedSongs.some((s) => s.id === track.id) ? 'currentColor' : 'none'}
                          />
                        </button>
                        <button
                          onClick={() => openInSpotify(track.uri)}
                          className="bg-[#1DB954] hover:bg-[#1ed760] text-white px-3 py-1 rounded-full text-xs shadow-sm transition"
                        >
                          Open in Spotify
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
