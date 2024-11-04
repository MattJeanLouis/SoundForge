import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'fr',
    defaultNS: 'common',
    resources: {
      fr: {
        common: {
          // Navigation
          dashboard: 'Tableau de bord',
          studio: 'Studio',
          tracks: 'Morceaux',
          events: 'Événements',
          profile: 'Profil',
          logout: 'Déconnexion',

          // Dashboard
          welcomeBack: 'Bon retour, {{username}} !',
          empireAwaits: 'Votre empire musical vous attend. Découvrez les derniers événements et boostez vos morceaux pour gagner plus de récompenses.',
          visitStudio: 'Visiter le Studio',
          viewEvents: 'Voir les Événements',
          
          // Stats
          portfolioValue: 'Valeur du Portfolio',
          activeTracks: 'Morceaux Actifs',
          eventRewards: 'Récompenses d\'Événements',
          
          // Events
          activeEvents: 'Événements Actifs',
          joinNow: 'Rejoindre',
          noActiveEvents: 'Aucun événement actif en ce moment.',
          
          // Recent Activity
          recentActivity: 'Activité Récente',
          currentValue: 'Valeur actuelle',
          trending: 'Tendance',
          noRecentActivity: 'Aucune activité récente à afficher.',
          
          // Auth
          connectWithSoundCloud: 'Se connecter avec SoundCloud',
          connectToStart: 'Connectez votre compte SoundCloud pour commencer à jouer',
          
          // Loading States
          loading: 'Chargement...',
          loadingGameData: 'Chargement des données du jeu...',
          loadingSoundForge: 'Chargement de SoundForge...',
          
          // Errors
          error: 'Erreur',
          dismiss: 'Fermer',
          errorLoadingGame: 'Erreur lors du chargement des données du jeu',
          soundCloudNotConfigured: 'La configuration de SoundCloud n\'est pas complète. Veuillez contacter l\'administrateur.',
          authenticationError: 'Une erreur s\'est produite lors de l\'authentification. Veuillez réessayer.',
        },
      },
      en: {
        common: {
          // Navigation
          dashboard: 'Dashboard',
          studio: 'Studio',
          tracks: 'Tracks',
          events: 'Events',
          profile: 'Profile',
          logout: 'Logout',

          // Dashboard
          welcomeBack: 'Welcome back, {{username}}!',
          empireAwaits: 'Your music empire awaits. Check out the latest events and boost your tracks to earn more rewards.',
          visitStudio: 'Visit Studio',
          viewEvents: 'View Events',
          
          // Stats
          portfolioValue: 'Portfolio Value',
          activeTracks: 'Active Tracks',
          eventRewards: 'Event Rewards',
          
          // Events
          activeEvents: 'Active Events',
          joinNow: 'Join Now',
          noActiveEvents: 'No active events at the moment.',
          
          // Recent Activity
          recentActivity: 'Recent Activity',
          currentValue: 'Current value',
          trending: 'Trending',
          noRecentActivity: 'No recent activity to display.',
          
          // Auth
          connectWithSoundCloud: 'Connect with SoundCloud',
          connectToStart: 'Connect your SoundCloud account to start playing',
          
          // Loading States
          loading: 'Loading...',
          loadingGameData: 'Loading game data...',
          loadingSoundForge: 'Loading SoundForge...',
          
          // Errors
          error: 'Error',
          dismiss: 'Dismiss',
          errorLoadingGame: 'Error loading game data',
          soundCloudNotConfigured: 'SoundCloud configuration is incomplete. Please contact the administrator.',
          authenticationError: 'An error occurred during authentication. Please try again.',
        },
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
