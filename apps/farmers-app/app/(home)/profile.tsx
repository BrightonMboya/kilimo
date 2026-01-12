import { useUser } from '@clerk/clerk-expo'
import { View, Text, ScrollView, Image } from 'react-native'
import { User, QrCode, CheckCircle, Leaf } from 'lucide-react-native'
import { MOCK_USER } from './mockData'

export default function ProfileScreen() {
  const { user } = useUser()

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 pb-24" showsVerticalScrollIndicator={false}>
        {/* Top Section */}
        <View className="bg-green-700 p-6 pb-12 items-center rounded-b-[3rem] shadow-lg pt-12">
          <View className="w-24 h-24 bg-white rounded-full mb-3 p-1">
            <View className="w-full h-full bg-gray-200 rounded-full overflow-hidden items-center justify-center">
              {user?.imageUrl ? (
                <Image source={{ uri: user.imageUrl }} className="w-full h-full" />
              ) : (
                <User size={60} color="#9CA3AF" className="mt-2" />
              )}
            </View>
          </View>
          <Text className="text-xl font-bold text-white">{user?.fullName || MOCK_USER.name}</Text>
          <Text className="text-green-200 text-sm mt-1">{MOCK_USER.location}</Text>
        </View>

        {/* ID Card Section */}
        <View className="px-6 -mt-8">
          <View className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 items-center">
            <Text className="text-gray-400 text-xs uppercase tracking-widest mb-4">Farmer Digital ID</Text>
            <View className="bg-white p-2 border-2 border-gray-900 rounded-lg mb-4">
              <QrCode size={120} color="#111827" />
            </View>
            <Text className="font-mono text-lg font-bold text-gray-800 tracking-wider">{MOCK_USER.id}</Text>
            <View className="w-full h-px bg-gray-100 my-4" />
            <View className="flex-row justify-between w-full">
              <Text className="text-sm text-gray-500">Cooperative</Text>
              <Text className="font-medium text-right max-w-[60%] text-gray-800">{MOCK_USER.coop}</Text>
            </View>
          </View>
        </View>

        {/* Stats / Certificates */}
        <View className="px-6 mt-6 gap-3 mb-8">
          <Text className="font-bold text-gray-800">Certificates & Compliance</Text>
          <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-row items-center gap-3">
            <View className="bg-green-100 p-2 rounded-full">
              <CheckCircle size={20} color="#15803D" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-gray-800">EU Deforestation Reg (EUDR)</Text>
              <Text className="text-xs text-gray-500">Verified • Expires Dec 2025</Text>
            </View>
          </View>
          <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-row items-center gap-3">
            <View className="bg-blue-100 p-2 rounded-full">
              <Leaf size={20} color="#1D4ED8" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-gray-800">Rainforest Alliance</Text>
              <Text className="text-xs text-gray-500">Pending Audit</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
