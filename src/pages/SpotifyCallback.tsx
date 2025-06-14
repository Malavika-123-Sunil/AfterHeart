import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyService } from '../services/spotify';

const SPOTIFY_CLIENT_ID = 'e80cdb9818d44e40834810e99cc60859';
const REDIRECT_URI = 'https://after-heart.vercel.app/callback';

const SpotifyCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccessToken = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const code = queryParams.get('code');
      const state = queryParams.get('state');
      const error = queryParams.get('error');
      const storedState = localStorage.getItem('spotify_auth_state');
      const codeVerifier = localStorage.getItem('spotify_code_verifier');

      // Clear state from storage
      localStorage.removeItem('spotify_auth_state');
      localStorage.removeItem('spotify_code_verifier');

      if (error) {
        console.error('Spotify auth error:', error);
        navigate('/music', {
          state: {
            error: 'Authentication failed',
            details: error,
          },
        });
        return;
      }

      if (!code || !state || state !== storedState || !codeVerifier) {
        console.error('State mismatch or missing code/verifier');
        navigate('/music', {
          state: {
            error: 'Security verification failed',
            details: 'State mismatch or missing code. Please try again.',
          },
        });
        return;
      }

      try {
        const body = new URLSearchParams({
          client_id: SPOTIFY_CLIENT_ID,
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          code_verifier: codeVerifier,
        });

        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: body.toString(),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error_description || 'Token request failed');
        }

        const data = await response.json();
        const { access_token, expires_in } = data;

        // Store access token and timestamp
        localStorage.setItem('spotify_token', access_token);
        localStorage.setItem('spotify_token_timestamp', Date.now().toString());
        spotifyService.setAccessToken(access_token);

        console.log('Spotify authenticated successfully!');
        navigate('/music', { state: { success: true } });
      } catch (err) {
        console.error('Token exchange error:', err);
        navigate('/music', {
          state: {
            error: 'Token exchange failed',
            details: (err as Error).message,
          },
        });
      }
    };

    fetchAccessToken();
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
