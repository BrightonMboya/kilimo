import { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Modal,
  ActivityIndicator, Alert, RefreshControl
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  Search, Plus, ChevronRight, X, QrCode, MapPin, User, Trash2,
  Mail, Send, CheckCircle, Link2, Clock, Leaf
} from 'lucide-react-native'
import { trpc } from '../../utils/api'
import * as Location from 'expo-location'

const ACTIVITY_LABELS: Record<string, string> = {
  planting: 'Planting',
  fertilization: 'Fertilization',
  spraying: 'Spraying',
  irrigation: 'Irrigation',
  weeding: 'Weeding',
  pruning: 'Pruning',
  inspection: 'Inspection',
  harvest: 'Harvest',
  soil_testing: 'Soil Testing',
  other: 'Other',
}

export default function FarmersScreen() {
  const [search, setSearch] = useState('')
  const [showAddFarmer, setShowAddFarmer] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [showAddField, setShowAddField] = useState(false)
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null)
  const [expandedFarmerId, setExpandedFarmerId] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Form state - farmer
  const [farmerName, setFarmerName] = useState('')
  const [farmerPhone, setFarmerPhone] = useState('')
  const [farmerEmail, setFarmerEmail] = useState('')
  const [farmerLocation, setFarmerLocation] = useState('')
  const [farmerFarmSize, setFarmerFarmSize] = useState('')
  const [farmerCrops, setFarmerCrops] = useState('')

  // Form state - invite
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')

  // Form state - field
  const [fieldName, setFieldName] = useState('')
  const [fieldCrop, setFieldCrop] = useState('')
  const [fieldVariety, setFieldVariety] = useState('')
  const [fieldSize, setFieldSize] = useState('')
  const [fieldLat, setFieldLat] = useState('')
  const [fieldLng, setFieldLng] = useState('')

  const utils = trpc.useUtils()
  const farmersQuery = trpc.coopFarmers.list.useQuery({ search: search || undefined })
  const farmerDetailQuery = trpc.coopFarmers.getById.useQuery(
    { id: expandedFarmerId! },
    { enabled: !!expandedFarmerId }
  )
  const sentInvitesQuery = trpc.coopInvites.listSent.useQuery()

  const createFarmerMutation = trpc.coopFarmers.create.useMutation({
    onSuccess: () => {
      utils.coopFarmers.list.invalidate()
      utils.coop.dashboard.invalidate()
      setShowAddFarmer(false)
      resetFarmerForm()
    },
  })

  const deleteFarmerMutation = trpc.coopFarmers.delete.useMutation({
    onSuccess: () => {
      utils.coopFarmers.list.invalidate()
      utils.coop.dashboard.invalidate()
      setExpandedFarmerId(null)
    },
  })

  const sendInviteMutation = trpc.coopInvites.send.useMutation({
    onSuccess: () => {
      utils.coopInvites.listSent.invalidate()
      setShowInvite(false)
      setInviteEmail('')
      setInviteName('')
      Alert.alert('Invite Sent', 'The farmer will see the invite when they open the Farmers App.')
    },
    onError: (err) => {
      Alert.alert('Error', err.message)
    },
  })

  const cancelInviteMutation = trpc.coopInvites.cancel.useMutation({
    onSuccess: () => {
      utils.coopInvites.listSent.invalidate()
    },
  })

  const addFieldMutation = trpc.coopFarmers.addField.useMutation({
    onSuccess: () => {
      utils.coopFarmers.getById.invalidate({ id: selectedFarmerId! })
      utils.coopFarmers.list.invalidate()
      utils.coop.dashboard.invalidate()
      setShowAddField(false)
      resetFieldForm()
    },
  })

  const removeFieldMutation = trpc.coopFarmers.removeField.useMutation({
    onSuccess: () => {
      utils.coopFarmers.getById.invalidate({ id: expandedFarmerId! })
      utils.coopFarmers.list.invalidate()
      utils.coop.dashboard.invalidate()
    },
  })

  const resetFarmerForm = () => {
    setFarmerName(''); setFarmerPhone(''); setFarmerEmail('')
    setFarmerLocation(''); setFarmerFarmSize(''); setFarmerCrops('')
  }

  const resetFieldForm = () => {
    setFieldName(''); setFieldCrop(''); setFieldVariety('')
    setFieldSize(''); setFieldLat(''); setFieldLng('')
  }

  const handleAddFarmer = () => {
    if (!farmerName.trim()) return
    createFarmerMutation.mutate({
      fullName: farmerName.trim(),
      phoneNumber: farmerPhone.trim() || undefined,
      email: farmerEmail.trim() || undefined,
      location: farmerLocation.trim() || undefined,
      farmSizeHa: farmerFarmSize ? parseFloat(farmerFarmSize) : undefined,
      crops: farmerCrops.trim() || undefined,
    })
  }

  const handleSendInvite = () => {
    if (!inviteEmail.trim()) return
    sendInviteMutation.mutate({
      email: inviteEmail.trim(),
      farmerName: inviteName.trim() || undefined,
    })
  }

  const handleAddField = () => {
    if (!fieldName.trim() || !fieldCrop.trim() || !fieldSize || !selectedFarmerId) return
    addFieldMutation.mutate({
      coopFarmerId: selectedFarmerId,
      name: fieldName.trim(),
      crop: fieldCrop.trim(),
      variety: fieldVariety.trim() || undefined,
      sizeHa: parseFloat(fieldSize),
      latitude: fieldLat ? parseFloat(fieldLat) : undefined,
      longitude: fieldLng ? parseFloat(fieldLng) : undefined,
    })
  }

  const handleCaptureGPS = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') return
      const location = await Location.getCurrentPositionAsync({})
      setFieldLat(location.coords.latitude.toFixed(6))
      setFieldLng(location.coords.longitude.toFixed(6))
    } catch (err) {
      console.error('GPS error:', err)
    }
  }

  const handleDeleteFarmer = (id: string, name: string) => {
    Alert.alert('Delete Farmer', `Are you sure you want to delete ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteFarmerMutation.mutate({ id }) },
    ])
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await Promise.all([farmersQuery.refetch(), sentInvitesQuery.refetch()])
    setRefreshing(false)
  }

  const farmers = farmersQuery.data?.farmers ?? []
  const farmerDetail = farmerDetailQuery.data
  const sentInvites = sentInvitesQuery.data ?? []
  const pendingInvites = sentInvites.filter(i => i.status === 'pending_invite')

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="bg-white px-5 pt-4 pb-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-xl font-bold text-gray-900">Farmers</Text>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setShowInvite(true)}
              className="bg-emerald-50 rounded-xl px-3 py-2.5 flex-row items-center gap-1.5"
            >
              <Send size={14} color="#065F46" />
              <Text className="text-emerald-700 font-semibold text-sm">Invite</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowAddFarmer(true)}
              className="bg-emerald-700 rounded-xl px-3 py-2.5 flex-row items-center gap-1.5"
            >
              <Plus size={14} color="white" />
              <Text className="text-white font-semibold text-sm">Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-center bg-gray-100 rounded-xl px-3 py-2.5">
          <Search size={18} color="#9CA3AF" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search farmers..."
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
        {/* Pending Invites */}
        {pendingInvites.length > 0 && (
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-900 mb-2">Pending Invites</Text>
            {pendingInvites.map((invite) => (
              <View key={invite.id} className="bg-amber-50 rounded-xl p-3 mb-2 flex-row items-center justify-between border border-amber-100">
                <View className="flex-row items-center gap-2 flex-1">
                  <Mail size={16} color="#D97706" />
                  <View>
                    <Text className="text-sm font-medium text-gray-800">{invite.farmerName || invite.email}</Text>
                    <Text className="text-xs text-amber-700">{invite.email} - Pending</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => cancelInviteMutation.mutate({ inviteId: invite.id })}
                  className="p-1.5"
                >
                  <X size={16} color="#DC2626" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Farmers List */}
        {farmersQuery.isLoading ? (
          <ActivityIndicator size="large" color="#065F46" className="mt-10" />
        ) : farmers.length === 0 && pendingInvites.length === 0 ? (
          <View className="items-center justify-center mt-20">
            <View className="w-16 h-16 bg-emerald-50 rounded-full items-center justify-center mb-4">
              <User size={32} color="#065F46" />
            </View>
            <Text className="text-gray-500 text-base">No farmers registered yet</Text>
            <Text className="text-gray-400 text-sm mt-1">Invite farmers or add them manually</Text>
          </View>
        ) : (
          farmers.map((farmer) => {
            const isLinked = !!(farmer as any).userId // userId is on the model but not in list include
            return (
              <View key={farmer.id} className="mb-3">
                <TouchableOpacity
                  onPress={() => setExpandedFarmerId(expandedFarmerId === farmer.id ? null : farmer.id)}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3 flex-1">
                      <View className={`w-10 h-10 rounded-full items-center justify-center ${isLinked ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                        <User size={20} color={isLinked ? '#065F46' : '#6B7280'} />
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center gap-1.5">
                          <Text className="font-semibold text-gray-900">{farmer.fullName}</Text>
                          {isLinked && <Link2 size={12} color="#065F46" />}
                        </View>
                        <Text className="text-xs text-gray-500 mt-0.5">
                          {farmer.location ?? 'No location'} - {farmer.fields?.length ?? 0} fields
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-2">
                      {isLinked ? (
                        <View className="bg-emerald-50 rounded-lg px-2 py-1">
                          <Text className="text-xs text-emerald-700 font-medium">Linked</Text>
                        </View>
                      ) : (
                        <View className="bg-gray-100 rounded-lg px-2 py-1">
                          <Text className="text-xs text-gray-500 font-medium">Manual</Text>
                        </View>
                      )}
                      <ChevronRight size={16} color="#9CA3AF" />
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Expanded Detail */}
                {expandedFarmerId === farmer.id && (
                  <View className="bg-white rounded-2xl p-4 mt-1 shadow-sm border border-gray-100">
                    {/* QR Code */}
                    <View className="items-center mb-4 p-3 bg-gray-50 rounded-xl">
                      <QrCode size={48} color="#065F46" />
                      <Text className="text-xs text-gray-500 mt-2 font-mono">{farmer.qrCode}</Text>
                      <Text className="text-xs text-emerald-700 mt-1">Unique Farmer ID</Text>
                    </View>

                    {/* Link Status */}
                    {farmerDetail?.isLinked ? (
                      <View className="bg-emerald-50 rounded-xl p-3 mb-4 flex-row items-center gap-2 border border-emerald-100">
                        <CheckCircle size={16} color="#065F46" />
                        <Text className="text-sm text-emerald-800 font-medium">
                          Account linked - Farm data synced from Farmers App
                        </Text>
                      </View>
                    ) : (
                      <View className="bg-gray-50 rounded-xl p-3 mb-4 flex-row items-center gap-2 border border-gray-200">
                        <Clock size={16} color="#6B7280" />
                        <Text className="text-sm text-gray-600">
                          Not linked - Send an invite to connect
                        </Text>
                      </View>
                    )}

                    {/* Farmer Details */}
                    <View className="gap-2 mb-4">
                      {farmer.phoneNumber && (
                        <View className="flex-row justify-between">
                          <Text className="text-sm text-gray-500">Phone</Text>
                          <Text className="text-sm font-medium text-gray-900">{farmer.phoneNumber}</Text>
                        </View>
                      )}
                      {(farmer as any).email && (
                        <View className="flex-row justify-between">
                          <Text className="text-sm text-gray-500">Email</Text>
                          <Text className="text-sm font-medium text-gray-900">{(farmer as any).email}</Text>
                        </View>
                      )}
                      {farmer.farmSizeHa && (
                        <View className="flex-row justify-between">
                          <Text className="text-sm text-gray-500">Farm Size</Text>
                          <Text className="text-sm font-medium text-gray-900">{farmer.farmSizeHa} ha</Text>
                        </View>
                      )}
                      {farmer.crops && (
                        <View className="flex-row justify-between">
                          <Text className="text-sm text-gray-500">Crops</Text>
                          <Text className="text-sm font-medium text-gray-900">{farmer.crops}</Text>
                        </View>
                      )}
                    </View>

                    {/* Linked Farmer App Data */}
                    {farmerDetail?.farmerAppData && (
                      <View className="mb-4">
                        <Text className="text-sm font-semibold text-emerald-800 mb-2">
                          Farm Data (from Farmers App)
                        </Text>

                        {/* Real fields from farmer app */}
                        {farmerDetail.farmerAppData.fields.map((field: any) => (
                          <View key={field.id} className="bg-emerald-50 rounded-xl p-3 mb-2 border border-emerald-100">
                            <View className="flex-row items-center gap-2 mb-1">
                              <Leaf size={14} color="#065F46" />
                              <Text className="text-sm font-medium text-emerald-900">{field.name}</Text>
                              <Text className="text-xs text-emerald-600">{field.crop}{field.variety ? ` - ${field.variety}` : ''}</Text>
                            </View>
                            <Text className="text-xs text-emerald-700 ml-5">
                              {field.size} {field.sizeUnit ?? 'ha'} - {field.status} - {field.activities?.length ?? 0} activities
                            </Text>
                          </View>
                        ))}

                        {/* Recent activities */}
                        {farmerDetail.farmerAppData.recentActivities.length > 0 && (
                          <View className="mt-2">
                            <Text className="text-xs font-semibold text-gray-700 mb-1">Recent Activities</Text>
                            {farmerDetail.farmerAppData.recentActivities.slice(0, 5).map((activity: any) => (
                              <View key={activity.id} className="flex-row items-center gap-2 py-1.5 border-b border-gray-100">
                                <View className="w-2 h-2 rounded-full bg-emerald-500" />
                                <Text className="text-xs text-gray-700 flex-1">
                                  {ACTIVITY_LABELS[activity.activityType] ?? activity.activityType} - {activity.field?.name ?? ''}
                                </Text>
                                <Text className="text-xs text-gray-400">
                                  {new Date(activity.date).toLocaleDateString()}
                                </Text>
                              </View>
                            ))}
                          </View>
                        )}

                        {farmerDetail.farmerAppData.fields.length === 0 && (
                          <Text className="text-xs text-emerald-600 text-center py-2">
                            Farmer hasn't added fields in the app yet
                          </Text>
                        )}
                      </View>
                    )}

                    {/* Coop Fields (manually added) */}
                    <View className="mb-3">
                      <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-sm font-semibold text-gray-900">Coop Fields</Text>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedFarmerId(farmer.id)
                            setShowAddField(true)
                          }}
                          className="bg-emerald-50 rounded-lg px-3 py-1.5 flex-row items-center gap-1"
                        >
                          <Plus size={14} color="#065F46" />
                          <Text className="text-xs text-emerald-700 font-medium">Add Field</Text>
                        </TouchableOpacity>
                      </View>

                      {(farmerDetail?.fields ?? farmer.fields ?? []).map((field: any) => (
                        <View key={field.id} className="bg-gray-50 rounded-xl p-3 mb-2 flex-row items-center justify-between">
                          <View className="flex-row items-center gap-2 flex-1">
                            <MapPin size={14} color="#065F46" />
                            <View>
                              <Text className="text-sm font-medium text-gray-800">{field.name}</Text>
                              <Text className="text-xs text-gray-500">{field.crop}{field.variety ? ` - ${field.variety}` : ''} - {field.sizeHa} ha</Text>
                            </View>
                          </View>
                          <TouchableOpacity onPress={() => removeFieldMutation.mutate({ id: field.id })}>
                            <Trash2 size={14} color="#DC2626" />
                          </TouchableOpacity>
                        </View>
                      ))}

                      {(farmerDetail?.fields ?? farmer.fields ?? []).length === 0 && (
                        <Text className="text-xs text-gray-400 text-center py-2">No coop fields mapped yet</Text>
                      )}
                    </View>

                    {/* Delete button */}
                    <TouchableOpacity
                      onPress={() => handleDeleteFarmer(farmer.id, farmer.fullName)}
                      className="bg-red-50 rounded-xl py-2.5 items-center mt-2"
                    >
                      <Text className="text-red-600 text-sm font-medium">Delete Farmer</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )
          })
        )}
        <View className="h-6" />
      </ScrollView>

      {/* Invite Farmer Modal */}
      <Modal visible={showInvite} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-900">Invite Farmer</Text>
            <TouchableOpacity onPress={() => { setShowInvite(false); setInviteEmail(''); setInviteName('') }}>
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
            <View className="bg-emerald-50 rounded-xl p-4 mb-6 border border-emerald-100">
              <Text className="text-sm text-emerald-800 font-medium mb-1">How invites work</Text>
              <Text className="text-xs text-emerald-700">
                Send an invite to a farmer's email. When they sign in to the Farmers App with that email, they'll see the invite and can accept it. Once accepted, their farm data (fields, activities, harvests) will be visible here.
              </Text>
            </View>

            <View className="gap-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Farmer's Email *</Text>
                <TextInput
                  value={inviteEmail}
                  onChangeText={setInviteEmail}
                  placeholder="farmer@example.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Farmer's Name (optional)</Text>
                <TextInput
                  value={inviteName}
                  onChangeText={setInviteName}
                  placeholder="e.g. Amina El Idrissi"
                  placeholderTextColor="#9CA3AF"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                />
              </View>
            </View>
          </ScrollView>

          <View className="px-5 py-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={handleSendInvite}
              disabled={!inviteEmail.trim() || sendInviteMutation.isPending}
              className={`rounded-xl py-4 items-center flex-row justify-center gap-2 ${inviteEmail.trim() ? 'bg-emerald-700' : 'bg-gray-300'}`}
            >
              {sendInviteMutation.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Send size={18} color="white" />
                  <Text className="text-white font-semibold text-base">Send Invite</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Add Farmer Modal */}
      <Modal visible={showAddFarmer} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-900">Add Farmer</Text>
            <TouchableOpacity onPress={() => { setShowAddFarmer(false); resetFarmerForm() }}>
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
            <View className="gap-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Full Name *</Text>
                <TextInput value={farmerName} onChangeText={setFarmerName} placeholder="Enter farmer name" placeholderTextColor="#9CA3AF" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900" />
              </View>
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Email</Text>
                <TextInput value={farmerEmail} onChangeText={setFarmerEmail} placeholder="farmer@example.com" placeholderTextColor="#9CA3AF" keyboardType="email-address" autoCapitalize="none" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900" />
              </View>
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Phone Number</Text>
                <TextInput value={farmerPhone} onChangeText={setFarmerPhone} placeholder="e.g. +254 700 123456" placeholderTextColor="#9CA3AF" keyboardType="phone-pad" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900" />
              </View>
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Location / Village</Text>
                <TextInput value={farmerLocation} onChangeText={setFarmerLocation} placeholder="e.g. Souss, Morocco" placeholderTextColor="#9CA3AF" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900" />
              </View>
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Farm Size (hectares)</Text>
                <TextInput value={farmerFarmSize} onChangeText={setFarmerFarmSize} placeholder="e.g. 2.5" placeholderTextColor="#9CA3AF" keyboardType="decimal-pad" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900" />
              </View>
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Crops</Text>
                <TextInput value={farmerCrops} onChangeText={setFarmerCrops} placeholder="e.g. Coffee, Tea, Avocado" placeholderTextColor="#9CA3AF" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900" />
              </View>
            </View>
          </ScrollView>

          <View className="px-5 py-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={handleAddFarmer}
              disabled={!farmerName.trim() || createFarmerMutation.isPending}
              className={`rounded-xl py-4 items-center ${farmerName.trim() ? 'bg-emerald-700' : 'bg-gray-300'}`}
            >
              {createFarmerMutation.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">Add Farmer</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Add Field Modal */}
      <Modal visible={showAddField} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-900">Add Field</Text>
            <TouchableOpacity onPress={() => { setShowAddField(false); resetFieldForm() }}>
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
            <View className="gap-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Field Name *</Text>
                <TextInput value={fieldName} onChangeText={setFieldName} placeholder="e.g. Plot A" placeholderTextColor="#9CA3AF" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900" />
              </View>
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Crop *</Text>
                <TextInput value={fieldCrop} onChangeText={setFieldCrop} placeholder="e.g. Coffee" placeholderTextColor="#9CA3AF" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900" />
              </View>
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Variety</Text>
                <TextInput value={fieldVariety} onChangeText={setFieldVariety} placeholder="e.g. SL-28" placeholderTextColor="#9CA3AF" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900" />
              </View>
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1.5">Size (hectares) *</Text>
                <TextInput value={fieldSize} onChangeText={setFieldSize} placeholder="e.g. 1.5" placeholderTextColor="#9CA3AF" keyboardType="decimal-pad" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900" />
              </View>
              <View>
                <View className="flex-row items-center justify-between mb-1.5">
                  <Text className="text-sm font-medium text-gray-700">GPS Coordinates</Text>
                  <TouchableOpacity onPress={handleCaptureGPS} className="flex-row items-center gap-1">
                    <MapPin size={14} color="#065F46" />
                    <Text className="text-xs text-emerald-700 font-medium">Capture GPS</Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-row gap-3">
                  <TextInput value={fieldLat} onChangeText={setFieldLat} placeholder="Latitude" placeholderTextColor="#9CA3AF" keyboardType="decimal-pad" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900" />
                  <TextInput value={fieldLng} onChangeText={setFieldLng} placeholder="Longitude" placeholderTextColor="#9CA3AF" keyboardType="decimal-pad" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900" />
                </View>
              </View>
            </View>
          </ScrollView>

          <View className="px-5 py-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={handleAddField}
              disabled={!fieldName.trim() || !fieldCrop.trim() || !fieldSize || addFieldMutation.isPending}
              className={`rounded-xl py-4 items-center ${fieldName.trim() && fieldCrop.trim() && fieldSize ? 'bg-emerald-700' : 'bg-gray-300'}`}
            >
              {addFieldMutation.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">Add Field</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}
