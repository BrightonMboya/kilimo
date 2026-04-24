import React from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Plus, Search, ChevronRight, UserRound } from 'lucide-react-native'
import { trpc } from '../../../utils/api'

export default function FarmersList() {
  const router = useRouter()
  const [search, setSearch] = React.useState('')
  const [debouncedSearch, setDebouncedSearch] = React.useState('')

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 250)
    return () => clearTimeout(t)
  }, [search])

  const { data, isLoading, error, refetch, isRefetching } =
    trpc.coopFarmers.list.useQuery({ search: debouncedSearch || undefined, limit: 50 })

  const farmers = data?.farmers ?? []

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="px-6 pt-4 pb-3">
        <Text className="text-3xl font-bold text-gray-900">Farmers</Text>
        <Text className="text-gray-500 mt-1">
          {farmers.length > 0 ? `${farmers.length} registered` : 'Your registry'}
        </Text>
      </View>

      <View className="px-6 pb-3">
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3">
          <Search size={18} color="#9CA3AF" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name, phone, or QR"
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
          <Text className="text-red-700 font-semibold mb-1">Couldn't load farmers</Text>
          <Text className="text-red-600 text-sm">{error.message}</Text>
        </View>
      ) : farmers.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-16 h-16 bg-green-50 rounded-full items-center justify-center mb-4">
            <UserRound size={28} color="#16A34A" />
          </View>
          <Text className="text-gray-900 font-semibold text-lg mb-1">No farmers yet</Text>
          <Text className="text-gray-500 text-center">
            {debouncedSearch
              ? `No matches for "${debouncedSearch}"`
              : 'Tap the + button to register your first farmer.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={farmers}
          keyExtractor={(f) => f.id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#16A34A" />
          }
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/farmers/${item.id}`)}
              className="flex-row items-center bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
            >
              <View className="w-11 h-11 bg-green-50 rounded-full items-center justify-center mr-3">
                <Text className="text-green-700 font-bold">
                  {item.fullName?.[0]?.toUpperCase() ?? '?'}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">{item.fullName}</Text>
                <Text className="text-gray-500 text-sm">
                  {item.phoneNumber ?? item.location ?? 'No contact info'}
                </Text>
                <Text className="text-gray-400 text-xs mt-0.5">
                  {item._count.collections} lots · {item.fields.length} fields
                </Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        onPress={() => router.push('/farmers/new')}
        className="absolute bottom-6 right-6 w-14 h-14 bg-green-700 rounded-full items-center justify-center shadow-lg active:bg-green-800"
      >
        <Plus size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}
