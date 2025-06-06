import { useState, useEffect } from 'react';
import { spotifyService } from '../services/spotify';

declare global {
  interface Window {
    Spotify: any;
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

export const useSpotifyPlayer = () => {
  const [player, setPlayer] = useState<any>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'AfterHeart Web Player',
        getOAuthToken: (cb: (token: string) => void) => {
          const token = localStorage.getItem('spotify_token');
          if (token) cb(token);
        },
        volume: 0.5
      });

      player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
      });

      player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('player_state_changed', (state: any) => {
        if (!state) return;

        setCurrentTrack(state.track_window.current_track);
        setIsPaused(state.paused);
      });

      player.connect();
      setPlayer(player);
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, []);

  const togglePlay = async () => {
    if (!player) return;
    await player.togglePlay();
  };

  const playTrack = async (uri: string) => {
    if (!deviceId) return;

    try {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [uri] }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('spotify_token')}`
        },
      });
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  return {
    player,
    deviceId,
    currentTrack,
    isPaused,
    togglePlay,
    playTrack
  };
}; 