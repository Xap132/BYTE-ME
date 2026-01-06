import React, { useState, useCallback } from 'react';
import { StyleSheet, FlatList, RefreshControl, Alert, TextInput, View, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { AudioListItem } from '@/components/audio/AudioListItem';
import { AudioPlayerControls } from '@/components/audio/AudioPlayerControls';
import { EmptyState } from '@/components/audio/EmptyState';
import { LucideIcon } from '@/components/ui/lucide-icon';
import { audioManager } from '@/services/audioManager';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useFocusEffect } from '@react-navigation/native';

export default function AudioLibraryScreen() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackInterval, setPlaybackInterval] = useState(null);

  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'icon');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({ light: '#9CA3AF', dark: '#6B7280' }, 'icon');

  useFocusEffect(
    useCallback(() => {
      loadAudioFiles();
      return () => {
        if (playbackInterval) {
          clearInterval(playbackInterval);
        }
      };
    }, [playbackInterval])
  );

  const updatePlaybackStatus = async () => {
    const status = await audioManager.getPlaybackStatus();
    if (status && status.isLoaded) {
      setCurrentTime(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
      
      if (status.didJustFinish) {
        setPlayingId(null);
        setIsPlaying(false);
        if (playbackInterval) {
          clearInterval(playbackInterval);
          setPlaybackInterval(null);
        }
      }
    }
  };

  const startPlaybackStatusInterval = () => {
    if (playbackInterval) {
      clearInterval(playbackInterval);
    }
    const interval = setInterval(updatePlaybackStatus, 500);
    setPlaybackInterval(interval);
  };

  const loadAudioFiles = async () => {
    try {
      console.log('Loading audio files...');
      const files = await audioManager.getAllAudioFiles();
      console.log('Loaded audio files:', files);
      const sortedFiles = files.sort((a, b) => b.dateCreated - a.dateCreated);
      setAudioFiles(sortedFiles);
      setFilteredFiles(sortedFiles);
      console.log('Audio files state updated:', sortedFiles.length, 'files');
    } catch (error) {
      console.error('Error loading audio files:', error);
      Alert.alert('Error', 'Failed to load audio files');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAudioFiles();
    setRefreshing(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredFiles(audioFiles);
    } else {
      const filtered = audioFiles.filter(
        (file) =>
          file.name.toLowerCase().includes(query.toLowerCase()) ||
          file.text?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredFiles(filtered);
    }
  };

  const handlePlay = async (audioFile) => {
    try {
      if (playingId === audioFile.id) {
        // Stop if same file is playing
        await audioManager.stopAudio();
        setPlayingId(null);
        setIsPlaying(false);
        if (playbackInterval) {
          clearInterval(playbackInterval);
          setPlaybackInterval(null);
        }
      } else {
        // Play new audio using TTS replay
        await audioManager.playAudio(audioFile.uri, audioFile);
        setPlayingId(audioFile.id);
        setIsPlaying(true);
        // Note: TTS doesn't support position tracking, so no interval needed
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Error', 'Failed to play audio');
    }
  };

  const handlePause = async () => {
    try {
      await audioManager.pauseAudio();
      setIsPlaying(false);
      if (playbackInterval) {
        clearInterval(playbackInterval);
        setPlaybackInterval(null);
      }
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  };

  const handleResume = async () => {
    try {
      await audioManager.resumeAudio();
      setIsPlaying(true);
      startPlaybackStatusInterval();
    } catch (error) {
      console.error('Error resuming audio:', error);
    }
  };

  const handleStop = async () => {
    try {
      await audioManager.stopAudio();
      setPlayingId(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      if (playbackInterval) {
        clearInterval(playbackInterval);
        setPlaybackInterval(null);
      }
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  const handleSkipForward = async () => {
    try {
      await audioManager.skipForward(10000);
      await updatePlaybackStatus();
    } catch (error) {
      console.error('Error skipping forward:', error);
    }
  };

  const handleSkipBackward = async () => {
    try {
      await audioManager.skipBackward(10000);
      await updatePlaybackStatus();
    } catch (error) {
      console.error('Error skipping backward:', error);
    }
  };

  const handleDelete = async (audioFile) => {
    try {
      await audioManager.deleteAudioFile(audioFile);
      await loadAudioFiles();
      Alert.alert('Success', 'Audio file deleted');
    } catch (error) {
      console.error('Error deleting audio:', error);
      Alert.alert('Error', 'Failed to delete audio file');
    }
  };

  const handleEdit = async (audioFile) => {
    Alert.alert('Edit', 'Edit functionality coming soon!');
  };

  const renderItem = ({ item }) => (
    <AudioListItem
      audioFile={item}
      onPlay={handlePlay}
      onDelete={handleDelete}
      onEdit={handleEdit}
      isPlaying={playingId === item.id}
    />
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Audio Library</ThemedText>
        <ThemedText style={styles.subtitle}>
          {audioFiles.length} {audioFiles.length === 1 ? 'file' : 'files'} saved
        </ThemedText>
      </ThemedView>

      {playingId && (
        <View style={[styles.playerContainer, { borderColor, backgroundColor }]}>
          <AudioPlayerControls
            isPlaying={isPlaying}
            onPlay={handleResume}
            onPause={handlePause}
            onStop={handleStop}
            onSkipForward={handleSkipForward}
            onSkipBackward={handleSkipBackward}
            currentTime={currentTime}
            duration={duration}
          />
        </View>
      )}

      {audioFiles.length > 0 && (
        <View style={[styles.searchContainer, { borderColor, backgroundColor }]}>
          <LucideIcon name="Search" size={20} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search audio files..."
            placeholderTextColor={placeholderColor}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <LucideIcon name="X" size={20} />
            </TouchableOpacity>
          )}
        </View>
      )}

      <FlatList
        data={filteredFiles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          filteredFiles.length === 0 && styles.emptyList,
        ]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            title={searchQuery ? 'No results found' : 'No Audio Files'}
            message={
              searchQuery
                ? 'Try a different search term'
                : 'Saved audio files from the TTS screen will appear here'
            }
            iconName="FileAudio"
          />
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 12,
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
  playerContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  emptyList: {
    flex: 1,
  },
  separator: {
    height: 12,
  },
});
