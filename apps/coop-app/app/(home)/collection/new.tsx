import React from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { X } from 'lucide-react-native'
import { trpc } from '../../../utils/api'
import { FarmerPicker } from '../../../components/FarmerPicker'

type Grade = 'A' | 'B' | 'C'

export default function NewCollection() {
  const router = useRouter()
  const utils = trpc.useUtils()

  const [farmer, setFarmer] = React.useState<{ id: string; fullName: string; phoneNumber?: string | null } | null>(null)
  const [crop, setCrop] = React.useState('')
  const [variety, setVariety] = React.useState('')
  const [weightKg, setWeightKg] = React.useState('')
  const [grade, setGrade] = React.useState<Grade>('B')
  const [notes, setNotes] = React.useState('')

  const mutation = trpc.collection.create.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.collection.list.invalidate(),
        utils.collection.todayStats.invalidate(),
        utils.coop.dashboard.invalidate(),
      ])
      router.back()
    },
    onError: (err) => Alert.alert('Could not record lot', err.message),
  })

  const onSave = () => {
    if (!farmer) return Alert.alert('Farmer required', 'Please select a farmer.')
    if (!crop.trim()) return Alert.alert('Crop required', 'Please enter the crop name.')
    const weight = Number(weightKg)
    if (!weightKg.trim() || isNaN(weight) || weight <= 0) {
      return Alert.alert('Invalid weight', 'Weight must be a positive number in kg.')
    }

    mutation.mutate({
      coopFarmerId: farmer.id,
      crop: crop.trim(),
      variety: variety.trim() || undefined,
      weightKg: weight,
      quantity: weight,
      unit: 'kg',
      qualityGrade: grade,
      notes: notes.trim() || undefined,
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2">
          <X size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">New Lot</Text>
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

          <View>
            <Text className="text-gray-700 font-medium mb-2">Crop *</Text>
            <TextInput
              value={crop}
              onChangeText={setCrop}
              placeholder="Coffee, Maize, Tea"
              placeholderTextColor="#9CA3AF"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-base"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Variety</Text>
            <TextInput
              value={variety}
              onChangeText={setVariety}
              placeholder="SL28, H614, etc."
              placeholderTextColor="#9CA3AF"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-base"
            />
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
            <Text className="text-gray-700 font-medium mb-2">Quality Grade</Text>
            <View className="flex-row gap-2">
              {(['A', 'B', 'C'] as Grade[]).map((g) => {
                const selected = g === grade
                return (
                  <TouchableOpacity
                    key={g}
                    onPress={() => setGrade(g)}
                    className={`flex-1 py-3 rounded-xl border items-center ${selected ? 'bg-green-700 border-green-700' : 'bg-white border-gray-200'}`}
                  >
                    <Text className={`font-semibold ${selected ? 'text-white' : 'text-gray-700'}`}>Grade {g}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Notes</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Any observations…"
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
