import axios from 'axios';

interface SoundCloudToken {
  access_token: string;
  expires_in: number;
  scope: string;
  refresh_token?: string;
}

interface SoundCloudTrack {
  id: number;
  title: string;
  permalink_url: string;
  playback_count: number;
  likes_count: number;
  user: {
    id: number;
    username: string;
  };
}

class SoundCloudService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private apiBaseUrl: string = 'https://api.soundcloud.com';
  private authBaseUrl: string = 'https://api.soundcloud.com/oauth2';

  constructor() {
    this.clientId = process.env.SOUNDCLOUD_CLIENT_ID || '';
    this.clientSecret = process.env.SOUNDCLOUD_CLIENT_SECRET || '';
    this.redirectUri = 'http://localhost:4000/auth/callback';

    if (!this.clientId || !this.clientSecret) {
      console.warn('SoundCloud credentials not configured. Some features may be limited.');
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    accessToken?: string,
    params: Record<string, string> = {}
  ): Promise<T> {
    try {
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };

      if (accessToken) {
        headers['Authorization'] = `OAuth ${accessToken}`;
      }

      const response = await axios.get(`${this.apiBaseUrl}${endpoint}`, {
        headers,
        params: {
          ...params,
          client_id: this.clientId,
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error making request to ${endpoint}:`, error);
      throw error;
    }
  }

  async authenticateUser(code: string): Promise<SoundCloudToken> {
    try {
      const response = await axios.post(`${this.authBaseUrl}/token`, {
        grant_type: 'authorization_code',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        code,
      });

      return response.data;
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    }
  }

  async getUserTracks(userId: string, accessToken: string): Promise<SoundCloudTrack[]> {
    return this.makeRequest<SoundCloudTrack[]>(
      `/users/${userId}/tracks`,
      accessToken
    );
  }

  async getTrackStats(trackId: string, accessToken: string) {
    return this.makeRequest(
      `/tracks/${trackId}`,
      accessToken
    );
  }

  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'non-expiring',
    });

    return `${this.authBaseUrl}/authorize?${params.toString()}`;
  }
}

export const soundcloudService = new SoundCloudService();

export const {
  authenticateUser,
  getUserTracks,
  getTrackStats,
  getAuthUrl,
} = soundcloudService;
