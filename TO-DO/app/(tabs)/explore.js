import { getLanguage } from '@/constants/voices';
import { audioManager } from '@/services/audioManager';
import { ttsService } from '@/services/ttsService';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function AudioLibraryScreen() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadAudioFiles();
    }, [])
  );

  const loadAudioFiles = async () => {
    try {
      const files = await audioManager.getAllAudioFiles();
      const sortedFiles = files.sort((a, b) => b.dateCreated - a.dateCreated);
      setAudioFiles(sortedFiles);
      setFilteredFiles(sortedFiles);
    } catch (error) {
      console.error('Error loading audio files:', error);
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
        await ttsService.stop();
        setPlayingId(null);
      } else {
        await ttsService.stop();
        setPlayingId(audioFile.id);
        await ttsService.speak({
          text: audioFile.text,
          language: audioFile.settings?.language || 'en',
          voice: audioFile.settings?.voice || 'female',
          pitch: audioFile.settings?.pitch || 1.0,
          speed: audioFile.settings?.speed || 1.0,
        });
        setPlayingId(null);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingId(null);
    }
  };

  const handleDelete = (audioFile) => {
    Alert.alert(
      'Delete',
      `Delete "${audioFile.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await audioManager.deleteAudioFile(audioFile);
              await loadAudioFiles();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete');
            }
          },
        },
      ]
    );
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderItem = ({ item }) => {
    const lang = getLanguage(item.settings?.language);
    const isCurrentPlaying = playingId === item.id;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <Pressable
            style={styles.deleteBtn}
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.deleteBtnText}>🗑️</Text>
          </Pressable>
        </View>

        <Text style={styles.cardText} numberOfLines={2}>
          {item.text}
        </Text>

        <View style={styles.cardMeta}>
          <Text style={styles.metaText}>
            {lang?.flag} {lang?.name}
          </Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>
            {item.settings?.voice === 'male' ? '👨' : '👩'} {item.settings?.voice}
          </Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>{formatDate(item.dateCreated)}</Text>
        </View>

        <Pressable
          style={[styles.playBtn, isCurrentPlaying && styles.stopBtn]}
          onPress={() => handlePlay(item)}
        >
          <Text style={styles.playBtnText}>
            {isCurrentPlaying ? '⏹️ Stop' : '▶️ Play'}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📚 Library</Text>
        <Text style={styles.subtitle}>
          {audioFiles.length} saved {audioFiles.length === 1 ? 'item' : 'items'}
        </Text>
      </View>

      {/* Search */}
      {audioFiles.length > 0 && (
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search..."
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => handleSearch('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* List */}
      <FlatList
        data={filteredFiles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          filteredFiles.length === 0 && styles.emptyList,
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No results' : 'No saved items'}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'Try a different search'
                : 'Save text from the TTS screen to see it here'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#6366F1',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#C7D2FE',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  clearBtn: {
    fontSize: 18,
    color: '#9CA3AF',
    paddingLeft: 10,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyList: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  deleteBtn: {
    padding: 4,
  },
  deleteBtnText: {
    fontSize: 18,
  },
  cardText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  metaDot: {
    fontSize: 12,
    color: '#D1D5DB',
    marginHorizontal: 8,
  },
  playBtn: {
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  stopBtn: {
    backgroundColor: '#EF4444',
  },
  playBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
