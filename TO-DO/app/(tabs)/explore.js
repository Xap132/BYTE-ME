import { audioManager } from '@/services/audioManager';
import { ttsService } from '@/services/ttsService';
import { useFocusEffect } from '@react-navigation/native';
import { Download, MoreVertical, Music, Pause, Play, Square, Trash2 } from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    Pressable,
    RefreshControl,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';

export default function AudioLibraryScreen() {
  const insets = useSafeAreaInsets();
  const [audioFiles, setAudioFiles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showOptions, setShowOptions] = useState(null);
  
  // Progress tracking
  const progressTimerRef = useRef(null);
  const startTimeRef = useRef(0);
  const totalDurationRef = useRef(0);
  const pausedProgressRef = useRef(0);

  useFocusEffect(
    useCallback(() => {
      loadAudioFiles();
      return () => {
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        ttsService.stop();
      };
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

  const calculateDuration = (text, speed = 1.0) => {
    const words = text?.trim().split(/\s+/).length || 0;
    return Math.ceil((words / 150) * 60 * 1000) / speed; // ms
  };

  const startProgressTracking = (audioFile, fromProgress = 0) => {
    const speed = audioFile.speed ?? audioFile.settings?.speed ?? 1.0;
    totalDurationRef.current = calculateDuration(audioFile.text, speed);
    const elapsedTime = fromProgress * totalDurationRef.current;
    startTimeRef.current = Date.now() - elapsedTime;
    
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    
    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min(elapsed / totalDurationRef.current, 1);
      setProgress(newProgress);
      
      if (newProgress >= 1) {
        handlePlaybackFinished();
      }
    }, 100);
  };

  const handlePlaybackFinished = () => {
    stopProgressTracking();
    setPlayingId(null);
    setCurrentPlaying(null);
    setIsPaused(false);
    setProgress(0);
  };

  const stopProgressTracking = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    setProgress(0);
  };

  const handlePlay = async (audioFile) => {
    try {
      // Same item - toggle pause/resume
      if (playingId === audioFile.id) {
        if (isPaused) {
          // Resume
          setIsPaused(false);
          startProgressTracking(audioFile, pausedProgressRef.current);
          await ttsService.resume();
        } else {
          // Pause
          pausedProgressRef.current = progress;
          setIsPaused(true);
          stopProgressTracking();
          await ttsService.pause();
        }
        return;
      }

      // Different item or new play - stop any existing
      if (playingId) {
        await ttsService.stop();
        stopProgressTracking();
      }

      // Start new playback
      setPlayingId(audioFile.id);
      setCurrentPlaying(audioFile);
      setIsPaused(false);
      setProgress(0);
      pausedProgressRef.current = 0;
      
      const language = audioFile.language ?? audioFile.settings?.language ?? 'en_us_f';
      const pitch = audioFile.pitch ?? audioFile.settings?.pitch ?? 1.0;
      const speed = audioFile.speed ?? audioFile.settings?.speed ?? 1.0;

      // Start tracking first
      startProgressTracking(audioFile, 0);

      await ttsService.speak({
        text: audioFile.text,
        language,
        pitch,
        speed,
      });
      
      // Finished naturally
      handlePlaybackFinished();
    } catch (error) {
      console.error('Error playing audio:', error);
      handlePlaybackFinished();
    }
  };

  const handleStop = async () => {
    await ttsService.stop();
    handlePlaybackFinished();
  };

  const handleSliderChange = (value) => {
    // For now, just update the visual progress
    // True seeking would require tracking word positions
    setProgress(value);
  };

  const handleDelete = (audioFile) => {
    setShowOptions(null);
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
              if (playingId === audioFile.id) {
                await handleStop();
              }
              await audioManager.deleteAudioFile(audioFile);
              await loadAudioFiles();
            } catch (_error) {
              Alert.alert('Error', 'Failed to delete');
            }
          },
        },
      ]
    );
  };

  const handleSaveToDevice = async (audioFile) => {
    setShowOptions(null);
    try {
      // Share the content using native Share dialog
      const content = `Title: ${audioFile.name}\n\nText:\n${audioFile.text}\n\nSettings:\n- Language: ${audioFile.language || audioFile.settings?.language || 'en_us_f'}\n- Pitch: ${audioFile.pitch || audioFile.settings?.pitch || 1.0}\n- Speed: ${audioFile.speed || audioFile.settings?.speed || 1.0}`;
      
      await Share.share({
        title: audioFile.name,
        message: content,
      });
    } catch (error) {
      if (error.message !== 'User did not share') {
        console.error('Error sharing:', error);
        Alert.alert('Error', 'Failed to share content');
      }
    }
  };

  const formatDuration = (text, speed = 1.0) => {
    const ms = calculateDuration(text, speed);
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (progressValue, totalMs) => {
    const currentMs = progressValue * totalMs;
    const seconds = Math.floor(currentMs / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderItem = ({ item }) => {
    const isCurrentPlaying = playingId === item.id;
    const speed = item.speed ?? item.settings?.speed ?? 1.0;

    return (
      <View style={styles.listItemContainer}>
        <Pressable 
          style={styles.listItem}
          onPress={() => handlePlay(item)}
        >
          <View style={styles.itemLeft}>
            <View style={[styles.playIcon, isCurrentPlaying && styles.playIconActive]}>
              {isCurrentPlaying && !isPaused ? (
                <Pause size={16} color="#FFFFFF" fill="#FFFFFF" />
              ) : (
                <Play size={16} color={isCurrentPlaying ? "#FFFFFF" : "#6B7280"} fill={isCurrentPlaying ? "#FFFFFF" : "#6B7280"} />
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
          <View style={styles.itemRight}>
            <Text style={styles.itemDuration}>{formatDuration(item.text, speed)}</Text>
            <TouchableOpacity 
              style={styles.moreButton}
              onPress={() => setShowOptions(item)}
            >
              <MoreVertical size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </Pressable>
      </View>
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

      {/* Now Playing Bar with Slider */}
      {currentPlaying && (
        <View style={[styles.nowPlayingBar, { paddingBottom: insets.bottom + 70 }]}>
          <View style={styles.nowPlayingHeader}>
            <View style={styles.nowPlayingInfo}>
              <Text style={styles.nowPlayingLabel}>NOW PLAYING</Text>
              <Text style={styles.nowPlayingTitle} numberOfLines={1}>
                {currentPlaying.name}
              </Text>
            </View>
            <View style={styles.controlButtons}>
              <Pressable 
                style={styles.nowPlayingButton}
                onPress={() => handlePlay(currentPlaying)}
              >
                {isPaused ? (
                  <Play size={20} color="#1F2937" fill="#1F2937" />
                ) : (
                  <Pause size={20} color="#1F2937" fill="#1F2937" />
                )}
              </Pressable>
              <Pressable 
                style={styles.stopButton}
                onPress={handleStop}
              >
                <Square size={16} color="#EF4444" fill="#EF4444" />
              </Pressable>
            </View>
          </View>
          
          {/* Progress Slider */}
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.progressSlider}
              minimumValue={0}
              maximumValue={1}
              value={progress}
              onValueChange={handleSliderChange}
              minimumTrackTintColor="#2563EB"
              maximumTrackTintColor="#374151"
              thumbTintColor="#FFFFFF"
            />
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>
                {formatTime(progress, calculateDuration(currentPlaying.text, currentPlaying.speed ?? 1.0))}
              </Text>
              <Text style={styles.timeText}>
                {formatDuration(currentPlaying.text, currentPlaying.speed ?? 1.0)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Options Modal */}
      <Modal
        visible={showOptions !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptions(null)}
      >
        <Pressable 
          style={styles.optionsOverlay}
          onPress={() => setShowOptions(null)}
        >
          <View style={styles.optionsContent}>
            <Text style={styles.optionsTitle}>{showOptions?.name}</Text>
            
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => handleSaveToDevice(showOptions)}
            >
              <Download size={20} color="#1F2937" />
              <Text style={styles.optionText}>Save to Device</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.optionItem, styles.optionItemDanger]}
              onPress={() => handleDelete(showOptions)}
            >
              <Trash2 size={20} color="#DC2626" />
              <Text style={[styles.optionText, styles.optionTextDanger]}>Delete</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.optionCancel}
              onPress={() => setShowOptions(null)}
            >
              <Text style={styles.optionCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
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
    paddingBottom: 200,
  },
  emptyList: {
    flex: 1,
  },
  listItemContainer: {
    backgroundColor: '#FFFFFF',
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
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDuration: {
    fontSize: 14,
    fontFamily: 'SF-Pro-Regular',
    color: '#6B7280',
  },
  moreButton: {
    padding: 8,
    marginLeft: 4,
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
  // Now Playing Bar
  nowPlayingBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1F2937',
    paddingTop: 16,
    paddingHorizontal: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  nowPlayingHeader: {
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
  controlButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nowPlayingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Slider
  sliderContainer: {
    marginBottom: 8,
  },
  progressSlider: {
    width: '100%',
    height: 40,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'SF-Pro-Regular',
    color: '#9CA3AF',
  },
  // Options Modal
  optionsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  optionsContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  optionsTitle: {
    fontSize: 18,
    fontFamily: 'SF-Pro-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  optionItemDanger: {
    backgroundColor: '#FEE2E2',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Medium',
    color: '#1F2937',
  },
  optionTextDanger: {
    color: '#DC2626',
  },
  optionCancel: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  optionCancelText: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Medium',
    color: '#6B7280',
  },
});
