import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { LucideIcon } from '@/components/ui/lucide-icon';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function SettingsScreen() {
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'icon');
  const cardBg = useThemeColor({ light: '#FFFFFF', dark: '#1F2937' }, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Settings</ThemedText>
        </View>

        {/* App Info Section */}
        <View style={[styles.section, { backgroundColor: cardBg, borderColor }]}>
          <View style={styles.sectionHeader}>
            <LucideIcon name="Info" size={24} color={tintColor} />
            <ThemedText style={styles.sectionTitle}>App Information</ThemedText>
          </View>

          <View style={[styles.settingItem, { borderBottomColor: borderColor }]}>
            <View style={styles.settingLeft}>
              <LucideIcon name="Package" size={20} color={textColor} style={styles.settingIcon} />
              <View>
                <ThemedText style={styles.settingLabel}>Version</ThemedText>
                <ThemedText style={styles.settingDescription}>1.0.0</ThemedText>
              </View>
            </View>
          </View>

          <View style={[styles.settingItem, { borderBottomColor: borderColor }]}>
            <View style={styles.settingLeft}>
              <LucideIcon name="Code" size={20} color={textColor} style={styles.settingIcon} />
              <View>
                <ThemedText style={styles.settingLabel}>Build</ThemedText>
                <ThemedText style={styles.settingDescription}>TTS App v1.0</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <LucideIcon name="Palette" size={20} color={textColor} style={styles.settingIcon} />
              <View>
                <ThemedText style={styles.settingLabel}>Theme</ThemedText>
                <ThemedText style={styles.settingDescription}>Light Mode (Fixed)</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={[styles.section, { backgroundColor: cardBg, borderColor }]}>
          <View style={styles.sectionHeader}>
            <LucideIcon name="Heart" size={24} color={tintColor} />
            <ThemedText style={styles.sectionTitle}>About</ThemedText>
          </View>

          <View style={[styles.settingItem, { borderBottomColor: borderColor }]}>
            <View style={styles.settingLeft}>
              <LucideIcon name="MessageCircle" size={20} color={textColor} style={styles.settingIcon} />
              <View>
                <ThemedText style={styles.settingLabel}>TTS App</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Text-to-Speech with customizable pitch and speed
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <LucideIcon name="Smartphone" size={20} color={textColor} style={styles.settingIcon} />
              <View>
                <ThemedText style={styles.settingLabel}>Platform</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Works on Web, iOS, and Android
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingIcon: {
    marginRight: 4,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    opacity: 0.6,
  },
});
