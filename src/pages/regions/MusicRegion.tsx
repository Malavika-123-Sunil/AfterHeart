// Cleaned-up MusicRegion.tsx (removes unused variables)
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import SpotifyAuth from '../../components/SpotifyAuth';
import CreatePlaylistModal from '../../components/CreatePlaylistModal';
import MusicPlayer from '../../components/MusicPlayer';
import { useAuth } from '../../contexts/AuthContext';
import { spotifyService, isSpotifyTokenExpired } from '../../services/spotify';
import { musicFirebaseService } from '../../services/musicFirebase';
import { useSpotifyPlayer } from '../../hooks/useSpotifyPlayer';
import { useLocation } from 'react-router-dom';

const MusicRegion: React.FC = () => {
  const [tokenExpired, setTokenExpired] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { currentUser } = useAuth();
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

    try {
      await spotifyService.getUserPlaylists();
      await musicFirebaseService.getLikedSongs(currentUser.id);
    } catch (error) {
      console.error('Error loading user content:', error);
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
      <div className="text-center mt-20 text-accent-600 italic">
        <p>"You have survived 100% of your worst days so far."</p>
      </div>
      <MusicPlayer />
    </DashboardLayout>
  );
};

export default MusicRegion;
