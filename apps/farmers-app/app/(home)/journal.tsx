import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Plus, ChevronDown } from 'lucide-react-native'

export default function JournalScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['top']}>
      <ScrollView className="flex-1 px-4 pt-4 pb-20" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">Farm Journal & Events</Text>
          <Text className="text-gray-500">Track all activities for your active crop cycle.</Text>
        </View>

        {/* Filter & Add Button */}
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity className="flex-row items-center p-2 border border-gray-300 rounded-lg bg-white">
            <Text className="text-sm text-gray-700 mr-2">All Events</Text>
            <ChevronDown size={16} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-emerald-600 p-2 rounded-full shadow-sm flex-row items-center px-3">
            <Plus size={20} color="white" className="mr-1" />
            <Text className="font-medium text-sm text-white">New Log</Text>
          </TouchableOpacity>
        </View>

        {/* Event List Items */}
        <View className="gap-4">
          <View className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-emerald-500">
            <Text className="text-xs text-gray-500 mb-1">Aug 2, 2025</Text>
            <Text className="font-semibold text-lg text-gray-800 mb-1">Fertilizer Application (Urea)</Text>
            <Text className="text-sm text-gray-600">Plot C, 50kg applied manually.</Text>
          </View>

          <View className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-500">
            <Text className="text-xs text-gray-500 mb-1">Jul 1, 2025</Text>
            <Text className="font-semibold text-lg text-gray-800 mb-1">Planting</Text>
            <Text className="text-sm text-gray-600">Maize - Pioneer P3812 on 1.5 Ha.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
