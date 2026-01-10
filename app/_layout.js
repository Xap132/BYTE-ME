import { ThemeProvider as CustomThemeProvider } from '@/contexts/ThemeContext';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

// Flag to track if splash has been shown (persists across hot reloads)
let hasShownSplash = false;

// Custom App Splash Screen Component
function AppSplashScreen({ onFinish }) {
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const subtitleFade = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Animate in
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(subtitleFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-finish after animation
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={splashStyles.container}>
      <Animated.View
        style={[
          splashStyles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={splashStyles.logoTech}>Tech</Text>
        <Text style={splashStyles.logoTalk}>Talk</Text>
      </Animated.View>
      <Animated.Text style={[splashStyles.subtitle, { opacity: subtitleFade }]}>
        Text to Speech
      </Animated.Text>
      <Animated.View style={[splashStyles.loader, { opacity: subtitleFade }]}>
        <View style={splashStyles.loaderDot} />
        <View style={[splashStyles.loaderDot, splashStyles.loaderDotDelay1]} />
        <View style={[splashStyles.loaderDot, splashStyles.loaderDotDelay2]} />
      </Animated.View>
    </View>
  );
}

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101828',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoTech: {
    fontSize: 72,
    fontFamily: 'SF-Pro-Bold',
    color: '#CD8546',
    lineHeight: 75,
  },
  logoTalk: {
    fontSize: 72,
    fontFamily: 'SF-Pro-Bold',
    color: '#FFFFFF',
    lineHeight: 75,
    marginTop: -10,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'SF-Pro-Medium',
    color: '#D4D4D8',
    marginTop: 16,
  },
  loader: {
    flexDirection: 'row',
    marginTop: 40,
    gap: 8,
  },
  loaderDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CD8546',
    opacity: 0.3,
  },
  loaderDotDelay1: {
    opacity: 0.6,
  },
  loaderDotDelay2: {
    opacity: 1,
  },
});

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  // Only show splash on first app launch, not on hot reloads
  const [showSplash, setShowSplash] = useState(!hasShownSplash);

  const [fontsLoaded] = useFonts({
    'SF-Pro-Regular': require('../assets/sf-pro-display/SFPRODISPLAYREGULAR.otf'),
    'SF-Pro-Medium': require('../assets/sf-pro-display/SFPRODISPLAYMEDIUM.otf'),
    'SF-Pro-Bold': require('../assets/sf-pro-display/SFPRODISPLAYBOLD.otf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      setAppReady(true);
    }
  }, [fontsLoaded]);

  const handleSplashFinish = useCallback(() => {
    hasShownSplash = true; // Mark as shown so it doesn't show on hot reload
    setShowSplash(false);
  }, []);

  if (!fontsLoaded || !appReady) {
    return null;
  }

  if (showSplash) {
    return <AppSplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <SafeAreaProvider>
      <CustomThemeProvider>
        <ThemeProvider value={DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </CustomThemeProvider>
    </SafeAreaProvider>
  );
}
