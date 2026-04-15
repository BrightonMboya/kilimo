import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Leaf, Users, Map, Package, Scale, UserPlus, MapPin, Sparkles, Receipt } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { useState, useCallback } from 'react'
import { trpc } from '../../utils/api'

export default function HomeScreen() {
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)

  const dashboardQuery = trpc.coop.dashboard.useQuery()

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await dashboardQuery.refetch()
    setRefreshing(false)
  }, [dashboardQuery])

  const data = dashboardQuery.data
  const coopName = data?.cooperative?.name ?? 'My Cooperative'

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#16A34A" />
        }
      >
        {dashboardQuery.isLoading && (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color="#16A34A" />
          </View>
        )}

        {/* Header */}
        <View className="bg-green-800 px-5 pt-5 pb-8 rounded-b-3xl">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center gap-3">
              <View className="h-11 w-11 rounded-2xl bg-white/20 items-center justify-center">
                <Leaf size={22} color="white" />
              </View>
              <View>
                <Text className="text-green-200 text-xs font-medium">JANI COOP</Text>
                <Text className="text-white text-lg font-bold">{coopName}</Text>
              </View>
            </View>
          </View>

          <Text className="text-green-100 text-sm mb-1">Trace - Transform - Trust</Text>
          <Text className="text-white/60 text-xs">Aggregator & Co-op Console</Text>
        </View>

        <View className="px-5 -mt-4">
          {/* Stats Grid */}
          <View className="flex-row flex-wrap gap-3 mb-6">
            <View className="flex-1 min-w-[45%] bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="w-8 h-8 rounded-lg bg-green-50 items-center justify-center">
                  <Users size={16} color="#16A34A" />
                </View>
                <Text className="text-xs text-gray-500">Farmers</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900">{data?.farmersCount ?? 0}</Text>
            </View>

            <View className="flex-1 min-w-[45%] bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="w-8 h-8 rounded-lg bg-green-50 items-center justify-center">
                  <Map size={16} color="#16A34A" />
                </View>
                <Text className="text-xs text-gray-500">Fields</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900">{data?.fieldsCount ?? 0}</Text>
            </View>

            <View className="flex-1 min-w-[45%] bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="w-8 h-8 rounded-lg bg-green-50 items-center justify-center">
                  <Package size={16} color="#16A34A" />
                </View>
                <Text className="text-xs text-gray-500">Lots Today</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900">{data?.lotsToday ?? 0}</Text>
            </View>

            <View className="flex-1 min-w-[45%] bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="w-8 h-8 rounded-lg bg-green-50 items-center justify-center">
                  <Scale size={16} color="#16A34A" />
                </View>
                <Text className="text-xs text-gray-500">Kg Today</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                {(data?.kgToday ?? 0).toLocaleString(undefined, { maximumFractionDigits: 1 })}
              </Text>
            </View>
          </View>

          {/* Quick Actions */}
          <Text className="text-base font-semibold text-gray-900 mb-3">Quick Actions</Text>
          <View className="flex-row flex-wrap gap-3 mb-6">
            <TouchableOpacity
              onPress={() => router.push('/farmers')}
              className="flex-1 min-w-[45%] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-row items-center gap-3"
            >
              <View className="w-10 h-10 rounded-xl bg-green-50 items-center justify-center">
                <UserPlus size={20} color="#16A34A" />
              </View>
              <Text className="text-sm font-medium text-gray-700">Add Farmer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/collection')}
              className="flex-1 min-w-[45%] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-row items-center gap-3"
            >
              <View className="w-10 h-10 rounded-xl bg-green-50 items-center justify-center">
                <Package size={20} color="#16A34A" />
              </View>
              <Text className="text-sm font-medium text-gray-700">Record Lot</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/ai')}
              className="flex-1 min-w-[45%] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-row items-center gap-3"
            >
              <View className="w-10 h-10 rounded-xl bg-green-50 items-center justify-center">
                <Sparkles size={20} color="#16A34A" />
              </View>
              <Text className="text-sm font-medium text-gray-700">Ask JANI</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/books')}
              className="flex-1 min-w-[45%] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-row items-center gap-3"
            >
              <View className="w-10 h-10 rounded-xl bg-green-50 items-center justify-center">
                <Receipt size={20} color="#16A34A" />
              </View>
              <Text className="text-sm font-medium text-gray-700">Payments</Text>
            </TouchableOpacity>
          </View>

          {/* Overview Card */}
          <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
            <Text className="text-base font-semibold text-gray-900 mb-3">Overview</Text>
            <View className="gap-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-gray-500">Total lots collected</Text>
                <Text className="text-sm font-semibold text-gray-900">{data?.totalLots ?? 0}</Text>
              </View>
              <View className="h-[1px] bg-gray-100" />
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-gray-500">Total kg collected</Text>
                <Text className="text-sm font-semibold text-gray-900">
                  {(data?.totalKg ?? 0).toLocaleString(undefined, { maximumFractionDigits: 1 })} kg
                </Text>
              </View>
              <View className="h-[1px] bg-gray-100" />
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-gray-500">Registered farmers</Text>
                <Text className="text-sm font-semibold text-gray-900">{data?.farmersCount ?? 0}</Text>
              </View>
              <View className="h-[1px] bg-gray-100" />
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-gray-500">Mapped fields</Text>
                <Text className="text-sm font-semibold text-gray-900">{data?.fieldsCount ?? 0}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
