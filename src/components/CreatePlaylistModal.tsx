import React, { useState } from 'react';
import { X } from 'lucide-react';
import { spotifyService } from '../services/spotify';
import { musicFirebaseService } from '../services/musicFirebase';
import { useAuth } from '../contexts/AuthContext';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaylistCreated: () => void;
}

const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
  onPlaylistCreated,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsLoading(true);
    try {
      // Create playlist in Spotify
      const spotifyPlaylist = await spotifyService.createPlaylist(
        currentUser.id,
        name,
        description
      );

      // Store playlist in Firebase
      await musicFirebaseService.createPlaylist(currentUser.id, {
        name,
        description,
        spotifyId: spotifyPlaylist.id,
        imageUrl: spotifyPlaylist.images[0]?.url || '',
      });

      onPlaylistCreated();
      onClose();
    } catch (error) {
      console.error('Error creating playlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-display font-semibold text-primary-800">
            Create New Playlist
          </h2>
          <button
            onClick={onClose}
            className="text-accent-500 hover:text-accent-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-accent-700 mb-1"
              >
                Playlist Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input w-full"
                placeholder="Enter playlist name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-accent-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input w-full h-24"
                placeholder="Enter playlist description"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Playlist'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylistModal; 