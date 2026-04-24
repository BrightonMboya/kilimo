import React from 'react'
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Search, X, Check } from 'lucide-react-native'
import { trpc } from '../utils/api'

type Farmer = { id: string; fullName: string; phoneNumber?: string | null }

export function FarmerPicker({
  value,
  onChange,
}: {
  value: Farmer | null
  onChange: (farmer: Farmer) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [debounced, setDebounced] = React.useState('')

  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 250)
    return () => clearTimeout(t)
  }, [search])

  const { data, isLoading } = trpc.coopFarmers.list.useQuery(
    { search: debounced || undefined, limit: 50 },
    { enabled: open },
  )

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5"
      >
        <Text className={value ? 'text-gray-900 text-base' : 'text-gray-400 text-base'}>
          {value ? value.fullName : 'Select a farmer'}
        </Text>
        {value?.phoneNumber ? (
          <Text className="text-gray-500 text-sm mt-0.5">{value.phoneNumber}</Text>
        ) : null}
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
            <TouchableOpacity onPress={() => setOpen(false)} className="w-10 h-10 items-center justify-center -ml-2">
              <X size={24} color="#111827" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-900">Select Farmer</Text>
            <View className="w-10" />
          </View>

          <View className="px-6 py-3">
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3">
              <Search size={18} color="#9CA3AF" />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search by name or phone"
                placeholderTextColor="#9CA3AF"
                className="flex-1 py-3 px-2 text-gray-900"
                autoCapitalize="none"
                autoFocus
              />
            </View>
          </View>

          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#16A34A" />
            </View>
          ) : (data?.farmers ?? []).length === 0 ? (
            <View className="flex-1 items-center justify-center px-8">
              <Text className="text-gray-500 text-center">
                {debounced ? `No matches for "${debounced}"` : 'No farmers yet. Register one first.'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={data?.farmers ?? []}
              keyExtractor={(f) => f.id}
              contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
              ItemSeparatorComponent={() => <View className="h-2" />}
              renderItem={({ item }) => {
                const selected = item.id === value?.id
                return (
                  <TouchableOpacity
                    onPress={() => {
                      onChange({ id: item.id, fullName: item.fullName, phoneNumber: item.phoneNumber })
                      setOpen(false)
                    }}
                    className={`flex-row items-center justify-between rounded-2xl p-4 border ${selected ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}
                  >
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-900">{item.fullName}</Text>
                      {item.phoneNumber || item.location ? (
                        <Text className="text-gray-500 text-sm">{item.phoneNumber ?? item.location}</Text>
                      ) : null}
                    </View>
                    {selected ? <Check size={20} color="#16A34A" /> : null}
                  </TouchableOpacity>
                )
              }}
            />
          )}
        </SafeAreaView>
      </Modal>
    </>
  )
}
