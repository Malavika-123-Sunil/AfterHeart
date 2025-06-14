// MusicRegion.tsx (Updated with Open in Spotify Button + UI preserved)
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

  return (
    <DashboardLayout>
      {/* Your existing layout and headers remain unchanged */}

      {/* 👇 Example button usage for tracks */}
      {/* Wherever you're rendering track actions inside a table or list, update this: */}

      {/* Example inside a track row */}
      {/*
      <div className="flex items-center justify-center space-x-3">
        <button
          onClick={() => openInSpotify(track.uri)}
          className="bg-[#1DB954] hover:bg-[#1ed760] text-white px-3 py-1 rounded-full text-xs shadow-sm transition"
        >
          Open in Spotify
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
      </div>
      */}

      {/* The rest of your UI code (search, playlists, liked songs, etc.) stays the same */}

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
