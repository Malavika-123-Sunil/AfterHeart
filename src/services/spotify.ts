import axios from 'axios';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  duration_ms: number;
  uri: string;
  album: {
    name: string;
    images: { url: string }[];
  };
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  tracks: {
    total: number;
    items: { track: SpotifyTrack }[];
  };
}

class SpotifyService {
  private accessToken: string | null = null;

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    return response.json();
  }

  async searchTracks(query: string): Promise<SpotifyTrack[]> {
    const response = await this.request(
      `/search?type=track&q=${encodeURIComponent(query)}`
    );
    return response.tracks.items;
  }

  async createPlaylist(userId: string, name: string, description: string): Promise<SpotifyPlaylist> {
    const response = await this.request(`/users/${userId}/playlists`, {
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        public: false,
      }),
    });
    return response;
  }

  async addTracksToPlaylist(playlistId: string, trackUris: string[]): Promise<void> {
    await this.request(`/playlists/${playlistId}/tracks`, {
      method: 'POST',
      body: JSON.stringify({
        uris: trackUris,
      }),
    });
  }

  async getUserPlaylists(): Promise<SpotifyPlaylist[]> {
    const response = await this.request('/me/playlists');
    return response.items;
  }

  async getPlaylistTracks(playlistId: string): Promise<SpotifyTrack[]> {
    const response = await this.request(`/playlists/${playlistId}/tracks`);
    return response.items.map((item: any) => item.track);
  }
}

export const spotifyService = new SpotifyService(); 