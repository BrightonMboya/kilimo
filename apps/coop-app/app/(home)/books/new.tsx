import React from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { X } from 'lucide-react-native'
import { trpc } from '../../../utils/api'
import { FarmerPicker } from '../../../components/FarmerPicker'

export default function NewPayment() {
  const router = useRouter()
  const utils = trpc.useUtils()

  const [farmer, setFarmer] = React.useState<{ id: string; fullName: string; phoneNumber?: string | null } | null>(null)
  const [pricePerKg, setPricePerKg] = React.useState('')
  const [weightKg, setWeightKg] = React.useState('')
  const [deductions, setDeductions] = React.useState('')
  const [currency, setCurrency] = React.useState('KES')
  const [notes, setNotes] = React.useState('')

  const total = React.useMemo(() => {
    const price = Number(pricePerKg)
    const weight = Number(weightKg)
    const deduct = Number(deductions) || 0
    if (isNaN(price) || isNaN(weight) || price <= 0 || weight <= 0) return null
    return Math.max(0, price * weight - deduct)
  }, [pricePerKg, weightKg, deductions])

  const mutation = trpc.payments.create.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.payments.list.invalidate(),
        utils.payments.summary.invalidate(),
      ])
      router.back()
    },
    onError: (err) => Alert.alert('Could not record payment', err.message),
  })

  const onSave = () => {
    if (!farmer) return Alert.alert('Farmer required', 'Please select a farmer.')
    const price = Number(pricePerKg)
    const weight = Number(weightKg)
    const deduct = Number(deductions) || 0
    if (!pricePerKg.trim() || isNaN(price) || price <= 0) {
      return Alert.alert('Invalid price', 'Price per kg must be a positive number.')
    }
    if (!weightKg.trim() || isNaN(weight) || weight <= 0) {
      return Alert.alert('Invalid weight', 'Weight must be a positive number in kg.')
    }
    if (deduct < 0) {
      return Alert.alert('Invalid deductions', 'Deductions must be zero or positive.')
    }

    mutation.mutate({
      coopFarmerId: farmer.id,
      pricePerKg: price,
      weightKg: weight,
      deductions: deduct,
      currency,
      notes: notes.trim() || undefined,
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2">
          <X size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">New Payment</Text>
        <TouchableOpacity
          onPress={onSave}
          disabled={mutation.isPending}
          className={`px-4 py-2 rounded-lg ${mutation.isPending ? 'bg-gray-300' : 'bg-green-700 active:bg-green-800'}`}
        >
          <Text className="text-white font-semibold">
            {mutation.isPending ? 'Saving…' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView contentContainerStyle={{ padding: 24, gap: 20 }} keyboardShouldPersistTaps="handled">
          <View>
            <Text className="text-gray-700 font-medium mb-2">Farmer *</Text>
            <FarmerPicker value={farmer} onChange={setFarmer} />
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-gray-700 font-medium mb-2">Price / kg *</Text>
              <TextInput
                value={pricePerKg}
                onChangeText={setPricePerKg}
                placeholder="120"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-base"
              />
            </View>
            <View className="w-24">
              <Text className="text-gray-700 font-medium mb-2">Currency</Text>
              <TextInput
                value={currency}
                onChangeText={setCurrency}
                autoCapitalize="characters"
                maxLength={5}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-base"
              />
            </View>
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Weight (kg) *</Text>
            <TextInput
              value={weightKg}
              onChangeText={setWeightKg}
              placeholder="45.5"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-base"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Deductions</Text>
            <TextInput
              value={deductions}
              onChangeText={setDeductions}
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-base"
            />
          </View>

          {total !== null ? (
            <View className="bg-green-50 border border-green-100 rounded-2xl p-4">
              <Text className="text-xs text-gray-500 mb-1">Total to pay</Text>
              <Text className="text-3xl font-bold text-gray-900">
                {currency} {total.toLocaleString()}
              </Text>
            </View>
          ) : null}

          <View>
            <Text className="text-gray-700 font-medium mb-2">Notes</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Advance, adjustment, etc."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-base"
              style={{ textAlignVertical: 'top', minHeight: 80 }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
