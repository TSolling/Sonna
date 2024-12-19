import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { App, Guide } from '../libs/data';
import { fetchApps, fetchGuides } from '../libs/appwrite';

export default function AppGuides() {
  const params = useLocalSearchParams();
  const [app, setApp] = React.useState<App | null>(null);
  const [guides, setGuides] = React.useState<Guide[]>([]);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const apps = await fetchApps();
        const foundApp = apps.find((a: App) => a.id === params.id);
        if (foundApp) {
          setApp(foundApp);
          console.log('Found app:', foundApp.name);
          // Fetch guides for this app
          const appGuides = await fetchGuides(foundApp.name);
          console.log('Fetched guides:', appGuides);
          setGuides(appGuides);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [params.id]);

  const handleGuidePress = (guide: Guide) => {
    Alert.alert(
      'Coming Soon',
      `The guide for "${guide.title}" will be available soon!`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{app?.name || 'Guides'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.appHeader}>
          <Image
            source={{ uri: app?.icon }}
            style={styles.appIcon}
          />
          <View style={styles.appInfo}>
            <Text style={styles.appName}>{app?.name}</Text>
            <Text style={styles.appCategory}>{app?.category}</Text>
          </View>
        </View>

        {guides.map((guide) => {
          console.log('Rendering guide:', guide);
          return (
            <TouchableOpacity
              key={guide.id}
              style={styles.guideItem}
              onPress={() => handleGuidePress(guide)}
            >
              <View style={styles.guideInfo}>
                <Text style={styles.guideTitle}>{guide.title}</Text>
                <View style={styles.durationContainer}>
                  <Feather name="clock" size={14} color="#666" />
                  <Text style={styles.guideDuration}>{guide.time ? `${guide.time} min.` : 'N/A'}</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  guideInfo: {
    flex: 1,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  guideDuration: {
    fontSize: 14,
    color: '#666',
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  appIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appCategory: {
    fontSize: 14,
    color: '#666',
  },
}); 