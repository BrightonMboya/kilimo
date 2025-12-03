import { useUser } from '@clerk/clerk-expo'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Leaf, Menu, CloudRain, Droplets, Search, Plus } from 'lucide-react-native'
import { Link } from 'expo-router'
import { MOCK_USER, MOCK_WEATHER, MOCK_TASKS, MOCK_FIELDS } from './mockData'

export default function Page() {
  const { user } = useUser()

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView className="flex-1 pb-20" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-green-700 p-6 rounded-b-3xl shadow-lg relative overflow-hidden pb-8">
          <View className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
            <Leaf size={120} color="white" />
          </View>
          <View className="flex-row justify-between items-start relative z-10">
            <View>
              <Text className="text-green-100 text-sm">Hujambo, (Hello)</Text>
              <Text className="text-2xl font-bold text-white mt-1">{user?.firstName || MOCK_USER.name}</Text>
              <View className="flex-row items-center mt-2 bg-green-800/50 self-start px-3 py-1 rounded-full">
                <View className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                <Text className="text-xs text-white">Online & Synced</Text>
              </View>
            </View>
            <View className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
              <Menu size={24} color="white" />
            </View>
          </View>

          {/* Weather Widget */}
          <View className="mt-6 flex-row items-center bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10">
            <View className="mr-4">
              <CloudRain size={32} className="text-blue-200" color="#BFDBFE" />
            </View>
            <View className="flex-1">
              <View className="flex-row items-end">
                <Text className="text-3xl font-bold text-white">{MOCK_WEATHER.temp}°</Text>
                <Text className="text-sm mb-1 ml-1 text-white">Nairobi</Text>
              </View>
              <Text className="text-xs text-green-100 mt-1">{MOCK_WEATHER.advice}</Text>
            </View>
            <View className="items-end">
              <Text className="text-xs font-bold text-white">{MOCK_WEATHER.precip} Rain</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-4 mt-6">
          <Text className="font-bold text-gray-800 mb-3 text-lg">Quick Actions</Text>
          <View className="flex-row justify-between gap-2">
            {[
              { icon: Leaf, label: "Log Harvest", bg: "bg-orange-100", text: "text-orange-600", color: "#EA580C" },
              { icon: Droplets, label: "Spray/Input", bg: "bg-blue-100", text: "text-blue-600", color: "#2563EB" },
              { icon: Search, label: "Scouting", bg: "bg-purple-100", text: "text-purple-600", color: "#9333EA" },
              { icon: Plus, label: "Add Task", bg: "bg-gray-200", text: "text-gray-600", color: "#4B5563" },
            ].map((action, idx) => (
              <TouchableOpacity key={idx} className="flex-1 items-center space-y-2">
                <View className={`${action.bg} p-4 rounded-2xl shadow-sm w-full items-center aspect-square justify-center`}>
                  <action.icon size={24} color={action.color} />
                </View>
                <Text className="text-xs text-center font-medium text-gray-600">{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tasks */}
        <View className="px-4 mt-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="font-bold text-gray-800 text-lg">Today's Tasks</Text>
            <TouchableOpacity>
              <Text className="text-green-600 text-sm font-medium">See All</Text>
            </TouchableOpacity>
          </View>
          <View className="gap-3">
            {MOCK_TASKS.map((task) => (
              <View key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-row items-center">
                <View className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${task.urgent ? 'border-red-400' : 'border-gray-300'}`} />
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800 text-sm">{task.title}</Text>
                  <Text className="text-xs text-gray-500 mt-1">Due: {task.due}</Text>
                </View>
                {task.urgent && (
                  <View className="bg-red-100 px-2 py-1 rounded-full">
                    <Text className="text-red-600 text-[10px] font-bold">URGENT</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Field Overview */}
        <View className="px-4 mt-6 mb-8">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="font-bold text-gray-800 text-lg">My Fields</Text>
            <Link href="/(home)/fields" asChild>
              <TouchableOpacity>
                <Text className="text-green-600 text-sm font-medium">Manage</Text>
              </TouchableOpacity>
            </Link>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-4 pb-2">
            {MOCK_FIELDS.map((field) => (
              <View key={field.id} className="w-[200px] bg-white p-3 rounded-xl shadow-sm border border-gray-100 mr-4">
                <View className="h-24 bg-gray-200 rounded-lg mb-3 overflow-hidden relative items-center justify-center">
                  <View className="absolute inset-0 items-center justify-center bg-green-50">
                     <Leaf className="text-green-200" size={40} color="#BBF7D0" />
                  </View>
                  <View className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded shadow-sm">
                    <Text className="text-[10px] font-bold text-gray-800">{field.status}</Text>
                  </View>
                </View>
                <Text className="font-bold text-gray-800 text-sm">{field.name}</Text>
                <Text className="text-xs text-gray-500 mt-1">{field.crop} • {field.size}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}