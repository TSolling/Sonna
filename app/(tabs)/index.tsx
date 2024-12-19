import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { App } from '../../libs/data';
import { fetchApps } from '../../libs/appwrite';
import { useRouter } from 'expo-router';

const CATEGORIES = ['MY APPS', 'NEWLY UPDATED', 'PRIVACY FIRST', 'POPULAR IN 🇩🇰'];

export default function ProfileScreen() {
  const [activeCategory, setActiveCategory] = React.useState('MY APPS');
  const [notifications, setNotifications] = React.useState<AppNotification[]>([
    {
      appName: 'WhatsApp',
      message: 'New privacy policy needs review',
      importance: 'high'
    },
    {
      appName: 'Spotify',
      message: 'Terms of Service update pending',
      importance: 'medium'
    }
  ]);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [apps, setApps] = React.useState<App[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadApps = async () => {
      try {
        const fetchedApps = await fetchApps();
        setApps(fetchedApps);
      } catch (error) {
        console.error('Error loading apps:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadApps();
  }, []);

  const NEARBY_EVENTS = apps.slice(0, 4);

  const handleNotificationPress = () => {
    if (notifications.length > 0) {
      setShowNotifications(true);
    }
  };

  const NotificationsModal = () => (
    <Modal
      visible={showNotifications}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowNotifications(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Notifications</Text>
            <TouchableOpacity 
              onPress={() => setShowNotifications(false)}
              style={styles.closeButton}
            >
              <Feather name="x" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.notificationList}>
            {notifications.map((notification, index) => (
              <View key={index} style={styles.notificationItem}>
                <View style={[
                  styles.notificationIcon,
                  { backgroundColor: getNotificationColor(notification.importance).bgColor }
                ]}>
                  <Feather 
                    name="alert-circle"
                    size={24} 
                    color={getNotificationColor(notification.importance).iconColor}
                  />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.appName}</Text>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#666" />
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const getNotificationColor = (importance: 'high' | 'medium' | 'low') => {
    switch (importance) {
      case 'high':
        return {
          bgColor: 'rgba(255,59,48,0.1)',
          iconColor: '#FF3B30'
        };
      case 'medium':
        return {
          bgColor: 'rgba(255,149,0,0.1)',
          iconColor: '#FF9500'
        };
      case 'low':
        return {
          bgColor: 'rgba(0,122,255,0.1)',
          iconColor: '#007AFF'
        };
    }
  };

  return (
    <SafeAreaView 
      style={styles.container}
      edges={['top']}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={handleNotificationPress}
        >
          <Feather name="bell" size={24} color="#000" />
          {notifications.length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>
                {notifications.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                activeCategory === category && styles.categoryButtonActive
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                activeCategory === category && styles.categoryTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.featuredTitle}>Featured</Text>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.eventsScroll}
            contentContainerStyle={styles.eventsScrollContent}
          >
            {NEARBY_EVENTS.map(event => (
              <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventImageContainer}>
                  <Image 
                    source={{ uri: event.banner }}
                    style={styles.bannerImage}
                    resizeMode="cover"
                  />
                  <View style={styles.logoContainer}>
                    <Image
                      source={{ uri: event.icon }}
                      style={styles.logo}
                    />
                  </View>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventName}>{event.name}</Text>
                  <Text style={styles.eventCategory}>{event.category}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Most used Apps</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeMore}>See All</Text>
              <Feather name="chevron-right" size={16} color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.appScrollContent}>
            {apps.map(app => (
              <TouchableOpacity 
                key={app.id} 
                style={styles.appCard}
                onPress={() => router.push(`/app-details?id=${app.id}`)}
              >
                <Image
                  source={{ uri: app.icon }}
                  style={styles.appIcon}
                  resizeMode="cover"
                />
                <View style={styles.appInfo}>
                  <Text style={styles.appName}>{app.name}</Text>
                  <Text style={styles.appCategory}>{app.category}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Newly installed</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeMore}>See All</Text>
              <Feather name="chevron-right" size={16} color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.appScrollContent}>
            {apps.map(app => (
              <TouchableOpacity 
                key={app.id} 
                style={styles.appCard}
                onPress={() => router.push(`/app-details?id=${app.id}`)}
              >
                <Image
                  source={{ uri: app.icon }}
                  style={styles.appIcon}
                  resizeMode="cover"
                />
                <View style={styles.appInfo}>
                  <Text style={styles.appName}>{app.name}</Text>
                  <Text style={styles.appCategory}>{app.category}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      <NotificationsModal />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  notificationButton: {
    position: 'relative',
    padding: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationCount: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingLeft: 16,
    marginBottom: 24,
  },
  categoriesContent: {
    paddingRight: 16,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
    paddingLeft: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 0,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeMore: {
    color: '#666',
    fontSize: 14,
    marginRight: 4,
  },
  eventsScroll: {
    paddingLeft: 0,
  },
  eventCard: {
    width: 280,
    marginRight: 16,
  },
  eventImageContainer: {
    width: '100%',
    aspectRatio: 16/9,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  eventInfo: {
    gap: 2,
  },
  eventName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  eventCategory: {
    fontSize: 11,
    color: '#666',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  appCard: {
    width: 100,
    marginRight: 16,
  },
  appIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginBottom: 8,
  },
  appInfo: {
    justifyContent: 'center',
  },
  appName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  appCategory: {
    fontSize: 11,
    color: '#666',
  },
  appScrollContent: {
    paddingRight: 16,
  },
  eventsScrollContent: {
    paddingRight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  notificationList: {
    maxHeight: 400,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,122,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
  },
}); 