import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyService } from '../services/spotify';

const SPOTIFY_CLIENT_ID = 'e80cdb9818d44e40834810e99cc60859';
const REDIRECT_URI = 'https://after-heart.vercel.app/callback';

const SpotifyCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handlePKCECallback = async () => {
      try {
        console.log('🎧 Processing Spotify PKCE callback...');

        const query = new URLSearchParams(window.location.search);
        const code = query.get('code');
        const returnedState = query.get('state');
        const storedState = localStorage.getItem('spotify_auth_state');
        const codeVerifier = localStorage.getItem('spotify_code_verifier');

        console.log('🧾 Returned state:', returnedState);
        console.log('🧾 Stored state:', storedState);
        console.log('🔐 Auth code:', code);

        if (!code || !returnedState || returnedState !== storedState) {
          console.error('⚠️ State mismatch or missing code');
          navigate('/music', {
            state: {
              error: 'Authentication failed',
              details: 'State mismatch or missing code.',
            },
          });
          return;
        }

        if (!codeVerifier) {
          console.error('❌ Missing code verifier');
          navigate('/music', {
            state: {
              error: 'Missing PKCE verifier',
              details: 'Please try logging in again.',
            },
          });
          return;
        }

        // Exchange auth code for access token
        const body = new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          client_id: SPOTIFY_CLIENT_ID,
          code_verifier: codeVerifier
        });

        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: body.toString()
        });

        const data = await response.json();
        console.log('🎉 Token response:', data);

        if (!data.access_token) {
          throw new Error(data.error_description || 'Token exchange failed');
        }

        const expiresIn = data.expires_in || 3600;
        const expirationTime = Date.now() + expiresIn * 1000;

        // Store token and expiration
        localStorage.setItem('spotify_token', data.access_token);
        localStorage.setItem('spotify_token_timestamp', Date.now().toString());
        localStorage.setItem('spotify_token_expires_at', expirationTime.toString());

        // Clean up
        localStorage.removeItem('spotify_auth_state');
        localStorage.removeItem('spotify_code_verifier');

        // Set access token
        spotifyService.setAccessToken(data.access_token);
        navigate('/music', { state: { success: true } });

      } catch (err) {
        console.error('❌ PKCE Callback error:', err);
        navigate('/music', {
          state: {
            error: 'Authentication error',
            details: 'Something went wrong. Please try again.',
          },
        });
      }
    };

    handlePKCECallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-accent-600">Connecting to Spotify securely...</p>
        <p className="text-sm text-accent-400">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  );
};

export default SpotifyCallback;
