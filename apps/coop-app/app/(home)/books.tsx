import { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Modal,
  ActivityIndicator, RefreshControl
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Search, Plus, X, Receipt, QrCode, Scale, CheckCircle, Clock } from 'lucide-react-native'
import { trpc } from '../../utils/api'

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pending_payment: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Pending' },
  confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Confirmed' },
  paid: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Paid' },
}

export default function BooksScreen() {
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Form
  const [selectedFarmerId, setSelectedFarmerId] = useState('')
  const [selectedFarmerName, setSelectedFarmerName] = useState('')
  const [selectedCollectionId, setSelectedCollectionId] = useState('')
  const [selectedLotCode, setSelectedLotCode] = useState('')
  const [selectedWeightKg, setSelectedWeightKg] = useState(0)
  const [manualWeightKg, setManualWeightKg] = useState('')
  const [pricePerKg, setPricePerKg] = useState('')
  const [deductions, setDeductions] = useState('')
  const [currency, setCurrency] = useState('KES')
  const [paymentNotes, setPaymentNotes] = useState('')

  // Pickers
  const [showFarmerPicker, setShowFarmerPicker] = useState(false)
  const [showLotPicker, setShowLotPicker] = useState(false)
  const [farmerSearch, setFarmerSearch] = useState('')

  const utils = trpc.useUtils()
  const paymentsQuery = trpc.payments.list.useQuery({ search: search || undefined })
  const summaryQuery = trpc.payments.summary.useQuery()
  const farmersQuery = trpc.coopFarmers.list.useQuery(
    { search: farmerSearch || undefined, limit: 20 },
    { enabled: showFarmerPicker || showAdd }
  )
  const collectionsQuery = trpc.collection.list.useQuery(
    { search: selectedFarmerName || undefined, limit: 20 },
    { enabled: showLotPicker }
  )

  const createMutation = trpc.payments.create.useMutation({
    onSuccess: () => {
      utils.payments.list.invalidate()
      utils.payments.summary.invalidate()
      setShowAdd(false)
      resetForm()
    },
  })

  const confirmMutation = trpc.payments.confirm.useMutation({
    onSuccess: () => {
      utils.payments.list.invalidate()
      utils.payments.summary.invalidate()
    },
  })

  const resetForm = () => {
    setSelectedFarmerId('')
    setSelectedFarmerName('')
    setSelectedCollectionId('')
    setSelectedLotCode('')
    setSelectedWeightKg(0)
    setManualWeightKg('')
    setPricePerKg('')
    setDeductions('')
    setCurrency('KES')
    setPaymentNotes('')
    setFarmerSearch('')
  }

  const effectiveWeightKg = selectedWeightKg > 0 ? selectedWeightKg : (parseFloat(manualWeightKg) || 0)

  const calculatedAmount = () => {
    const price = parseFloat(pricePerKg) || 0
    const ded = parseFloat(deductions) || 0
    return Math.max(0, effectiveWeightKg * price - ded)
  }

  const handleCreate = () => {
    if (!selectedFarmerId || !pricePerKg || effectiveWeightKg <= 0) return
    createMutation.mutate({
      coopFarmerId: selectedFarmerId,
      collectionId: selectedCollectionId || undefined,
      pricePerKg: parseFloat(pricePerKg),
      weightKg: effectiveWeightKg,
      deductions: parseFloat(deductions) || 0,
      currency,
      notes: paymentNotes.trim() || undefined,
    })
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await Promise.all([paymentsQuery.refetch(), summaryQuery.refetch()])
    setRefreshing(false)
  }

  const payments = paymentsQuery.data?.payments ?? []
  const summary = summaryQuery.data

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="bg-white px-5 pt-4 pb-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-xl font-bold text-gray-900">Books</Text>
          <TouchableOpacity
            onPress={() => setShowAdd(true)}
            className="bg-emerald-700 rounded-xl px-4 py-2.5 flex-row items-center gap-2"
          >
            <Plus size={16} color="white" />
            <Text className="text-white font-semibold text-sm">Add</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center bg-gray-100 rounded-xl px-3 py-2.5">
          <Search size={18} color="#9CA3AF" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search payments..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-sm text-gray-800"
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-5 pt-3"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#065F46" />
        }
      >
        {/* Summary Cards */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <Text className="text-xs text-gray-500 mb-1">Total Paid</Text>
            <Text className="text-lg font-bold text-emerald-800">
              {(summary?.totalPaid ?? 0).toLocaleString()}
            </Text>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <Text className="text-xs text-gray-500 mb-1">Pending</Text>
            <Text className="text-lg font-bold text-amber-700">
              {summary?.pendingCount ?? 0}
            </Text>
          </View>
        </View>

        {/* Pricing Model Info */}
        <View className="bg-emerald-50 rounded-2xl p-4 mb-4 border border-emerald-100">
          <Text className="text-sm font-semibold text-emerald-800 mb-1">Pricing Model</Text>
          <Text className="text-xs text-emerald-700 font-mono">
            Amount = (Weight kg x Price/kg) - Deductions
          </Text>
        </View>

        {/* Payment List */}
        {paymentsQuery.isLoading ? (
          <ActivityIndicator size="large" color="#065F46" className="mt-10" />
        ) : payments.length === 0 ? (
          <View className="items-center justify-center mt-16">
            <View className="w-16 h-16 bg-emerald-50 rounded-full items-center justify-center mb-4">
              <Receipt size={32} color="#065F46" />
            </View>
            <Text className="text-gray-500 text-base">No payments recorded yet</Text>
            <Text className="text-gray-400 text-sm mt-1">Tap "Add" to record a payment</Text>
          </View>
        ) : (
          payments.map((payment) => {
            const statusStyle = STATUS_STYLES[payment.status] ?? STATUS_STYLES.pending_payment
            return (
              <View key={payment.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-semibold text-gray-900">
                    {payment.coopFarmer?.fullName ?? 'Unknown'}
                  </Text>
                  <View className={`${statusStyle.bg} rounded-lg px-2 py-1`}>
                    <Text className={`text-xs font-medium ${statusStyle.text}`}>{statusStyle.label}</Text>
                  </View>
                </View>

                <View className="gap-1 mb-2">
                  {payment.collection && (
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-gray-500">Lot</Text>
                      <Text className="text-xs font-mono text-gray-700">{payment.collection.lotCode}</Text>
                    </View>
                  )}
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-gray-500">Price/kg</Text>
                    <Text className="text-xs text-gray-700">{payment.pricePerKg} {payment.currency}</Text>
                  </View>
                  {payment.collection?.weightKg && (
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-gray-500">Weight</Text>
                      <Text className="text-xs text-gray-700">{payment.collection.weightKg} kg</Text>
                    </View>
                  )}
                </View>

                <View className="flex-row items-center justify-between pt-2 border-t border-gray-100">
                  <Text className="text-sm font-bold text-emerald-800">
                    {payment.totalAmount.toLocaleString()} {payment.currency}
                  </Text>
                  <View className="flex-row gap-2">
                    {payment.status === 'pending_payment' && (
                      <TouchableOpacity
                        onPress={() => confirmMutation.mutate({ id: payment.id, status: 'confirmed' })}
                        className="bg-blue-50 rounded-lg px-3 py-1.5"
                      >
                        <Text className="text-xs text-blue-700 font-medium">Confirm</Text>
                      </TouchableOpacity>
                    )}
                    {(payment.status === 'pending_payment' || payment.status === 'confirmed') && (
                      <TouchableOpacity
                        onPress={() => confirmMutation.mutate({ id: payment.id, status: 'paid' })}
                        className="bg-emerald-50 rounded-lg px-3 py-1.5"
                      >
                        <Text className="text-xs text-emerald-700 font-medium">Mark Paid</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            )
          })
        )}
        <View className="h-6" />
      </ScrollView>

      {/* Add Payment Modal */}
      <Modal visible={showAdd} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-900">Add Payment</Text>
            <TouchableOpacity onPress={() => { setShowAdd(false); resetForm() }}>
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
            <View className="gap-4">
              {/* Farmer */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Farmer *</Text>
                <TouchableOpacity
                  onPress={() => setShowFarmerPicker(true)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row items-center justify-between"
                >
                  <Text className={selectedFarmerName ? 'text-gray-900 text-base' : 'text-gray-400 text-base'}>
                    {selectedFarmerName || 'Select a farmer'}
                  </Text>
                  <QrCode size={18} color="#065F46" />
                </TouchableOpacity>
              </View>

              {/* Lot */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Lot (optional)</Text>
                <TouchableOpacity
                  onPress={() => selectedFarmerId ? setShowLotPicker(true) : null}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row items-center justify-between"
                >
                  <Text className={selectedLotCode ? 'text-gray-900 text-base font-mono' : 'text-gray-400 text-base'}>
                    {selectedLotCode || 'Link to a collection lot'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Weight - from lot or manual */}
              {selectedWeightKg > 0 ? (
                <View className="bg-emerald-50 rounded-xl p-3 flex-row items-center gap-2">
                  <Scale size={16} color="#065F46" />
                  <Text className="text-sm text-emerald-800 font-medium">
                    Weight from lot: {selectedWeightKg} kg
                  </Text>
                </View>
              ) : (
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1.5">Weight (kg) *</Text>
                  <TextInput
                    value={manualWeightKg}
                    onChangeText={setManualWeightKg}
                    placeholder="Enter weight in kg"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                  />
                </View>
              )}

              {/* Price per kg */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Price per kg *</Text>
                <TextInput
                  value={pricePerKg}
                  onChangeText={setPricePerKg}
                  placeholder="e.g. 150"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                />
              </View>

              {/* Deductions */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Deductions</Text>
                <TextInput
                  value={deductions}
                  onChangeText={setDeductions}
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                />
              </View>

              {/* Currency */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Currency</Text>
                <View className="flex-row gap-2">
                  {['KES', 'USD', 'MAD', 'EUR'].map((c) => (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setCurrency(c)}
                      className={`flex-1 py-3 rounded-xl items-center border ${
                        currency === c ? 'bg-emerald-700 border-emerald-700' : 'bg-white border-gray-200'
                      }`}
                    >
                      <Text className={`text-sm font-medium ${currency === c ? 'text-white' : 'text-gray-700'}`}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Auto-calc preview */}
              {pricePerKg && effectiveWeightKg > 0 && (
                <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <Text className="text-xs text-gray-500 mb-1">Calculated Amount</Text>
                  <Text className="text-2xl font-bold text-emerald-800">
                    {calculatedAmount().toLocaleString()} {currency}
                  </Text>
                  <Text className="text-xs text-gray-400 mt-1">
                    {effectiveWeightKg} kg x {pricePerKg} {currency}/kg{parseFloat(deductions) > 0 ? ` - ${deductions} deductions` : ''}
                  </Text>
                </View>
              )}

              {/* Notes */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Notes</Text>
                <TextInput
                  value={paymentNotes}
                  onChangeText={setPaymentNotes}
                  placeholder="Optional notes..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                  style={{ textAlignVertical: 'top' }}
                />
              </View>
            </View>
          </ScrollView>

          <View className="px-5 py-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={handleCreate}
              disabled={!selectedFarmerId || !pricePerKg || effectiveWeightKg <= 0 || createMutation.isPending}
              className={`rounded-xl py-4 items-center ${
                selectedFarmerId && pricePerKg && effectiveWeightKg > 0 ? 'bg-emerald-700' : 'bg-gray-300'
              }`}
            >
              {createMutation.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">Record Payment</Text>
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
                placeholder="Search farmers..."
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
                <View className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center">
                  <QrCode size={18} color="#065F46" />
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-gray-900">{farmer.fullName}</Text>
                  <Text className="text-xs text-gray-500">{farmer.location ?? 'No location'}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Lot Picker Modal */}
      <Modal visible={showLotPicker} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView className="flex-1 bg-white">
          <View className="px-5 py-4 border-b border-gray-200">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-gray-900">Select Lot</Text>
              <TouchableOpacity onPress={() => setShowLotPicker(false)}>
                <X size={24} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView className="flex-1 px-5 pt-3">
            {(collectionsQuery.data?.collections ?? []).map((col) => (
              <TouchableOpacity
                key={col.id}
                onPress={() => {
                  setSelectedCollectionId(col.id)
                  setSelectedLotCode(col.lotCode)
                  setSelectedWeightKg(col.weightKg)
                  setShowLotPicker(false)
                }}
                className="bg-white rounded-xl p-4 mb-2 border border-gray-100"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="font-mono text-sm text-gray-800">{col.lotCode}</Text>
                  <Text className="text-sm font-bold text-emerald-800">{col.weightKg} kg</Text>
                </View>
                <Text className="text-xs text-gray-500 mt-1">
                  {col.crop}{col.variety ? ` - ${col.variety}` : ''} - {col.coopFarmer?.fullName}
                </Text>
              </TouchableOpacity>
            ))}
            {(collectionsQuery.data?.collections ?? []).length === 0 && (
              <Text className="text-center text-gray-400 mt-10">No lots found for this farmer</Text>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}
