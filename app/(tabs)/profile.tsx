import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

interface StatItemProps {
  icon: string;
  label: string;
  value: string;
}

const StatItem = ({ icon, label, value }: StatItemProps) => (
  <View style={styles.statItem}>
    <View style={styles.statCircle}>
      <Feather name={icon} size={24} color="#007AFF" />
      <Text style={styles.statValue}>{value}</Text>
    </View>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

interface SettingItemProps {
  icon: string;
  label: string;
  onPress: () => void;
}

const SettingItem = ({ icon, label, onPress }: SettingItemProps) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={styles.settingLeft}>
      <Feather name={icon} size={20} color="#666" />
      <Text style={styles.settingLabel}>{label}</Text>
    </View>
    <Feather name="chevron-right" size={20} color="#666" />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/300' }}
              style={styles.profileImage}
            />
          </View>
          
          <Text style={styles.greeting}>Hello Peter! 👋</Text>
          
          <View style={styles.statsContainer}>
            <StatItem icon="file-text" label="Documents read" value="13" />
            <StatItem icon="tool" label="Guides followed" value="8" />
            <StatItem icon="slash" label="Apps optimized" value="5" />
          </View>

          <View style={styles.settingsContainer}>
            <SettingItem 
              icon="settings" 
              label="App Settings" 
              onPress={() => console.log('settings')}
            />
            <SettingItem 
              icon="bell" 
              label="Notifications" 
              onPress={() => console.log('notifications')}
            />
            <SettingItem 
              icon="shield" 
              label="Privacy" 
              onPress={() => console.log('privacy')}
            />
            <SettingItem 
              icon="help-circle" 
              label="Help & Support" 
              onPress={() => console.log('help')}
            />
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
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 48,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  settingsContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 32,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#000',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 32,
    marginTop: 16,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 2,
  },
});
