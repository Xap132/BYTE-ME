import { Tabs } from 'expo-router';
import { Library, Mic, Settings } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

function TabIcon({ Icon, focused, label }) {
  const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0.8)).current;
  const opacityAnim = useRef(new Animated.Value(focused ? 1 : 0.6)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? 1 : 0.8,
        useNativeDriver: true,
        speed: 10,
        bounciness: 0,
      }),
      Animated.timing(opacityAnim, {
        toValue: focused ? 1 : 0.6,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <Animated.View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
        minWidth: 70,
      }}
    >
      <Icon
        size={22}
        color={focused ? Colors.techTalk.orangeBtn : '#FFFFFF'}
        strokeWidth={focused ? 2.5 : 2}
      />
      <Animated.Text
        style={{
          color: focused ? Colors.techTalk.orangeBtn : '#FFFFFF',
          fontSize: 10,
          marginTop: 2,
          fontFamily: 'SF-Pro-Medium',
        }}
      >
        {label}
      </Animated.Text>
    </Animated.View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.techTalk.orangeBtn,
        tabBarInactiveTintColor: '#FFFFFF',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.techTalk.tabBarBg,
          borderTopWidth: 0,
          height: 58 + insets.bottom,
          paddingBottom: insets.bottom,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          elevation: 0,
          shadowOpacity: 0,
          borderTopColor: 'transparent',
        },
        tabBarItemStyle: {
          height: 58,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon Icon={Mic} focused={focused} label="Create" />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon Icon={Library} focused={focused} label="Library" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon Icon={Settings} focused={focused} label="Settings" />,
        }}
      />
    </Tabs>
  );
}
