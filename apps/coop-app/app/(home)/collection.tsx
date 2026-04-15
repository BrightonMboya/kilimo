import { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Modal,
  ActivityIndicator, RefreshControl
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Search, Plus, X, Package, QrCode, Scale, Leaf } from 'lucide-react-native'
import { trpc } from '../../utils/api'

const GRADE_COLORS: Record<string, { bg: string; text: string }> = {
  A: { bg: 'bg-green-50', text: 'text-green-700' },
  B: { bg: 'bg-amber-50', text: 'text-amber-700' },
  C: { bg: 'bg-red-50', text: 'text-red-700' },
}

export default function CollectionScreen() {
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Form state
  const [selectedFarmerId, setSelectedFarmerId] = useState('')
  const [crop, setCrop] = useState('')
  const [variety, setVariety] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('kg')
  const [weightKg, setWeightKg] = useState('')
  const [grade, setGrade] = useState<'A' | 'B' | 'C'>('B')
  const [notes, setNotes] = useState('')

  // Farmer picker
  const [farmerSearch, setFarmerSearch] = useState('')
  const [showFarmerPicker, setShowFarmerPicker] = useState(false)
  const [selectedFarmerName, setSelectedFarmerName] = useState('')

  const utils = trpc.useUtils()
  const collectionsQuery = trpc.collection.list.useQuery({ search: search || undefined })
  const farmersQuery = trpc.coopFarmers.list.useQuery(
    { search: farmerSearch || undefined, limit: 20 },
    { enabled: showFarmerPicker || showAdd }
  )

  const createMutation = trpc.collection.create.useMutation({
    onSuccess: () => {
      utils.collection.list.invalidate()
      utils.collection.todayStats.invalidate()
      utils.coop.dashboard.invalidate()
      setShowAdd(false)
      resetForm()
    },
  })

  const resetForm = () => {
    setSelectedFarmerId('')
    setSelectedFarmerName('')
    setCrop('')
    setVariety('')
    setQuantity('')
    setUnit('kg')
    setWeightKg('')
    setGrade('B')
    setNotes('')
    setFarmerSearch('')
  }

  const handleCreate = () => {
    if (!selectedFarmerId || !crop.trim() || !quantity || !weightKg) return
    createMutation.mutate({
      coopFarmerId: selectedFarmerId,
      crop: crop.trim(),
      variety: variety.trim() || undefined,
      quantity: parseFloat(quantity),
      unit,
      weightKg: parseFloat(weightKg),
      qualityGrade: grade,
      notes: notes.trim() || undefined,
    })
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await collectionsQuery.refetch()
    setRefreshing(false)
  }

  const collections = collectionsQuery.data?.collections ?? []

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="bg-white px-5 pt-4 pb-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-xl font-bold text-gray-900">Collection</Text>
          <TouchableOpacity
            onPress={() => setShowAdd(true)}
            className="bg-green-700 rounded-xl px-4 py-2.5 flex-row items-center gap-2"
          >
            <Plus size={16} color="white" />
            <Text className="text-white font-semibold text-sm">New</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center bg-gray-100 rounded-xl px-3 py-2.5">
          <Search size={18} color="#9CA3AF" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search lots, crops, farmers..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-sm text-gray-800"
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-5 pt-3"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#16A34A" />
        }
      >
        {/* KDE Info Card */}
        <View className="bg-green-50 rounded-2xl p-4 mb-4 border border-green-100">
          <Text className="text-sm font-semibold text-green-800 mb-2">Captured at collection</Text>
          <View className="flex-row flex-wrap gap-x-6 gap-y-1">
            <Text className="text-xs text-green-700">Quantity + Weight</Text>
            <Text className="text-xs text-green-700">Quality Grade</Text>
            <Text className="text-xs text-green-700">Crop + Variety</Text>
            <Text className="text-xs text-green-700">Farmer ID + QR</Text>
            <Text className="text-xs text-green-700">Date + Location</Text>
          </View>
        </View>

        {collectionsQuery.isLoading ? (
          <ActivityIndicator size="large" color="#16A34A" className="mt-10" />
        ) : collections.length === 0 ? (
          <View className="items-center justify-center mt-16">
            <View className="w-16 h-16 bg-green-50 rounded-full items-center justify-center mb-4">
              <Package size={32} color="#16A34A" />
            </View>
            <Text className="text-gray-500 text-base">No collections yet</Text>
            <Text className="text-gray-400 text-sm mt-1">Tap "New" to record a produce lot</Text>
          </View>
        ) : (
          collections.map((col) => {
            const gradeStyle = GRADE_COLORS[col.qualityGrade] ?? GRADE_COLORS.B
            return (
              <View key={col.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center gap-2">
                    <Text className="font-mono text-xs text-gray-500">{col.lotCode}</Text>
                    <View className={`${gradeStyle.bg} rounded-md px-2 py-0.5`}>
                      <Text className={`text-xs font-bold ${gradeStyle.text}`}>Grade {col.qualityGrade}</Text>
                    </View>
                  </View>
                  <Text className="text-xs text-gray-400">
                    {new Date(col.date).toLocaleDateString()}
                  </Text>
                </View>

                <View className="flex-row items-center gap-2 mb-2">
                  <Leaf size={14} color="#16A34A" />
                  <Text className="text-sm font-medium text-gray-900">
                    {col.crop}{col.variety ? ` - ${col.variety}` : ''}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-500">
                    {col.coopFarmer?.fullName ?? 'Unknown'}
                  </Text>
                  <View className="flex-row items-center gap-1">
                    <Scale size={14} color="#16A34A" />
                    <Text className="text-sm font-bold text-green-800">{col.weightKg} kg</Text>
                  </View>
                </View>

                {col.payment && (
                  <View className="mt-2 pt-2 border-t border-gray-100 flex-row items-center justify-between">
                    <Text className="text-xs text-gray-400">Payment</Text>
                    <Text className={`text-xs font-medium ${col.payment.status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                      {col.payment.status === 'paid' ? 'Paid' : 'Pending'} - {col.payment.totalAmount?.toLocaleString()}
                    </Text>
                  </View>
                )}
              </View>
            )
          })
        )}
        <View className="h-6" />
      </ScrollView>

      {/* New Collection Modal */}
      <Modal visible={showAdd} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-900">New Collection</Text>
            <TouchableOpacity onPress={() => { setShowAdd(false); resetForm() }}>
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
            <View className="gap-4">
              {/* Farmer Selector */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Farmer *</Text>
                <TouchableOpacity
                  onPress={() => setShowFarmerPicker(true)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row items-center justify-between"
                >
                  <Text className={selectedFarmerName ? 'text-gray-900 text-base' : 'text-gray-400 text-base'}>
                    {selectedFarmerName || 'Select a farmer'}
                  </Text>
                  <QrCode size={18} color="#16A34A" />
                </TouchableOpacity>
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Crop *</Text>
                <TextInput
                  value={crop}
                  onChangeText={setCrop}
                  placeholder="e.g. Coffee, Tea, Avocado"
                  placeholderTextColor="#9CA3AF"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Variety</Text>
                <TextInput
                  value={variety}
                  onChangeText={setVariety}
                  placeholder="e.g. SL-28, Hass"
                  placeholderTextColor="#9CA3AF"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                />
              </View>

              {/* Quality Grade */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Quality Grade *</Text>
                <View className="flex-row gap-3">
                  {(['A', 'B', 'C'] as const).map((g) => (
                    <TouchableOpacity
                      key={g}
                      onPress={() => setGrade(g)}
                      className={`flex-1 py-3 rounded-xl items-center border ${
                        grade === g
                          ? 'bg-green-700 border-green-700'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <Text className={`font-bold text-base ${grade === g ? 'text-white' : 'text-gray-700'}`}>
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-1.5">Quantity *</Text>
                  <TextInput
                    value={quantity}
                    onChangeText={setQuantity}
                    placeholder="e.g. 50"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-1.5">Unit</Text>
                  <View className="flex-row gap-2">
                    {['kg', 'crates', 'bags'].map((u) => (
                      <TouchableOpacity
                        key={u}
                        onPress={() => setUnit(u)}
                        className={`flex-1 py-3 rounded-xl items-center border ${
                          unit === u ? 'bg-green-700 border-green-700' : 'bg-white border-gray-200'
                        }`}
                      >
                        <Text className={`text-xs font-medium ${unit === u ? 'text-white' : 'text-gray-700'}`}>{u}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Weight (kg) *</Text>
                <TextInput
                  value={weightKg}
                  onChangeText={setWeightKg}
                  placeholder="Total weight in kg"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Notes</Text>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Any additional notes..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                  style={{ textAlignVertical: 'top' }}
                />
              </View>
            </View>
          </ScrollView>

          <View className="px-5 py-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={handleCreate}
              disabled={!selectedFarmerId || !crop.trim() || !quantity || !weightKg || createMutation.isPending}
              className={`rounded-xl py-4 items-center ${
                selectedFarmerId && crop.trim() && quantity && weightKg ? 'bg-green-700' : 'bg-gray-300'
              }`}
            >
              {createMutation.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">Record Collection</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Farmer Picker Modal */}
      <Modal visible={showFarmerPicker} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView className="flex-1 bg-white">
          <View className="px-5 py-4 border-b border-gray-200">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-gray-900">Select Farmer</Text>
              <TouchableOpacity onPress={() => setShowFarmerPicker(false)}>
                <X size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center bg-gray-100 rounded-xl px-3 py-2.5">
              <Search size={18} color="#9CA3AF" />
              <TextInput
                value={farmerSearch}
                onChangeText={setFarmerSearch}
                placeholder="Search by name or QR code..."
                placeholderTextColor="#9CA3AF"
                className="flex-1 ml-2 text-sm text-gray-800"
                autoFocus
              />
            </View>
          </View>

          <ScrollView className="flex-1 px-5 pt-3">
            {(farmersQuery.data?.farmers ?? []).map((farmer) => (
              <TouchableOpacity
                key={farmer.id}
                onPress={() => {
                  setSelectedFarmerId(farmer.id)
                  setSelectedFarmerName(farmer.fullName)
                  setShowFarmerPicker(false)
                }}
                className="bg-white rounded-xl p-4 mb-2 border border-gray-100 flex-row items-center gap-3"
              >
                <View className="w-10 h-10 rounded-full bg-green-50 items-center justify-center">
                  <QrCode size={18} color="#16A34A" />
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-gray-900">{farmer.fullName}</Text>
                  <Text className="text-xs text-gray-500">{farmer.location ?? 'No location'} - {farmer.qrCode}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}
