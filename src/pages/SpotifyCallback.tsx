import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyService } from '../services/spotify';

const SpotifyCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get('access_token');
    const error = params.get('error');

    if (error) {
      navigate('/music', { 
        state: { 
          error: 'Authentication failed. Please try again.',
          details: error
        } 
      });
      return;
    }

    if (accessToken) {
      spotifyService.setAccessToken(accessToken);
      localStorage.setItem('spotify_token', accessToken);
      localStorage.setItem('spotify_token_timestamp', Date.now().toString());
      navigate('/music', { state: { success: true } });
    } else {
      navigate('/music', { 
        state: { 
          error: 'No access token received. Please try again.' 
        } 
      });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-accent-600">Connecting to Spotify...</p>
      </div>
    </div>
  );
};

export default SpotifyCallback; 