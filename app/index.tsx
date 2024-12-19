import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, BackHandler } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const APPS = [
  { id: 'facebook', name: 'Facebook', icon: 'logo-facebook' },
  { id: 'instagram', name: 'Instagram', icon: 'logo-instagram' },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'logo-whatsapp' },
  { id: 'reddit', name: 'Reddit', icon: 'logo-reddit' },
  { id: 'google', name: 'Google', icon: 'logo-google' },
  { id: 'gmail', name: 'Gmail', icon: 'mail' },
  { id: 'tiktok', name: 'TikTok', icon: 'logo-tiktok' },
];

const SLIDES = [
  {
    id: 'welcome',
    title: 'Privacy has never been more simple',
    description: 'Gain a better understanding of what permission you give to apps and services, and learn how to prevent it in the future.',
  },
  {
    id: 'apps',
    title: 'Which apps do you use?',
    description: 'Choose the main apps that you normally use. You can always add more later on.',
  },
];

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (currentSlide > 0) {
        setCurrentSlide(prev => prev - 1);
        return true; // Prevent default back behavior
      }
      return false; // Allow default back behavior on first slide
    });

    return () => backHandler.remove();
  }, [currentSlide]);

  const toggleApp = (appId: string) => {
    setSelectedApps(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handleComplete = async () => {
    if (currentSlide === SLIDES.length - 1) {
      await AsyncStorage.setItem('hasSeenIntro', 'true');
      router.replace('/(tabs)');
    } else {
      handleNext();
    }
  };

  const renderSlide = () => {
    const slide = SLIDES[currentSlide];

    if (slide.id === 'apps') {
      return (
        <View style={styles.slideContent}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
          <ScrollView style={styles.appList}>
            {APPS.map(app => (
              <TouchableOpacity
                key={app.id}
                style={[
                  styles.appItem,
                  selectedApps.includes(app.id) && styles.appItemSelected,
                ]}
                onPress={() => toggleApp(app.id)}
              >
                <View style={styles.appInfo}>
                  <Ionicons name={app.icon as any} size={24} color="#666" />
                  <Text style={styles.appName}>{app.name}</Text>
                </View>
                {selectedApps.includes(app.id) && (
                  <Ionicons name="checkmark" size={24} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={styles.slideContent}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>
        {slide.id === 'welcome'}
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.progress}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentSlide && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
        {renderSlide()}
        <View style={styles.footer}>
          {SLIDES[currentSlide].id === 'apps' && (
            <TouchableOpacity
              style={styles.selectAllButton}
              onPress={() => setSelectedApps(APPS.map(app => app.id))}
            >
              <Ionicons name="apps-outline" size={16} color="#666" />
              <Text style={styles.selectAllText}>Select all apps</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleComplete}
          >
            <Text style={styles.nextButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#007AFF',
  },
  slideContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  appList: {
    flex: 1,
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    marginBottom: 8,
  },
  appItemSelected: {
    backgroundColor: '#E1F0FF',
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: 16,
    marginLeft: 12,
    color: '#000',
  },
  footer: {
    gap: 8,
    marginTop: 16,
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  selectAllText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '400',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  welcomeImage: {
    width: '100%',
    height: 300,
    marginTop: 20,
  },
});