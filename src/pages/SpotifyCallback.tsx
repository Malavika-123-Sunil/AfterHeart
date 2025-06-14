import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyService } from '../services/spotify';

const SpotifyCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = () => {
      try {
        console.log('Processing Spotify callback...');
        
        // First, check for error parameter in the URL query string
        const queryParams = new URLSearchParams(window.location.search);
        const queryError = queryParams.get('error');
        
        if (queryError) {
          console.error('Spotify auth query error:', queryError);
          navigate('/music', { 
            state: { 
              error: 'Authentication failed',
              details: queryError
            } 
          });
          return;
        }

        // Then check the URL hash for the access token
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const error = hashParams.get('error');
        const state = hashParams.get('state');
        const storedState = localStorage.getItem('spotify_auth_state');

        console.log('Callback parameters:', {
          hasAccessToken: !!accessToken,
          hasError: !!error,
          hasState: !!state,
          hasStoredState: !!storedState,
          stateMatch: state === storedState
        });

        // Clear the stored state
        localStorage.removeItem('spotify_auth_state');

        // Verify state to prevent CSRF attacks
        if (!state || state !== storedState) {
          console.error('State mismatch:', { state, storedState });
          navigate('/music', { 
            state: { 
              error: 'Security verification failed',
              details: 'Please try logging in again'
            } 
          });
          return;
        }

    if (error) {
          console.error('Spotify auth hash error:', error);
      navigate('/music', { 
        state: { 
              error: 'Authentication failed',
          details: error
        } 
      });
      return;
    }

        if (!accessToken) {
          console.error('No access token received');
          navigate('/music', { 
            state: { 
              error: 'Authentication incomplete',
              details: 'No access token received. Please try again.'
            } 
          });
          return;
        }

        // Successfully received access token
        console.log('Authentication successful, storing token...');
      spotifyService.setAccessToken(accessToken);
      localStorage.setItem('spotify_token', accessToken);
      localStorage.setItem('spotify_token_timestamp', Date.now().toString());
      navigate('/music', { state: { success: true } });

      } catch (err) {
        console.error('Callback handling error:', err);
      navigate('/music', { 
        state: { 
            error: 'Authentication error',
            details: 'An unexpected error occurred. Please try again.'
        } 
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