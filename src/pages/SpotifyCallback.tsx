import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyService } from '../services/spotify';

const SPOTIFY_CLIENT_ID = 'e80cdb9818d44e40834810e99cc60859';
const REDIRECT_URI = 'https://after-heart.vercel.app/callback';

const SpotifyCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get('code');
        const error = queryParams.get('error');
        const state = queryParams.get('state');
        const storedState = localStorage.getItem('spotify_auth_state');

        if (error) {
          console.error('Spotify auth error:', error);
          navigate('/music', { state: { error: 'Authentication failed', details: error } });
          return;
        }

        if (state !== storedState) {
          console.error('State mismatch');
          navigate('/music', { state: { error: 'Security verification failed', details: 'State mismatch. Try again.' } });
          return;
        }

        if (!code) {
          console.error('No code received');
          navigate('/music', { state: { error: 'Missing authorization code', details: 'Try logging in again.' } });
          return;
        }

        const verifier = localStorage.getItem('spotify_code_verifier');
        if (!verifier) {
          console.error('Missing code verifier');
          navigate('/music', { state: { error: 'Missing verifier', details: 'Please reconnect your Spotify account.' } });
          return;
        }

        // Exchange code for access token
        const body = new URLSearchParams({
          client_id: SPOTIFY_CLIENT_ID,
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          code_verifier: verifier
        });

        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Token exchange failed: ${errorText}`);
        }

        const data = await response.json();
        const accessToken = data.access_token;

        spotifyService.setAccessToken(accessToken);
        localStorage.setItem('spotify_token', accessToken);
        localStorage.setItem('spotify_token_timestamp', Date.now().toString());

        navigate('/music', { state: { success: true } });
      } catch (err) {
        console.error('Spotify callback error:', err);
        navigate('/music', { state: { error: 'Authentication error', details: 'Something went wrong.' } });
      } finally {
        localStorage.removeItem('spotify_auth_state');
        localStorage.removeItem('spotify_code_verifier');
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
