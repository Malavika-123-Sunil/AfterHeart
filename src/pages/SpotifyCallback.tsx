// SpotifyCallback.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyService } from '../services/spotify';

const SpotifyCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = () => {
      try {
        console.log('Processing Spotify callback...');

        const queryParams = new URLSearchParams(window.location.search);
        const queryError = queryParams.get('error');
        if (queryError) {
          navigate('/music', {
            state: {
              error: 'Authentication failed',
              details: queryError,
            },
          });
          return;
        }

        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const expiresIn = hashParams.get('expires_in') || '3600';
        const state = hashParams.get('state');
        const storedState = localStorage.getItem('spotify_auth_state');

        localStorage.removeItem('spotify_auth_state');

        if (!state || state !== storedState) {
          navigate('/music', {
            state: {
              error: 'Security verification failed',
              details: 'Please try logging in again',
            },
          });
          return;
        }

        if (!accessToken) {
          navigate('/music', {
            state: {
              error: 'Authentication incomplete',
              details: 'No access token received. Please try again.',
            },
          });
          return;
        }

        const expirationTime = Date.now() + parseInt(expiresIn) * 1000;

        // Store token and expiration
        localStorage.setItem('spotify_token', accessToken);
        localStorage.setItem('spotify_token_timestamp', Date.now().toString());
        localStorage.setItem('spotify_token_expires_at', expirationTime.toString());

        spotifyService.setAccessToken(accessToken);
        navigate('/music', { state: { success: true } });
      } catch (err) {
        console.error('Callback handling error:', err);
        navigate('/music', {
          state: {
            error: 'Authentication error',
            details: 'An unexpected error occurred. Please try again.',
          },
        });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-accent-600">Connecting to Spotify...</p>
        <p className="text-sm text-accent-400">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  );
};

export default SpotifyCallback;


// spotifyService.ts (Add this function)
export function isSpotifyTokenExpired() {
  const expiry = localStorage.getItem('spotify_token_expires_at');
  if (!expiry) return true;
  return Date.now() > parseInt(expiry);
}
