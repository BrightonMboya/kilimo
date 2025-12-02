import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'

type TabType = 'inputs' | 'produce' | 'equipment'

export default function InventoryScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('inputs')

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['top']}>
      <ScrollView className="flex-1 px-4 pt-4 pb-20" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">Inventory Management</Text>
          <Text className="text-gray-500">Track all your farm inputs and harvested stock.</Text>
        </View>

        {/* Tab Switcher */}
        <View className="flex-row mb-6 border-b border-gray-300">
          <TouchableOpacity 
            className={`flex-1 pb-2 border-b-2 ${activeTab === 'inputs' ? 'border-emerald-600' : 'border-transparent'} items-center`}
            onPress={() => setActiveTab('inputs')}
          >
            <Text className={`font-semibold text-sm ${activeTab === 'inputs' ? 'text-emerald-600' : 'text-gray-500'}`}>Inputs</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 pb-2 border-b-2 ${activeTab === 'produce' ? 'border-emerald-600' : 'border-transparent'} items-center`}
            onPress={() => setActiveTab('produce')}
          >
            <Text className={`font-semibold text-sm ${activeTab === 'produce' ? 'text-emerald-600' : 'text-gray-500'}`}>Produce</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 pb-2 border-b-2 ${activeTab === 'equipment' ? 'border-emerald-600' : 'border-transparent'} items-center`}
            onPress={() => setActiveTab('equipment')}
          >
            <Text className={`font-semibold text-sm ${activeTab === 'equipment' ? 'text-emerald-600' : 'text-gray-500'}`}>Equipment</Text>
          </TouchableOpacity>
        </View>

        {/* Inputs Tab */}
        {activeTab === 'inputs' && (
          <View className="gap-4">
            <View className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-orange-500">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="font-semibold text-lg text-gray-800">Urea Fertilizer</Text>
                <Text className="text-base font-bold text-red-500">LOW</Text>
              </View>
              <Text className="text-sm text-gray-600">Remaining Stock: 2 Bags (100 kg)</Text>
              <Text className="text-xs text-gray-500 mt-1">Expiry: Jan 2027</Text>
            </View>

            <View className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-emerald-500">
              <Text className="font-semibold text-lg text-gray-800 mb-1">Maize Seeds (P3812)</Text>
              <Text className="text-sm text-gray-600">Remaining Stock: 5 kg</Text>
              <Text className="text-xs text-gray-500 mt-1">Last Purchase: Mar 2025</Text>
            </View>

            <View className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
              <Text className="font-semibold text-lg text-gray-800 mb-1">Pesticide (Cypermethrin)</Text>
              <Text className="text-sm text-gray-600">Remaining Stock: 3 Liters</Text>
              <Text className="text-xs text-gray-500 mt-1">Expiry: Sep 2026</Text>
            </View>
          </View>
        )}

        {/* Produce Tab */}
        {activeTab === 'produce' && (
          <View className="gap-4">
            <View className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-emerald-500">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="font-semibold text-lg text-gray-800">Maize Harvest</Text>
                <Text className="text-base font-bold text-emerald-600">READY</Text>
              </View>
              <Text className="text-sm text-gray-600">Total Yield: 850 kg</Text>
              <Text className="text-xs text-gray-500 mt-1">Harvested: Nov 2025</Text>
            </View>

            <View className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-500">
              <Text className="font-semibold text-lg text-gray-800 mb-1">Tomatoes</Text>
              <Text className="text-sm text-gray-600">Current Stock: 120 kg</Text>
              <Text className="text-xs text-gray-500 mt-1">Harvested: Last Week</Text>
            </View>

            <View className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-orange-500">
              <Text className="font-semibold text-lg text-gray-800 mb-1">Potatoes</Text>
              <Text className="text-sm text-gray-600">Current Stock: 300 kg</Text>
              <Text className="text-xs text-gray-500 mt-1">Harvested: Oct 2025</Text>
            </View>
          </View>
        )}

        {/* Equipment Tab */}
        {activeTab === 'equipment' && (
          <View className="gap-4">
            <View className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-emerald-500">
              <Text className="font-semibold text-lg text-gray-800 mb-1">Tractor (John Deere 5075E)</Text>
              <Text className="text-sm text-gray-600">Status: Operational</Text>
              <Text className="text-xs text-gray-500 mt-1">Last Service: Aug 2025</Text>
            </View>

            <View className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
              <Text className="font-semibold text-lg text-gray-800 mb-1">Irrigation Pump</Text>
              <Text className="text-sm text-gray-600">Status: Operational</Text>
              <Text className="text-xs text-gray-500 mt-1">Last Maintenance: Sep 2025</Text>
            </View>

            <View className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-orange-500">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="font-semibold text-lg text-gray-800">Sprayer</Text>
                <Text className="text-base font-bold text-orange-600">REPAIR</Text>
              </View>
              <Text className="text-sm text-gray-600">Status: Needs Maintenance</Text>
              <Text className="text-xs text-gray-500 mt-1">Last Used: Nov 2025</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
