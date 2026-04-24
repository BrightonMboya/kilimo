import React from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { X } from 'lucide-react-native'
import { trpc } from '../../../utils/api'

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize = 'sentences',
}: {
  label: string
  value: string
  onChangeText: (v: string) => void
  placeholder?: string
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric'
  autoCapitalize?: 'none' | 'sentences' | 'words'
}) {
  return (
    <View>
      <Text className="text-gray-700 font-medium mb-2">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-base"
      />
    </View>
  )
}

export default function NewFarmer() {
  const router = useRouter()
  const utils = trpc.useUtils()

  const [fullName, setFullName] = React.useState('')
  const [phoneNumber, setPhoneNumber] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [location, setLocation] = React.useState('')
  const [farmSize, setFarmSize] = React.useState('')
  const [crops, setCrops] = React.useState('')

  const createMutation = trpc.coopFarmers.create.useMutation({
    onSuccess: async (farmer) => {
      await utils.coopFarmers.list.invalidate()
      router.replace(`/farmers/${farmer.id}`)
    },
    onError: (err) => {
      Alert.alert('Could not save farmer', err.message)
    },
  })

  const onSave = () => {
    if (!fullName.trim()) {
      Alert.alert('Name required', 'Please enter the farmer\'s full name.')
      return
    }

    const size = farmSize.trim() ? Number(farmSize) : undefined
    if (size !== undefined && (isNaN(size) || size <= 0)) {
      Alert.alert('Invalid farm size', 'Farm size must be a positive number.')
      return
    }

    createMutation.mutate({
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim() || undefined,
      email: email.trim() || undefined,
      location: location.trim() || undefined,
      farmSizeHa: size,
      crops: crops.trim() || undefined,
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2">
          <X size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">New Farmer</Text>
        <TouchableOpacity
          onPress={onSave}
          disabled={createMutation.isPending}
          className={`px-4 py-2 rounded-lg ${createMutation.isPending ? 'bg-gray-300' : 'bg-green-700 active:bg-green-800'}`}
        >
          <Text className="text-white font-semibold">
            {createMutation.isPending ? 'Saving…' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ padding: 24, gap: 20 }} keyboardShouldPersistTaps="handled">
          <Field label="Full Name *" value={fullName} onChangeText={setFullName} placeholder="Jane Mwangi" autoCapitalize="words" />
          <Field label="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} placeholder="+254 700 000 000" keyboardType="phone-pad" />
          <Field label="Email" value={email} onChangeText={setEmail} placeholder="jane@example.com" keyboardType="email-address" autoCapitalize="none" />
          <Field label="Location" value={location} onChangeText={setLocation} placeholder="Kiambu, Kenya" />
          <Field label="Farm Size (ha)" value={farmSize} onChangeText={setFarmSize} placeholder="2.5" keyboardType="numeric" />
          <Field label="Crops" value={crops} onChangeText={setCrops} placeholder="Coffee, Maize" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
