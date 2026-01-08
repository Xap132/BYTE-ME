import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Settings</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* App Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📱 App Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Platform</Text>
            <Text style={styles.infoValue}>{Platform.OS}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Theme</Text>
            <Text style={styles.infoValue}>Light</Text>
          </View>
        </View>

        {/* Features */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>✨ Features</Text>
          
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎙️</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Text to Speech</Text>
              <Text style={styles.featureDesc}>Convert text to natural speech</Text>
            </View>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🌐</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Multiple Languages</Text>
              <Text style={styles.featureDesc}>English, Filipino, Spanish, French & more</Text>
            </View>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>👨👩</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Voice Selection</Text>
              <Text style={styles.featureDesc}>Male and female voice options</Text>
            </View>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎚️</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Adjustable Controls</Text>
              <Text style={styles.featureDesc}>Speed and pitch customization</Text>
            </View>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>💾</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Save & Replay</Text>
              <Text style={styles.featureDesc}>Save text for later playback</Text>
            </View>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📴</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Offline Support</Text>
              <Text style={styles.featureDesc}>Works without internet connection</Text>
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ℹ️ About</Text>
          <Text style={styles.aboutText}>
            A simple, offline Text-to-Speech app built with React Native and Expo. 
            Works on Web, iOS, and Android devices.
          </Text>
          <Text style={styles.copyright}>© 2026 BYTE-ME Team</Text>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  aboutText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 12,
  },
  copyright: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
});
