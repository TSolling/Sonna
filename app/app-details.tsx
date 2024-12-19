import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { App, PrivacyItem } from '../libs/data';
import { fetchApps, fetchPrivacyItems } from '../libs/appwrite';

export default function AppDetails() {
  const params = useLocalSearchParams();
  const [app, setApp] = useState<App | null>(null);
  const [privacyItems, setPrivacyItems] = useState<PrivacyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const apps = await fetchApps();
        const foundApp = apps.find(a => a.id === params.id);
        if (foundApp) {
          setApp(foundApp);
          // Fetch privacy items for this app
          const items = await fetchPrivacyItems(foundApp.name);
          setPrivacyItems(items);
        } else {
          console.error('App not found');
          router.back();
        }
      } catch (error) {
        console.error('Error loading data:', error);
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [params.id]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (!app) {
    return null;
  }

  const getIconColor = (status: PrivacyItem['status']) => {
    switch (status) {
      case 'positive':
        return '#34C759';
      case 'warning':
        return '#FF9500';
      case 'negative':
        return '#FF3B30';
    }
  };

  const getIconBackgroundColor = (status: PrivacyItem['status']) => {
    switch (status) {
      case 'positive':
        return 'rgba(52, 199, 89, 0.1)';
      case 'warning':
        return 'rgba(255, 149, 0, 0.1)';
      case 'negative':
        return 'rgba(255, 59, 48, 0.1)';
    }
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
        <Text style={styles.headerTitle}>{app.name}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.appHeader}>
          <Image
            source={{ uri: app.icon }}
            style={styles.appIcon}
          />
          <View style={styles.appInfo}>
            <Text style={styles.appName}>{app.name}</Text>
            <Text style={styles.appCategory}>{app.category}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{app.rating || '-'}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{app.notes}</Text>
            <Text style={styles.statLabel}>Notes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{app.guides}</Text>
            <Text style={styles.statLabel}>Guides</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push(`/app-guides?id=${app.id}`)}
          >
            <Text style={styles.actionButtonText}>View Guides</Text>
            <Feather name="chevron-right" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Notes</Text>
          <View style={styles.privacyList}>
            {privacyItems.map((item) => (
              <View key={item.id} style={styles.privacyItem}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: getIconBackgroundColor(item.status) }
                  ]}
                >
                  <Feather
                    name={item.icon}
                    size={20}
                    color={getIconColor(item.status)}
                  />
                </View>
                <View style={styles.privacyContent}>
                  <Text style={styles.privacyTitle}>{item.title}</Text>
                  <Text style={styles.privacyDescription}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
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
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 16,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appCategory: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#f8f8f8',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  privacyList: {
    gap: 16,
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  privacyContent: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  privacyDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    padding: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
}); 