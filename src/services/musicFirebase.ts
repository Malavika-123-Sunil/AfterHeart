import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { SpotifyTrack, SpotifyPlaylist } from './spotify';

interface UserPlaylist {
  id: string;
  name: string;
  description: string;
  spotifyId: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  trackCount: number;
}

interface LikedSong {
  id: string;
  spotifyTrackId: string;
  name: string;
  artist: string;
  imageUrl: string;
  addedAt: Date;
}

class MusicFirebaseService {
  // Playlists
  async createPlaylist(userId: string, playlist: Partial<UserPlaylist>): Promise<string> {
    const playlistRef = doc(collection(db, 'users', userId, 'playlists'));
    const playlistData = {
      ...playlist,
      id: playlistRef.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      trackCount: 0,
    };
    await setDoc(playlistRef, playlistData);
    return playlistRef.id;
  }

  async getUserPlaylists(userId: string): Promise<UserPlaylist[]> {
    const playlistsRef = collection(db, 'users', userId, 'playlists');
    const snapshot = await getDocs(playlistsRef);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    } as UserPlaylist));
  }

  async updatePlaylist(userId: string, playlistId: string, updates: Partial<UserPlaylist>): Promise<void> {
    const playlistRef = doc(db, 'users', userId, 'playlists', playlistId);
    await updateDoc(playlistRef, {
      ...updates,
      updatedAt: new Date(),
    });
  }

  async deletePlaylist(userId: string, playlistId: string): Promise<void> {
    await deleteDoc(doc(db, 'users', userId, 'playlists', playlistId));
  }

  // Liked Songs
  async toggleLikedSong(userId: string, track: SpotifyTrack): Promise<boolean> {
    const likedSongsRef = doc(db, 'users', userId, 'likedSongs', track.id);
    const songDoc = await getDoc(likedSongsRef);

    if (songDoc.exists()) {
      await deleteDoc(likedSongsRef);
      return false;
    } else {
      const likedSong: LikedSong = {
        id: track.id,
        spotifyTrackId: track.id,
        name: track.name,
        artist: track.artists[0].name,
        imageUrl: track.album.images[0]?.url || '',
        addedAt: new Date(),
      };
      await setDoc(likedSongsRef, likedSong);
      return true;
    }
  }

  async getLikedSongs(userId: string): Promise<LikedSong[]> {
    const likedSongsRef = collection(db, 'users', userId, 'likedSongs');
    const snapshot = await getDocs(likedSongsRef);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      addedAt: doc.data().addedAt.toDate(),
    } as LikedSong));
  }

  async isTrackLiked(userId: string, trackId: string): Promise<boolean> {
    const songDoc = await getDoc(doc(db, 'users', userId, 'likedSongs', trackId));
    return songDoc.exists();
  }

  // Recently Played
  async addRecentlyPlayed(userId: string, track: SpotifyTrack): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      recentlyPlayed: arrayUnion({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        playedAt: new Date(),
      }),
    });
  }

  async getRecentlyPlayed(userId: string): Promise<any[]> {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.data()?.recentlyPlayed || [];
  }
}

export const musicFirebaseService = new MusicFirebaseService(); 