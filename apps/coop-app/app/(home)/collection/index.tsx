import React from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Plus, Search, Package } from 'lucide-react-native'
import { trpc } from '../../../utils/api'

const GRADE_COLOR: Record<string, string> = {
  A: 'bg-green-100 text-green-700',
  B: 'bg-yellow-100 text-yellow-700',
  C: 'bg-orange-100 text-orange-700',
}

function formatDate(d: Date | string) {
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function CollectionList() {
  const router = useRouter()
  const [search, setSearch] = React.useState('')
  const [debounced, setDebounced] = React.useState('')

  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 250)
    return () => clearTimeout(t)
  }, [search])

  const { data, isLoading, error, refetch, isRefetching } =
    trpc.collection.list.useQuery({ search: debounced || undefined, limit: 50 })

  const { data: stats } = trpc.collection.todayStats.useQuery()

  const lots = data?.collections ?? []

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="px-6 pt-4 pb-3">
        <Text className="text-3xl font-bold text-gray-900">Collection</Text>
        <Text className="text-gray-500 mt-1">Today's intake</Text>
      </View>

      <View className="px-6 pb-3 flex-row gap-3">
        <View className="flex-1 bg-green-50 border border-green-100 rounded-2xl p-4">
          <Text className="text-xs text-gray-500 mb-1">Lots today</Text>
          <Text className="text-2xl font-bold text-gray-900">{stats?.lotsToday ?? 0}</Text>
        </View>
        <View className="flex-1 bg-green-50 border border-green-100 rounded-2xl p-4">
          <Text className="text-xs text-gray-500 mb-1">Kg today</Text>
          <Text className="text-2xl font-bold text-gray-900">{stats?.kgToday ?? 0}</Text>
        </View>
      </View>

      <View className="px-6 pb-3">
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3">
          <Search size={18} color="#9CA3AF" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by lot code, crop, or farmer"
            placeholderTextColor="#9CA3AF"
            className="flex-1 py-3 px-2 text-gray-900"
            autoCapitalize="none"
          />
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#16A34A" />
        </View>
      ) : error ? (
        <View className="mx-6 bg-red-50 border border-red-200 rounded-2xl p-4">
          <Text className="text-red-700 font-semibold mb-1">Couldn't load lots</Text>
          <Text className="text-red-600 text-sm">{error.message}</Text>
        </View>
      ) : lots.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-16 h-16 bg-green-50 rounded-full items-center justify-center mb-4">
            <Package size={28} color="#16A34A" />
          </View>
          <Text className="text-gray-900 font-semibold text-lg mb-1">No lots yet</Text>
          <Text className="text-gray-500 text-center">
            {debounced ? `No matches for "${debounced}"` : 'Tap the + button to record your first collection.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={lots}
          keyExtractor={(l) => l.id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#16A34A" />
          }
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <View className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <View className="flex-row items-start justify-between mb-1">
                <Text className="font-mono text-xs text-gray-400">{item.lotCode}</Text>
                <View className={`px-2 py-0.5 rounded-full ${GRADE_COLOR[item.qualityGrade] ?? 'bg-gray-100 text-gray-600'}`}>
                  <Text className={`text-xs font-semibold ${GRADE_COLOR[item.qualityGrade]?.split(' ')[1] ?? 'text-gray-600'}`}>
                    Grade {item.qualityGrade}
                  </Text>
                </View>
              </View>
              <Text className="font-semibold text-gray-900 text-lg">
                {item.weightKg} kg · {item.crop}
              </Text>
              <Text className="text-gray-500 text-sm mt-0.5">
                {item.coopFarmer.fullName} · {formatDate(item.date)}
              </Text>
              {item.payment ? (
                <Text className="text-green-700 text-xs mt-1">
                  Payment: {item.payment.status} · {item.payment.totalAmount}
                </Text>
              ) : (
                <Text className="text-gray-400 text-xs mt-1">No payment recorded</Text>
              )}
            </View>
          )}
        />
      )}

      <TouchableOpacity
        onPress={() => router.push('/collection/new')}
        className="absolute bottom-6 right-6 w-14 h-14 bg-green-700 rounded-full items-center justify-center shadow-lg active:bg-green-800"
      >
        <Plus size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}
