import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorAlert from './ErrorAlert';

const MusicServiceLoginButton: React.FC = () => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [service, setService] = useState<string>('spotify');

  const handleLogin = async () => {
    try {
      const response = await fetch(`http://localhost:4000/auth/${service}/auth-url`);
      const data = await response.json();
      
      if (data.error) {
        setError(t('serviceNotConfigured', { service }));
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      setError(t('authenticationError'));
      console.error('Authentication error:', err);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <ErrorAlert 
          message={error} 
          onClose={() => setError(null)}
        />
      )}
      <select
        value={service}
        onChange={(e) => setService(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="spotify">{t('spotify')}</option>
        <option value="soundcloud">{t('soundCloud')}</option>
        <option value="deezer">{t('deezer')}</option>
        <option value="applemusic">{t('appleMusic')}</option>
        <option value="youtubemusic">{t('youtubeMusic')}</option>
      </select>
      <button
        onClick={handleLogin}
        className="inline-flex items-center rounded-md bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover-lift hover-glow click-scale sparkle"
      >
        <svg
          className="mr-3 h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M11.4 0C5.1 0 0 5.1 0 11.4c0 6.3 5.1 11.4 11.4 11.4c6.3 0 11.4-5.1 11.4-11.4C22.8 5.1 17.7 0 11.4 0zM11.4 21.4C5.9 21.4 1.4 16.9 1.4 11.4C1.4 5.9 5.9 1.4 11.4 1.4c5.5 0 10 4.5 10 10C21.4 16.9 16.9 21.4 11.4 21.4zM8.4 16.4L8.4 8.3L16.4 12.4L8.4 16.4z" />
        </svg>
        {t('connectWithService', { service: t(service) })}
      </button>
    </div>
  );
};

export default MusicServiceLoginButton;
