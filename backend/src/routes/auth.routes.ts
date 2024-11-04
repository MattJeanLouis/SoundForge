import { Router } from 'express';
import { soundcloudService } from '../services/soundcloudService';
import { spotifyService } from '../services/spotifyService';

const router = Router();

type MusicServiceKey = 'soundcloud' | 'spotify';

const services: Record<MusicServiceKey, any> = {
  soundcloud: soundcloudService,
  spotify: spotifyService,
  // Add other services here as needed
};

router.get('/:service/auth-url', (req, res) => {
  const { service } = req.params;
  const selectedService = services[service as MusicServiceKey];

  if (!selectedService) {
    return res.status(400).json({ error: 'Invalid music service' });
  }

  try {
    const authUrl = selectedService.getAuthUrl();
    res.json({ url: authUrl });
  } catch (error) {
    console.error(`Error generating auth URL for ${service}:`, error);
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
});

router.get('/:service/callback', async (req, res) => {
  const { service } = req.params;
  const selectedService = services[service as MusicServiceKey];

  if (!selectedService) {
    return res.status(400).json({ error: 'Invalid music service' });
  }

  try {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ 
        error: 'Authorization code is required',
        details: 'No authorization code was provided in the callback'
      });
    }

    try {
      const token = await selectedService.authenticateUser(code);
      // Redirect to frontend with token
      res.redirect(`http://localhost:3000/dashboard?token=${encodeURIComponent(JSON.stringify(token))}`);
    } catch (err) {
      const error = err as Error;
      console.error(`Authentication error for ${service}:`, error);
      res.redirect(`http://localhost:3000/dashboard?error=${encodeURIComponent(error.message)}`);
    }
  } catch (err) {
    const error = err as Error;
    console.error(`Error in auth callback for ${service}:`, error);
    res.redirect(`http://localhost:3000/dashboard?error=${encodeURIComponent('server_error')}`);
  }
});

export default router;
