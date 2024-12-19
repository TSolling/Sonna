import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Platform, Keyboard } from "react-native";
import { useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';

export default function TabLayout() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            display: isKeyboardVisible ? 'none' : 'flex',
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#999999',
          tabBarItemStyle: {
            ...Platform.select({
              ios: {
                paddingVertical: 6,
              },
            }),
          },
          tabBarIconStyle: {
            opacity: 0.8,
          },
          tabBarPressColor: 'transparent',
          tabBarPressOpacity: 0.7,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="search" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="user" size={22} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
} 