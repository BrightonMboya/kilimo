import { Tabs, Redirect } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import { Home, BookOpenText, BrainCircuit, Warehouse, ScanLine, User } from 'lucide-react-native'
import { View, TouchableOpacity } from 'react-native'

export default function HomeLayout() {
  const { isSignedIn } = useAuth()

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-up" />
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#059669', // jani-dark-green
        tabBarInactiveTintColor: '#6b7280', // gray-500
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color }) => <BookOpenText size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: 'AI Assist',
          tabBarIcon: ({ color }) => <BrainCircuit size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventory',
          tabBarIcon: ({ color }) => <Warehouse size={24} color={color} />,
        }}
      />
    </Tabs>
  )
}