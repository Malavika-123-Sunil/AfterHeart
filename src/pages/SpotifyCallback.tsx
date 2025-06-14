import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyService } from '../services/spotify';

const SPOTIFY_CLIENT_ID = 'e80cdb9818d44e40834810e99cc60859';
const REDIRECT_URI = 'https://after-heart.vercel.app/callback';

const SpotifyCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const exchangeToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const storedState = localStorage.getItem('spotify_auth_state');
      const verifier = localStorage.getItem('spotify_code_verifier');

      if (!code || !state || !verifier || state !== storedState) {
        console.error('Invalid redirect from Spotify');
        navigate('/music', {
          state: {
            error: 'Invalid Spotify redirect',
          },
        });
        return;
      }

      try {
        const body = new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          client_id: SPOTIFY_CLIENT_ID,
          code_verifier: verifier,
        });

        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: body.toString(),
        });

        const data = await response.json();

        if (data.access_token) {
          console.log('✅ Access token received:', data.access_token);
          spotifyService.setAccessToken(data.access_token);
          localStorage.setItem('spotify_token', data.access_token);
          localStorage.setItem('spotify_token_timestamp', Date.now().toString());

          navigate('/music', { state: { success: true } });
        } else {
          console.error('❌ Failed to exchange token:', data);
          navigate('/music', {
            state: {
              error: 'Failed to retrieve Spotify token',
              details: data.error_description || 'No token received',
            },
          });
        }
      } catch (err) {
        console.error('Token exchange failed:', err);
        navigate('/music', {
          state: {
            error: 'Token exchange error',
            details: 'An unexpected error occurred while connecting to Spotify.',
          },
        });
      }
    };

    exchangeToken();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-accent-600">Finalizing Spotify login...</p>
        <p className="text-sm text-accent-400">
          Please wait while we complete the authentication process.
        </p>
      </div>
    </div>
  );
};

export default SpotifyCallback;
