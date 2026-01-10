import { Tabs } from 'expo-router';
import { Library, Mic, Settings } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';

// Get screen dimensions for responsive sizing
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Calculate responsive tab bar height based on screen size
const getTabBarHeight = (screenHeight) => {
  if (screenHeight < 700) return 50; // Small phones like Samsung A21s
  if (screenHeight < 800) return 54;
  return 58; // Larger phones
};

// Export tab bar height for other components to use
export const TAB_BAR_HEIGHT = getTabBarHeight(SCREEN_HEIGHT);

function TabIcon({ Icon, focused, label, theme }) {
  const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0.9)).current;
  const opacityAnim = useRef(new Animated.Value(focused ? 1 : 0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? 1 : 0.9,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: focused ? 1 : 0.5,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  // Responsive icon size based on screen height
  const iconSize = SCREEN_HEIGHT < 700 ? 20 : 22;
  const fontSize = SCREEN_HEIGHT < 700 ? 9 : 10;

  return (
    <Animated.View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
        minWidth: 60,
        paddingVertical: 4,
      }}
    >
      <Icon
        size={iconSize}
        color={focused ? theme.orangeBtn : theme.icon}
        strokeWidth={focused ? 2.5 : 2}
      />
      <Animated.Text
        style={{
          color: focused ? theme.orangeBtn : theme.textSecondary,
          fontSize: fontSize,
          marginTop: 2,
          fontFamily: focused ? 'SF-Pro-Bold' : 'SF-Pro-Medium',
        }}
      >
        {label}
      </Animated.Text>
    </Animated.View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  
  // Calculate actual tab bar height - use minimum safe area or fallback
  const safeBottom = Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0);
  const actualTabBarHeight = TAB_BAR_HEIGHT + safeBottom;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.orangeBtn,
        tabBarInactiveTintColor: theme.textSecondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBarBg,
          borderTopWidth: 1,
          borderTopColor: theme.divider || 'rgba(255,255,255,0.1)',
          height: actualTabBarHeight,
          minHeight: 50,
          maxHeight: 90,
          paddingBottom: safeBottom,
          paddingTop: 4,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarItemStyle: {
          height: TAB_BAR_HEIGHT - 4,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 2,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon Icon={Mic} focused={focused} label="Create" theme={theme} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon Icon={Library} focused={focused} label="Library" theme={theme} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon Icon={Settings} focused={focused} label="Settings" theme={theme} />,
        }}
      />
    </Tabs>
  );
}
