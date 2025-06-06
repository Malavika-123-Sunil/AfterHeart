import React, { useEffect, useState } from 'react';
import { spotifyService } from '../services/spotify';

const SPOTIFY_CLIENT_ID = 'e80cdb9818d44e40834810e99cc60859';
// Update this to your actual deployed HTTPS URL or use environment variable
const REDIRECT_URI = 'https://after-heart.vercel.app/callback';

//const REDIRECT_URI = 'http://localhost:5174/callback';
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-modify-private',
  'playlist-modify-public',
  'user-library-read',
  'user-library-modify',
  'streaming',
  'user-read-playback-state',
  'user-modify-playback-state'
];

interface SpotifyAuthProps {
  onAuthSuccess: (token: string) => void;
}

const SpotifyAuth: React.FC<SpotifyAuthProps> = ({ onAuthSuccess }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's an existing token in localStorage
    const existingToken = localStorage.getItem('spotify_token');
    if (existingToken) {
      spotifyService.setAccessToken(existingToken);
      setIsAuthenticated(true);
      onAuthSuccess(existingToken);
    }

    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get('access_token');
    const errorParam = params.get('error');

    if (errorParam) {
      setError('Failed to authenticate with Spotify. Please try again.');
      return;
    }

    if (accessToken) {
      spotifyService.setAccessToken(accessToken);
      localStorage.setItem('spotify_token', accessToken);
      setIsAuthenticated(true);
      onAuthSuccess(accessToken);
      // Remove the access token from the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [onAuthSuccess]);

  const handleLogin = () => {
    // Clear any existing errors
    setError(null);
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${encodeURIComponent(SCOPES.join(' '))}&show_dialog=true`;
    
    window.location.href = authUrl;
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="text-center p-6">
      <h2 className="text-xl font-display font-semibold text-primary-800 mb-4">
        Connect with Spotify
      </h2>
      <p className="text-accent-700 mb-6">
        Connect your Spotify account to access your playlists and create new ones.
      </p>
      {error && (
        <div className="bg-error-50 text-error-700 p-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      <button
        onClick={handleLogin}
        className="btn-primary bg-[#1DB954] hover:bg-[#1ed760] flex items-center justify-center mx-auto"
      >
        <svg
          className="w-6 h-6 mr-2"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
        Connect with Spotify
      </button>
    </div>
  );
};

export default SpotifyAuth; 