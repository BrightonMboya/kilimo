import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowUpRight, ArrowDownLeft, Package } from 'lucide-react-native'

export default function BooksScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView className="flex-1 px-4 pt-6 pb-20" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-gray-800 mb-6">Farm Books</Text>

        {/* Summary Cards */}
        <View className="flex-row gap-4 mb-6">
          <View className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-2">
              <ArrowUpRight size={16} color="#16A34A" className="mr-1" />
              <Text className="text-xs font-bold text-green-600 uppercase">Income</Text>
            </View>
            <Text className="text-xl font-bold text-gray-900">KES 45,000</Text>
            <Text className="text-xs text-gray-400 mt-1">Last 30 days</Text>
          </View>
          <View className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-2">
              <ArrowDownLeft size={16} color="#EF4444" className="mr-1" />
              <Text className="text-xs font-bold text-red-500 uppercase">Expenses</Text>
            </View>
            <Text className="text-xl font-bold text-gray-900">KES 12,400</Text>
            <Text className="text-xs text-gray-400 mt-1">Last 30 days</Text>
          </View>
        </View>

        {/* Tabs (Visual Only) */}
        <View className="flex-row border-b border-gray-200 mb-4">
          <TouchableOpacity className="flex-1 pb-2 border-b-2 border-green-600 items-center">
            <Text className="text-green-600 font-medium text-sm">Inventory</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 pb-2 border-b-2 border-transparent items-center">
            <Text className="text-gray-400 font-medium text-sm">Transactions</Text>
          </TouchableOpacity>
        </View>

        {/* Inventory List */}
        <View className="gap-3">
          {[
            { item: "NPK Fertilizer (50kg)", qty: "4 Bags", status: "Low Stock", color: "text-orange-500" },
            { item: "Coffee Seeds (SL-28)", qty: "2 kg", status: "In Stock", color: "text-green-600" },
            { item: "Pesticide (Copper)", qty: "5 Liters", status: "In Stock", color: "text-green-600" },
          ].map((item, idx) => (
            <View key={idx} className="bg-white p-3 rounded-lg shadow-sm flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="bg-blue-50 p-2 rounded-md">
                  <Package size={20} color="#2563EB" />
                </View>
                <View>
                  <Text className="text-sm font-bold text-gray-800">{item.item}</Text>
                  <Text className={`text-xs font-medium ${item.color}`}>{item.status}</Text>
                </View>
              </View>
              <Text className="text-sm font-bold text-gray-700">{item.qty}</Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity className="w-full mt-6 py-3 bg-white border border-green-600 rounded-xl shadow-sm items-center">
          <Text className="text-green-600 font-bold text-sm">+ Record Transaction</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
