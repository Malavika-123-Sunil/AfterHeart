import React, { useEffect, useState } from 'react';
import { spotifyService } from '../services/spotify';
import { generateCodeVerifier, generateCodeChallenge } from '../pkceUtils';

const SPOTIFY_CLIENT_ID = 'e80cdb9818d44e40834810e99cc60859';
const REDIRECT_URI = 'https://after-heart.vercel.app/callback';

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
  'user-modify-playback-state',
  'user-read-currently-playing'
];

interface SpotifyAuthProps {
  onAuthSuccess: (token: string) => void;
}

const SpotifyAuth: React.FC<SpotifyAuthProps> = ({ onAuthSuccess }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    const timestamp = localStorage.getItem('spotify_token_timestamp');

    if (token && timestamp) {
      const isExpired = Date.now() - parseInt(timestamp) > 3600000;
      if (!isExpired) {
        spotifyService.setAccessToken(token);
        setIsAuthenticated(true);
        onAuthSuccess(token);
      } else {
        localStorage.removeItem('spotify_token');
        localStorage.removeItem('spotify_token_timestamp');
      }
    }
  }, [onAuthSuccess]);

  const initiateAuth = async () => {
    try {
      setError(null);
      localStorage.removeItem('spotify_token');
      localStorage.removeItem('spotify_token_timestamp');
      localStorage.removeItem('spotify_auth_state');

      const verifier = generateCodeVerifier();
      const challenge = await generateCodeChallenge(verifier);
      const state = Math.random().toString(36).substring(2, 15);

      localStorage.setItem('spotify_code_verifier', verifier);
      localStorage.setItem('spotify_auth_state', state);

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: SPOTIFY_CLIENT_ID,
        scope: SCOPES.join(' '),
        redirect_uri: REDIRECT_URI,
        state,
        code_challenge_method: 'S256',
        code_challenge: challenge
      });

      window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to initialize Spotify login. Please try again.');
    }
  };

  if (isAuthenticated) return null;

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
          <p className="font-medium">Error connecting to Spotify</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}
      <div className="space-y-4">
        <button
          onClick={initiateAuth}
          className="btn-primary bg-[#1DB954] hover:bg-[#1ed760] flex items-center justify-center mx-auto px-8 py-3 rounded-full"
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
        <div className="text-sm text-accent-500 space-y-2">
          <p>Having trouble connecting?</p>
          <ul className="list-disc list-inside text-left max-w-md mx-auto">
            <li>Make sure you're logged into Spotify in your browser</li>
            <li>Clear your browser cache and cookies</li>
            <li>Try using an incognito/private window</li>
            <li>Check if Spotify is accessible in your region</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SpotifyAuth;
