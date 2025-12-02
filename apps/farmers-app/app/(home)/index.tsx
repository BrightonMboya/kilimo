import { SignedIn, useUser } from '@clerk/clerk-expo'
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScanLine, User, Tractor, ClipboardPen, BrainCircuit, CloudSun, ListChecks, Map as MapIcon, ChevronRight, Wallet } from 'lucide-react-native'
import { SignOutButton } from '../components/SignOutButton'
import { Link } from 'expo-router'

export default function Page() {
  const { user } = useUser()

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['top']}>
      {/* Header Bar */}
      <View className="flex-row justify-between items-center px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
        <View className="flex-row items-center space-x-2">
          <Text className="text-2xl font-extrabold text-emerald-600">JANI</Text>
        </View>
        <View className="flex-row items-center gap-3">
          {/* Farmer ID / QR Code Button */}
          <TouchableOpacity className="p-2 rounded-full bg-gray-100">
            <ScanLine size={20} color="#4b5563" />
          </TouchableOpacity>
          {/* Profile/Settings Icon */}
          <TouchableOpacity className="p-2 rounded-full bg-emerald-600">
            <User size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4 pb-20" showsVerticalScrollIndicator={false}>
        {/* 1. Home Dashboard */}
        <View className="gap-6 mb-6">
          {/* Farm Overview Card */}
          <View className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-emerald-500">
            <View className="flex-row items-center mb-2">
              <Tractor size={20} color="#059669" className="mr-2" />
              <Text className="text-lg font-bold text-gray-800 ml-2">Active Farm Overview</Text>
            </View>
            <View className="space-y-1">
              <Text className="text-sm text-gray-700"><Text className="font-medium">Farm Name:</Text> Green Acres (Field C)</Text>
              <Text className="text-sm text-gray-700"><Text className="font-medium">Crop:</Text> Maize (Pioneer P3812)</Text>
              <Text className="text-sm text-gray-700"><Text className="font-medium">Planted:</Text> 45 Days Ago (DAP)</Text>
              <Text className="text-sm text-gray-700"><Text className="font-medium">Area:</Text> 1.5 Hectares</Text>
            </View>
          </View>

          {/* 2. Critical Tracking Events (Quick Actions) */}
          <View className="flex-row gap-4">
            <Link href="/(home)/journal" asChild>
              <TouchableOpacity className="flex-1 bg-emerald-600 p-4 rounded-xl shadow-sm items-center">
                <ClipboardPen size={32} color="white" className="mb-1" />
                <Text className="font-semibold text-sm text-white mt-1">Record Event</Text>
                <Text className="text-xs text-emerald-100 opacity-80 text-center mt-1">(Planting, Spraying, Harvest)</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/(home)/ai" asChild>
              <TouchableOpacity className="flex-1 bg-blue-600 p-4 rounded-xl shadow-sm items-center">
                <BrainCircuit size={32} color="white" className="mb-1" />
                <Text className="font-semibold text-sm text-white mt-1">AI Assistant</Text>
                <Text className="text-xs text-blue-100 opacity-80 text-center mt-1">(Pest Diagnosis & Advice)</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* 8. Farm Monitoring & 10. Add-Ons Snapshot */}
          <View>
            <Text className="text-xl font-bold text-gray-800 mb-4">Today's Focus</Text>

            {/* Monitoring Cards Grid */}
            <View className="flex-row gap-4">
              {/* Weather Card */}
              <View className="flex-1 bg-yellow-50 p-3 rounded-xl shadow-sm">
                <View className="flex-row items-center mb-1">
                  <CloudSun size={20} color="#ca8a04" className="mr-2" />
                  <Text className="font-semibold text-sm text-yellow-600 ml-1">Weather</Text>
                </View>
                <Text className="text-2xl font-bold text-gray-800">28°C</Text>
                <Text className="text-xs text-gray-500">Sunny, 10% Rain Chance</Text>
              </View>

              {/* Next Task Card */}
              <View className="flex-1 bg-red-50 p-3 rounded-xl shadow-sm">
                <View className="flex-row items-center mb-1">
                  <ListChecks size={20} color="#dc2626" className="mr-2" />
                  <Text className="font-semibold text-sm text-red-600 ml-1">Next Task</Text>
                </View>
                <Text className="text-lg font-bold text-gray-800">Weeding Plot C</Text>
                <Text className="text-xs text-gray-500">Due: Tomorrow (1:00 PM)</Text>
              </View>
            </View>
          </View>

          {/* 6. Farm Mapping Link */}
          <TouchableOpacity className="bg-blue-50 p-4 rounded-xl shadow-sm flex-row justify-between items-center border-l-4 border-blue-400">
            <View>
              <View className="flex-row items-center">
                <MapIcon size={20} color="#3b82f6" className="mr-2" />
                <Text className="font-semibold text-gray-800 ml-2">Farm Mapping & Zones</Text>
              </View>
              <Text className="text-sm text-gray-500 mt-1">View field boundaries and soil data.</Text>
            </View>
            <ChevronRight size={24} color="#3b82f6" />
          </TouchableOpacity>

          {/* 9. Sales & Expenses Snapshot */}
          <View className="bg-white p-4 rounded-xl shadow-sm">
            <View className="flex-row items-center mb-3">
              <Wallet size={20} color="#9333ea" className="mr-2" />
              <Text className="text-lg font-bold text-gray-800 ml-2">Financial Snapshot (Season)</Text>
            </View>
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-sm text-gray-500">Total Sales</Text>
                <Text className="text-xl font-bold text-green-600">₹ 85,000</Text>
              </View>
              <View className="items-center">
                <Text className="text-sm text-gray-500">Total Expenses</Text>
                <Text className="text-xl font-bold text-red-600">₹ 32,500</Text>
              </View>
            </View>
            <TouchableOpacity className="mt-3">
              <Text className="text-center text-sm text-purple-600 font-medium">View Detailed Ledger</Text>
            </TouchableOpacity>
          </View>

          {/* Temporary Sign Out for testing */}
          <View className="mt-4 mb-8">
            <SignOutButton />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}