import axios from 'axios';

interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

interface SpotifyTrack {
  id: string;
  name: string;
  external_urls: {
    spotify: string;
  };
  popularity: number;
  artists: {
    id: string;
    name: string;
  }[];
}

class SpotifyService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private apiBaseUrl: string = 'https://api.spotify.com/v1';
  private authBaseUrl: string = 'https://accounts.spotify.com/api/token';

  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID || '';
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';
    this.redirectUri = 'http://localhost:4000/auth/callback';

    if (!this.clientId || !this.clientSecret) {
      console.warn('Spotify credentials not configured. Some features may be limited.');
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    accessToken: string,
    params: Record<string, string> = {}
  ): Promise<T> {
    try {
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      };

      const response = await axios.get(`${this.apiBaseUrl}${endpoint}`, {
        headers,
        params,
      });

      return response.data;
    } catch (error) {
      console.error(`Error making request to ${endpoint}:`, error);
      throw error;
    }
  }

  async authenticateUser(code: string): Promise<SpotifyToken> {
    try {
      const response = await axios.post(this.authBaseUrl, null, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64'),
        },
        params: {
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.redirectUri,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    }
  }

  async getUserTracks(accessToken: string): Promise<SpotifyTrack[]> {
    return this.makeRequest<SpotifyTrack[]>('/me/tracks', accessToken);
  }

  async getTrackStats(trackId: string, accessToken: string) {
    return this.makeRequest(`/tracks/${trackId}`, accessToken);
  }

  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: 'user-library-read',
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }
}

export const spotifyService = new SpotifyService();

export const {
  authenticateUser,
  getUserTracks,
  getTrackStats,
  getAuthUrl,
} = spotifyService;
