import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useSpotifyPlayer } from '../hooks/useSpotifyPlayer';

interface MusicPlayerProps {
  track?: {
    name: string;
    artists: { name: string }[];
    album: {
      images: { url: string }[];
    };
  };
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ track }) => {
  const { isPaused, togglePlay, currentTrack } = useSpotifyPlayer();
  const displayTrack = track || currentTrack;

  if (!displayTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-accent-100 p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center flex-1">
          <img
            src={displayTrack.album.images[0]?.url}
            alt={displayTrack.name}
            className="w-12 h-12 rounded-md shadow-sm"
          />
          <div className="ml-4">
            <h4 className="font-medium text-primary-800">{displayTrack.name}</h4>
            <p className="text-sm text-accent-600">
              {displayTrack.artists.map(a => a.name).join(', ')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 flex-1 justify-center">
          <button className="text-accent-500 hover:text-primary-600 transition-colors">
            <SkipBack size={24} />
          </button>
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center transition-colors"
          >
            {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} />}
          </button>
          <button className="text-accent-500 hover:text-primary-600 transition-colors">
            <SkipForward size={24} />
          </button>
        </div>

        <div className="flex items-center space-x-4 flex-1 justify-end">
          <button className="text-accent-500 hover:text-primary-600 transition-colors">
            <Volume2 size={20} />
          </button>
          <div className="w-24 h-1 bg-accent-100 rounded-full">
            <div className="w-1/2 h-full bg-primary-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer; 