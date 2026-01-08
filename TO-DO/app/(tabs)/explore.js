import { audioManager } from '@/services/audioManager';
import { ttsService } from '@/services/ttsService';
import { useFocusEffect } from '@react-navigation/native';
import { Music, Pause, Play } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
    Alert,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AudioLibraryScreen() {
  const insets = useSafeAreaInsets();
  const [audioFiles, setAudioFiles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [currentPlaying, setCurrentPlaying] = useState(null);

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
    } catch (error) {
      console.error('Error loading audio files:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAudioFiles();
    setRefreshing(false);
  };

  const handlePlay = async (audioFile) => {
    try {
      if (playingId === audioFile.id) {
        await ttsService.stop();
        setPlayingId(null);
        setCurrentPlaying(null);
      } else {
        await ttsService.stop();
        setPlayingId(audioFile.id);
        setCurrentPlaying(audioFile);

        const language =
          audioFile.language ?? audioFile.settings?.language ?? 'en_us_f';
        const voice =
          audioFile.voiceType ?? audioFile.voice ?? audioFile.settings?.voice ?? 'female';
        const pitch =
          audioFile.pitch ?? audioFile.settings?.pitch ?? 1.0;
        const speed =
          audioFile.speed ?? audioFile.settings?.speed ?? 1.0;

        await ttsService.speak({
          text: audioFile.text,
          language,
          voice,
          pitch,
          speed,
        });
        setPlayingId(null);
        setCurrentPlaying(null);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingId(null);
      setCurrentPlaying(null);
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

  const formatDuration = (text) => {
    const words = text?.trim().split(/\s+/).length || 0;
    const seconds = Math.ceil((words / 150) * 60);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderItem = ({ item }) => {
    const isCurrentPlaying = playingId === item.id;

    return (
      <Pressable 
        style={styles.listItem}
        onPress={() => handlePlay(item)}
        onLongPress={() => handleDelete(item)}
      >
        <View style={styles.itemLeft}>
          <View style={[styles.playIcon, isCurrentPlaying && styles.playIconActive]}>
            {isCurrentPlaying ? (
              <Pause size={16} color="#FFFFFF" fill="#FFFFFF" />
            ) : (
              <Play size={16} color="#6B7280" fill="#6B7280" />
            )}
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.itemSubtitle} numberOfLines={1}>
              {item.text}
            </Text>
          </View>
        </View>
        <Text style={styles.itemDuration}>{formatDuration(item.text)}</Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Library</Text>
      </View>

      {/* List */}
      <FlatList
        data={audioFiles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          audioFiles.length === 0 && styles.emptyList,
        ]}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#2563EB"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Music size={32} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyTitle}>No saved audio</Text>
            <Text style={styles.emptyText}>
              Save text from the TTS screen to build your library
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Now Playing Bar */}
      {currentPlaying && (
        <View style={[styles.nowPlayingBar, { paddingBottom: insets.bottom + 70 }]}>
          <View style={styles.nowPlayingContent}>
            <View style={styles.nowPlayingInfo}>
              <Text style={styles.nowPlayingLabel}>NOW PLAYING</Text>
              <Text style={styles.nowPlayingTitle} numberOfLines={1}>
                {currentPlaying.name}
              </Text>
            </View>
            <Pressable 
              style={styles.nowPlayingButton}
              onPress={() => handlePlay(currentPlaying)}
            >
              <Pause size={16} color="#1F2937" />
            </Pressable>
          </View>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'SF-Pro-Bold',
    color: '#1F2937',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  emptyList: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  playIconActive: {
    backgroundColor: '#2563EB',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Medium',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    fontFamily: 'SF-Pro-Regular',
    color: '#9CA3AF',
  },
  itemDuration: {
    fontSize: 14,
    fontFamily: 'SF-Pro-Regular',
    color: '#6B7280',
    marginLeft: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'SF-Pro-Medium',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'SF-Pro-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  nowPlayingBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1F2937',
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  nowPlayingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  nowPlayingInfo: {
    flex: 1,
  },
  nowPlayingLabel: {
    fontSize: 10,
    fontFamily: 'SF-Pro-Medium',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 4,
  },
  nowPlayingTitle: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Medium',
    color: '#FFFFFF',
  },
  nowPlayingButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#374151',
    borderRadius: 2,
  },
  progressFill: {
    width: '35%',
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
});
