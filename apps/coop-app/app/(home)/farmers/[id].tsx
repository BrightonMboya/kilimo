import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft, Phone, Mail, MapPin, Ruler, Sprout, Trash2, Plus, X, Navigation } from 'lucide-react-native'
import QRCode from 'react-native-qrcode-svg'
import * as Location from 'expo-location'
import { trpc } from '../../../utils/api'

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
  if (!value) return null
  return (
    <View className="flex-row items-center py-3 border-b border-gray-100">
      <View className="w-8">{icon}</View>
      <View className="flex-1">
        <Text className="text-xs text-gray-500">{label}</Text>
        <Text className="text-gray-900 font-medium">{value}</Text>
      </View>
    </View>
  )
}

function AddFieldModal({
  visible,
  onClose,
  farmerId,
}: {
  visible: boolean
  onClose: () => void
  farmerId: string
}) {
  const utils = trpc.useUtils()
  const [name, setName] = React.useState('')
  const [crop, setCrop] = React.useState('')
  const [variety, setVariety] = React.useState('')
  const [size, setSize] = React.useState('')
  const [lat, setLat] = React.useState<number | null>(null)
  const [lng, setLng] = React.useState<number | null>(null)
  const [capturingGps, setCapturingGps] = React.useState(false)

  const reset = () => {
    setName('')
    setCrop('')
    setVariety('')
    setSize('')
    setLat(null)
    setLng(null)
  }

  const mutation = trpc.coopFarmers.addField.useMutation({
    onSuccess: async () => {
      await utils.coopFarmers.getById.invalidate({ id: farmerId })
      reset()
      onClose()
    },
    onError: (err) => Alert.alert('Could not add field', err.message),
  })

  const captureGps = async () => {
    setCapturingGps(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Location denied', 'Enable location access in Settings to tag fields.')
        return
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
      setLat(pos.coords.latitude)
      setLng(pos.coords.longitude)
    } catch (err: any) {
      Alert.alert('Could not get location', err.message ?? 'Try again outside.')
    } finally {
      setCapturingGps(false)
    }
  }

  const onSave = () => {
    if (!name.trim()) return Alert.alert('Name required', 'Please enter a name for this field.')
    if (!crop.trim()) return Alert.alert('Crop required', 'Please enter the crop being grown.')
    const sizeNum = Number(size)
    if (!size.trim() || isNaN(sizeNum) || sizeNum <= 0) {
      return Alert.alert('Invalid size', 'Size must be a positive number in hectares.')
    }

    mutation.mutate({
      coopFarmerId: farmerId,
      name: name.trim(),
      crop: crop.trim(),
      variety: variety.trim() || undefined,
      sizeHa: sizeNum,
      latitude: lat ?? undefined,
      longitude: lng ?? undefined,
    })
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
          <TouchableOpacity onPress={onClose} className="w-10 h-10 items-center justify-center -ml-2">
            <X size={24} color="#111827" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">New Field</Text>
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
              <Text className="text-gray-700 font-medium mb-2">Field Name *</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Upper Plot, West Field, etc."
                placeholderTextColor="#9CA3AF"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-base"
              />
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
              <Text className="text-gray-700 font-medium mb-2">Size (hectares) *</Text>
              <TextInput
                value={size}
                onChangeText={setSize}
                placeholder="1.25"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-base"
              />
            </View>

            <View>
              <Text className="text-gray-700 font-medium mb-2">GPS Location</Text>
              <TouchableOpacity
                onPress={captureGps}
                disabled={capturingGps}
                className="flex-row items-center justify-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 active:bg-gray-100"
              >
                {capturingGps ? (
                  <ActivityIndicator size="small" color="#16A34A" />
                ) : (
                  <Navigation size={18} color="#16A34A" />
                )}
                <Text className="ml-2 text-gray-900 font-medium">
                  {capturingGps
                    ? 'Getting location…'
                    : lat !== null && lng !== null
                      ? `Captured: ${lat.toFixed(5)}, ${lng.toFixed(5)}`
                      : 'Capture from my location'}
                </Text>
              </TouchableOpacity>
              {lat !== null && lng !== null ? (
                <TouchableOpacity onPress={() => { setLat(null); setLng(null) }} className="mt-2">
                  <Text className="text-gray-500 text-sm text-center">Clear location</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  )
}

export default function FarmerDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const utils = trpc.useUtils()
  const [addFieldOpen, setAddFieldOpen] = React.useState(false)

  const { data: farmer, isLoading, error } = trpc.coopFarmers.getById.useQuery({ id })

  const deleteMutation = trpc.coopFarmers.delete.useMutation({
    onSuccess: async () => {
      await utils.coopFarmers.list.invalidate()
      router.back()
    },
    onError: (err) => Alert.alert('Could not delete', err.message),
  })

  const removeFieldMutation = trpc.coopFarmers.removeField.useMutation({
    onSuccess: () => utils.coopFarmers.getById.invalidate({ id }),
    onError: (err) => Alert.alert('Could not remove field', err.message),
  })

  const onDelete = () => {
    Alert.alert(
      'Delete farmer?',
      `This will permanently remove ${farmer?.fullName} and their records. This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate({ id }) },
      ],
    )
  }

  const onRemoveField = (fieldId: string, fieldName: string) => {
    Alert.alert(
      'Remove field?',
      `Remove "${fieldName}" from this farmer?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFieldMutation.mutate({ id: fieldId }) },
      ],
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#16A34A" />
      </SafeAreaView>
    )
  }

  if (error || !farmer) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center px-6 py-4">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2">
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
        </View>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-gray-900 font-semibold text-lg mb-1">Farmer not found</Text>
          <Text className="text-gray-500 text-center">{error?.message ?? 'This farmer may have been removed.'}</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2">
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} className="w-10 h-10 items-center justify-center">
          <Trash2 size={22} color="#DC2626" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48 }}>
        <View className="items-center mb-6">
          <View className="w-20 h-20 bg-green-50 rounded-full items-center justify-center mb-3">
            <Text className="text-green-700 font-bold text-2xl">
              {farmer.fullName?.[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900">{farmer.fullName}</Text>
          {farmer.isLinked ? (
            <View className="mt-2 px-3 py-1 bg-green-100 rounded-full">
              <Text className="text-green-700 text-xs font-semibold">Linked to Farm App</Text>
            </View>
          ) : null}
        </View>

        <View className="bg-white border border-gray-100 rounded-2xl p-5 items-center mb-6">
          <Text className="text-xs text-gray-500 mb-3">Farmer QR ID</Text>
          <View className="bg-white p-3 rounded-xl">
            <QRCode value={farmer.qrCode} size={160} />
          </View>
          <Text className="text-gray-400 text-xs mt-3 font-mono">{farmer.qrCode}</Text>
        </View>

        <View className="bg-white border border-gray-100 rounded-2xl px-4 mb-6">
          <InfoRow icon={<Phone size={18} color="#6B7280" />} label="Phone" value={farmer.phoneNumber} />
          <InfoRow icon={<Mail size={18} color="#6B7280" />} label="Email" value={farmer.email} />
          <InfoRow icon={<MapPin size={18} color="#6B7280" />} label="Location" value={farmer.location} />
          <InfoRow icon={<Ruler size={18} color="#6B7280" />} label="Farm Size" value={farmer.farmSizeHa ? `${farmer.farmSizeHa} ha` : null} />
          <InfoRow icon={<Sprout size={18} color="#6B7280" />} label="Crops" value={farmer.crops} />
        </View>

        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-green-50 border border-green-100 rounded-2xl p-4">
            <Text className="text-xs text-gray-500 mb-1">Lots collected</Text>
            <Text className="text-2xl font-bold text-gray-900">{farmer.collections.length}</Text>
          </View>
          <View className="flex-1 bg-green-50 border border-green-100 rounded-2xl p-4">
            <Text className="text-xs text-gray-500 mb-1">Fields</Text>
            <Text className="text-2xl font-bold text-gray-900">{farmer.fields.length}</Text>
          </View>
        </View>

        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-gray-900">Fields</Text>
          <TouchableOpacity
            onPress={() => setAddFieldOpen(true)}
            className="flex-row items-center px-3 py-2 bg-green-50 rounded-xl"
          >
            <Plus size={16} color="#16A34A" />
            <Text className="text-green-700 font-medium ml-1">Add</Text>
          </TouchableOpacity>
        </View>

        {farmer.fields.length === 0 ? (
          <View className="bg-gray-50 border border-gray-100 rounded-2xl p-6 items-center">
            <Text className="text-gray-500 text-center">
              No fields registered yet. Tap "Add" to register the first field.
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {farmer.fields.map((field) => (
              <View key={field.id} className="bg-white border border-gray-100 rounded-2xl p-4">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900">{field.name}</Text>
                    <Text className="text-gray-500 text-sm mt-0.5">
                      {field.crop}
                      {field.variety ? ` · ${field.variety}` : ''} · {field.sizeHa} ha
                    </Text>
                    {field.latitude !== null && field.longitude !== null ? (
                      <View className="flex-row items-center mt-2">
                        <MapPin size={12} color="#16A34A" />
                        <Text className="text-green-700 text-xs ml-1 font-mono">
                          {field.latitude?.toFixed(5)}, {field.longitude?.toFixed(5)}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    onPress={() => onRemoveField(field.id, field.name)}
                    className="w-8 h-8 items-center justify-center"
                  >
                    <Trash2 size={18} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <AddFieldModal visible={addFieldOpen} onClose={() => setAddFieldOpen(false)} farmerId={id} />
    </SafeAreaView>
  )
}
