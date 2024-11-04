declare module 'soundcloud-api' {
  interface SoundCloudOptions {
    client_id: string;
    client_secret: string;
    redirect_uri: string;
  }

  interface SoundCloud {
    new (options: SoundCloudOptions): SoundCloud;
    get(endpoint: string): Promise<any>;
    exchangeToken(code: string): Promise<any>;
  }

  const SoundCloud: {
    new (options: SoundCloudOptions): SoundCloud;
  };

  export default SoundCloud;
}
