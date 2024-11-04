import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowTrendingUpIcon, MusicalNoteIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useGameStore } from '../store/gameStore';
import SoundCloudLoginButton from '../components/SoundCloudLoginButton';
import ErrorAlert from '../components/ErrorAlert';

// Rest of the file remains the same...
