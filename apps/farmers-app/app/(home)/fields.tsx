import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { ArrowLeft, Map, BookOpen, Plus, Camera, CheckCircle, AlertTriangle, ChevronRight, X, Trash2, Edit3, Droplets, Leaf, Search, Bug } from 'lucide-react-native'
import { trpc } from '../../utils/api'
import DateTimePicker from '@react-native-community/datetimepicker'

// Activity type labels and colors
const ACTIVITY_TYPES = [
  { value: 'planting', label: 'Planting', color: '#16A34A', icon: Leaf },
  { value: 'fertilization', label: 'Fertilization', color: '#EA580C', icon: Droplets },
  { value: 'spraying', label: 'Spraying', color: '#2563EB', icon: Bug },
  { value: 'irrigation', label: 'Irrigation', color: '#0891B2', icon: Droplets },
  { value: 'weeding', label: 'Weeding', color: '#65A30D', icon: Leaf },
  { value: 'pruning', label: 'Pruning', color: '#7C3AED', icon: Edit3 },
  { value: 'inspection', label: 'Inspection', color: '#6366F1', icon: Search },
  { value: 'harvest', label: 'Harvest', color: '#F59E0B', icon: Leaf },
  { value: 'soil_testing', label: 'Soil Testing', color: '#78716C', icon: Search },
  { value: 'other', label: 'Other', color: '#6B7280', icon: Plus },
] as const

const FIELD_STATUSES = [
  { value: 'active', label: 'Active', color: '#16A34A' },
  { value: 'fallow', label: 'Fallow', color: '#F59E0B' },
  { value: 'harvested', label: 'Harvested', color: '#6366F1' },
  { value: 'preparing', label: 'Preparing', color: '#8B5CF6' },
] as const

const SOIL_TYPES = ['Red Volcanic', 'Loamy', 'Clay', 'Sandy', 'Silt', 'Peat', 'Chalk']
const IRRIGATION_TYPES = ['Rain-fed', 'Drip', 'Sprinkler', 'Flood', 'Manual']

type ActivityType = typeof ACTIVITY_TYPES[number]['value']
type FieldStatus = typeof FIELD_STATUSES[number]['value']

export default function FieldsScreen() {
  // State for active field view
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null)

  // Modal states
  const [showFieldModal, setShowFieldModal] = useState(false)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [editingField, setEditingField] = useState<any>(null)

  // Field form state
  const [fieldName, setFieldName] = useState('')
  const [fieldCrop, setFieldCrop] = useState('')
  const [fieldVariety, setFieldVariety] = useState('')
  const [fieldSize, setFieldSize] = useState('')
  const [fieldStatus, setFieldStatus] = useState<FieldStatus>('active')
  const [fieldSoilType, setFieldSoilType] = useState('')
  const [fieldIrrigation, setFieldIrrigation] = useState('')
  const [fieldNotes, setFieldNotes] = useState('')
  const [plantingDate, setPlantingDate] = useState<Date | null>(null)
  const [showPlantingDatePicker, setShowPlantingDatePicker] = useState(false)

  // Activity form state
  const [activityType, setActivityType] = useState<ActivityType>('fertilization')
  const [activityDescription, setActivityDescription] = useState('')
  const [activityQuantity, setActivityQuantity] = useState('')
  const [activityUnit, setActivityUnit] = useState('')
  const [activityInputName, setActivityInputName] = useState('')
  const [activityDate, setActivityDate] = useState(new Date())
  const [showActivityDatePicker, setShowActivityDatePicker] = useState(false)

  // API queries
  const { data: fields, isLoading, refetch } = trpc.farmerFields.myFields.useQuery()
  const { data: activeField, isLoading: isLoadingField } = trpc.farmerFields.getById.useQuery(
    { id: activeFieldId! },
    { enabled: !!activeFieldId }
  )

  // Mutations
  const createFieldMutation = trpc.farmerFields.create.useMutation({
    onSuccess: () => {
      refetch()
      resetFieldForm()
      setShowFieldModal(false)
    },
    onError: (error) => Alert.alert("Error", error.message)
  })

  const updateFieldMutation = trpc.farmerFields.update.useMutation({
    onSuccess: () => {
      refetch()
      resetFieldForm()
      setShowFieldModal(false)
    },
    onError: (error) => Alert.alert("Error", error.message)
  })

  const deleteFieldMutation = trpc.farmerFields.delete.useMutation({
    onSuccess: () => {
      refetch()
      setActiveFieldId(null)
    },
    onError: (error) => Alert.alert("Error", error.message)
  })

  const logActivityMutation = trpc.farmerFields.logActivity.useMutation({
    onSuccess: () => {
      refetch()
      resetActivityForm()
      setShowActivityModal(false)
    },
    onError: (error) => Alert.alert("Error", error.message)
  })

  // Form helpers
  const resetFieldForm = () => {
    setFieldName('')
    setFieldCrop('')
    setFieldVariety('')
    setFieldSize('')
    setFieldStatus('active')
    setFieldSoilType('')
    setFieldIrrigation('')
    setFieldNotes('')
    setPlantingDate(null)
    setEditingField(null)
  }

  const resetActivityForm = () => {
    setActivityType('fertilization')
    setActivityDescription('')
    setActivityQuantity('')
    setActivityUnit('')
    setActivityInputName('')
    setActivityDate(new Date())
  }

  const openEditField = (field: any) => {
    setEditingField(field)
    setFieldName(field.name)
    setFieldCrop(field.crop)
    setFieldVariety(field.variety || '')
    setFieldSize(field.size.toString())
    setFieldStatus(field.status)
    setFieldSoilType(field.soilType || '')
    setFieldIrrigation(field.irrigationType || '')
    setFieldNotes(field.notes || '')
    setPlantingDate(field.plantingDate ? new Date(field.plantingDate) : null)
    setShowFieldModal(true)
  }

  const handleSaveField = () => {
    if (!fieldName.trim() || !fieldCrop.trim() || !fieldSize) {
      Alert.alert("Error", "Please fill in required fields (name, crop, size)")
      return
    }

    const data = {
      name: fieldName.trim(),
      crop: fieldCrop.trim(),
      variety: fieldVariety.trim() || undefined,
      size: parseFloat(fieldSize),
      status: fieldStatus,
      soilType: fieldSoilType || undefined,
      irrigationType: fieldIrrigation || undefined,
      notes: fieldNotes.trim() || undefined,
      plantingDate: plantingDate || undefined,
    }

    if (editingField) {
      updateFieldMutation.mutate({ id: editingField.id, ...data })
    } else {
      createFieldMutation.mutate(data)
    }
  }

  const handleDeleteField = (id: string) => {
    Alert.alert(
      "Delete Field",
      "Are you sure? This will also delete all activity logs for this field.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteFieldMutation.mutate({ id }) }
      ]
    )
  }

  const handleLogActivity = () => {
    if (!activeFieldId) return

    logActivityMutation.mutate({
      fieldId: activeFieldId,
      activityType,
      description: activityDescription.trim() || undefined,
      quantity: activityQuantity ? parseFloat(activityQuantity) : undefined,
      unit: activityUnit.trim() || undefined,
      inputName: activityInputName.trim() || undefined,
      date: activityDate,
    })
  }

  const getStatusColor = (status: string) => {
    return FIELD_STATUSES.find(s => s.value === status)?.color || '#6B7280'
  }

  const getActivityInfo = (type: string) => {
    return ACTIVITY_TYPES.find(a => a.value === type) || ACTIVITY_TYPES[9]
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })
  }

  // Field Detail View
  if (activeFieldId && activeField) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
        <View className="bg-white p-4 shadow-sm flex-row items-center border-b border-gray-100">
          <TouchableOpacity onPress={() => setActiveFieldId(null)} className="mr-3 bg-gray-100 p-2 rounded-full">
            <ArrowLeft size={20} color="#374151" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="font-bold text-lg text-gray-800">{activeField.name}</Text>
            <Text className="text-xs text-gray-500">{activeField.crop}{activeField.variety ? ` (${activeField.variety})` : ''}</Text>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity onPress={() => openEditField(activeField)} className="bg-gray-100 p-2 rounded-full">
              <Edit3 size={18} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteField(activeField.id)} className="bg-red-50 p-2 rounded-full">
              <Trash2 size={18} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          {/* Status & Size */}
          <View className="flex-row gap-3 mb-4">
            <View className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <Text className="text-xs text-gray-500 mb-1">Status</Text>
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: getStatusColor(activeField.status) }} />
                <Text className="font-semibold text-gray-800 capitalize">{activeField.status}</Text>
              </View>
            </View>
            <View className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <Text className="text-xs text-gray-500 mb-1">Size</Text>
              <Text className="font-semibold text-gray-800">{activeField.size} {activeField.sizeUnit}</Text>
            </View>
            <View className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <Text className="text-xs text-gray-500 mb-1">Compliance</Text>
              <View className="flex-row items-center">
                {activeField.complianceStatus === 'compliant' ? (
                  <CheckCircle size={16} color="#16A34A" />
                ) : (
                  <AlertTriangle size={16} color="#F59E0B" />
                )}
                <Text className="font-semibold text-gray-800 ml-1 text-xs capitalize">
                  {activeField.complianceStatus.replace('_', ' ')}
                </Text>
              </View>
            </View>
          </View>

          {/* Map Placeholder */}
          <View className="bg-gray-200 rounded-xl h-40 w-full items-center justify-center relative overflow-hidden border border-gray-300 mb-4">
            <View className="absolute inset-0 items-center justify-center bg-green-50">
              <Map size={48} color="#DCFCE7" />
            </View>
            {activeField.latitude && activeField.longitude ? (
              <View className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded">
                <Text className="text-white text-xs">{activeField.latitude.toFixed(4)}, {activeField.longitude.toFixed(4)}</Text>
              </View>
            ) : (
              <Text className="text-sm font-medium text-gray-500">No location data</Text>
            )}
          </View>

          {/* Details */}
          <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
            <View className="flex-row items-center mb-3">
              <BookOpen size={16} color="#16A34A" />
              <Text className="font-bold text-gray-800 ml-2">Field Details</Text>
            </View>
            <View className="flex-row flex-wrap">
              {activeField.soilType && (
                <View className="w-1/2 mb-3">
                  <Text className="text-gray-500 text-xs">Soil Type</Text>
                  <Text className="font-medium text-gray-800">{activeField.soilType}</Text>
                </View>
              )}
              {activeField.irrigationType && (
                <View className="w-1/2 mb-3">
                  <Text className="text-gray-500 text-xs">Irrigation</Text>
                  <Text className="font-medium text-gray-800">{activeField.irrigationType}</Text>
                </View>
              )}
              {activeField.plantingDate && (
                <View className="w-1/2 mb-3">
                  <Text className="text-gray-500 text-xs">Planting Date</Text>
                  <Text className="font-medium text-gray-800">{new Date(activeField.plantingDate).toLocaleDateString()}</Text>
                </View>
              )}
              {activeField.expectedHarvestDate && (
                <View className="w-1/2 mb-3">
                  <Text className="text-gray-500 text-xs">Expected Harvest</Text>
                  <Text className="font-medium text-gray-800">{new Date(activeField.expectedHarvestDate).toLocaleDateString()}</Text>
                </View>
              )}
            </View>
            {activeField.notes && (
              <View className="mt-2 pt-3 border-t border-gray-100">
                <Text className="text-gray-500 text-xs mb-1">Notes</Text>
                <Text className="text-gray-700 text-sm">{activeField.notes}</Text>
              </View>
            )}
          </View>

          {/* Activity Log */}
          <View className="pb-24">
            <Text className="font-bold text-gray-800 mb-3">Activity Log</Text>
            {activeField.activities && activeField.activities.length > 0 ? (
              <View className="border-l-2 border-gray-200 ml-2 pl-4 py-2 gap-4">
                {activeField.activities.map((activity: any) => {
                  const info = getActivityInfo(activity.activityType)
                  const IconComponent = info.icon
                  return (
                    <View key={activity.id}>
                      <View className="absolute -left-[23px] h-3 w-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: info.color }} />
                      <Text className="text-xs text-gray-500">{formatDate(activity.date)}</Text>
                      <View className="flex-row items-center mt-1">
                        <IconComponent size={14} color={info.color} />
                        <Text className="font-bold text-gray-800 ml-1">{info.label}</Text>
                      </View>
                      {activity.description && (
                        <Text className="text-sm text-gray-600 mt-1">{activity.description}</Text>
                      )}
                      {activity.quantity && (
                        <View className="mt-2 flex-row">
                          <View className="bg-gray-100 px-2 py-1 rounded">
                            <Text className="text-[10px] text-gray-600">
                              {activity.quantity} {activity.unit}{activity.inputName ? ` - ${activity.inputName}` : ''}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  )
                })}
              </View>
            ) : (
              <View className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 items-center justify-center">
                <Text className="text-gray-500 text-sm text-center">No activities logged yet</Text>
                <Text className="text-gray-400 text-xs text-center mt-1">
                  Tap "Log Activity" to record field activities
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* FAB to Add Log */}
        <TouchableOpacity
          onPress={() => setShowActivityModal(true)}
          className="absolute bottom-8 right-4 bg-green-600 p-4 rounded-full shadow-lg flex-row items-center"
        >
          <Plus size={24} color="white" />
          <Text className="text-white font-bold ml-2">Log Activity</Text>
        </TouchableOpacity>

        {/* Log Activity Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showActivityModal}
          onRequestClose={() => setShowActivityModal(false)}
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl p-6 h-[80%]">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-gray-900">Log Activity</Text>
                <TouchableOpacity onPress={() => setShowActivityModal(false)} className="bg-gray-100 p-2 rounded-full">
                  <X size={24} color="#374151" />
                </TouchableOpacity>
              </View>

              <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="gap-4">
                  <View>
                    <Text className="text-gray-700 font-medium mb-2">Activity Type *</Text>
                    <View className="flex-row flex-wrap gap-2">
                      {ACTIVITY_TYPES.map((type) => (
                        <TouchableOpacity
                          key={type.value}
                          onPress={() => setActivityType(type.value)}
                          className={`px-3 py-2 rounded-lg border ${
                            activityType === type.value ? 'border-green-500 bg-green-50' : 'border-gray-200'
                          }`}
                        >
                          <Text className={`text-sm ${activityType === type.value ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                            {type.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View>
                    <Text className="text-gray-700 font-medium mb-2">Description</Text>
                    <TextInput
                      value={activityDescription}
                      onChangeText={setActivityDescription}
                      placeholder="e.g., Applied to rows 1-4"
                      multiline
                      numberOfLines={2}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                      style={{ textAlignVertical: 'top' }}
                    />
                  </View>

                  <View className="flex-row gap-3">
                    <View className="flex-1">
                      <Text className="text-gray-700 font-medium mb-2">Quantity</Text>
                      <TextInput
                        value={activityQuantity}
                        onChangeText={setActivityQuantity}
                        placeholder="50"
                        keyboardType="decimal-pad"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-700 font-medium mb-2">Unit</Text>
                      <TextInput
                        value={activityUnit}
                        onChangeText={setActivityUnit}
                        placeholder="kg"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                      />
                    </View>
                  </View>

                  <View>
                    <Text className="text-gray-700 font-medium mb-2">Input/Product Name</Text>
                    <TextInput
                      value={activityInputName}
                      onChangeText={setActivityInputName}
                      placeholder="e.g., NPK 17:17:17"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                    />
                  </View>

                  <View>
                    <Text className="text-gray-700 font-medium mb-2">Date</Text>
                    <TouchableOpacity
                      onPress={() => setShowActivityDatePicker(true)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                    >
                      <Text className="text-gray-900">{activityDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {showActivityDatePicker && (
                      <DateTimePicker
                        value={activityDate}
                        mode="date"
                        display="default"
                        maximumDate={new Date()}
                        onChange={(event, selectedDate) => {
                          setShowActivityDatePicker(false)
                          if (selectedDate) setActivityDate(selectedDate)
                        }}
                      />
                    )}
                  </View>

                  <TouchableOpacity
                    onPress={handleLogActivity}
                    disabled={logActivityMutation.isPending}
                    className={`w-full bg-green-600 rounded-xl py-4 mt-4 ${logActivityMutation.isPending ? 'opacity-50' : ''}`}
                  >
                    {logActivityMutation.isPending ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white text-center font-semibold text-lg">Save Activity</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    )
  }

  // Loading state for field detail
  if (activeFieldId && isLoadingField) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center" edges={['top']}>
        <ActivityIndicator size="large" color="#16A34A" />
      </SafeAreaView>
    )
  }

  // List View
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="px-4 py-4 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-gray-800">My Fields</Text>
        <TouchableOpacity
          onPress={() => { resetFieldForm(); setShowFieldModal(true) }}
          className="bg-green-600 p-2 rounded-lg shadow-sm"
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-4 pb-20"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#16A34A" className="mt-10" />
        ) : fields && fields.length > 0 ? (
          <View className="gap-4 pb-20">
            {fields.map((field) => (
              <TouchableOpacity
                key={field.id}
                onPress={() => setActiveFieldId(field.id)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98]"
              >
                <View className="h-28 bg-gray-200 relative items-center justify-center">
                  <View className="absolute inset-0 items-center justify-center bg-green-50">
                    <Map size={48} color="#DCFCE7" />
                  </View>
                  <View className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded">
                    <Text className="text-white text-xs">{field.size} {field.sizeUnit}</Text>
                  </View>
                  <View className="absolute top-2 left-2 px-2 py-1 rounded" style={{ backgroundColor: getStatusColor(field.status) }}>
                    <Text className="text-white text-xs capitalize font-medium">{field.status}</Text>
                  </View>
                </View>
                <View className="p-4">
                  <View className="flex-row justify-between items-start">
                    <View>
                      <Text className="font-bold text-lg text-gray-800">{field.name}</Text>
                      <Text className="text-sm text-gray-500">{field.crop}{field.variety ? ` (${field.variety})` : ''}</Text>
                    </View>
                    {field.complianceStatus === 'compliant' ? (
                      <CheckCircle size={20} color="#22C55E" />
                    ) : field.complianceStatus === 'pending_review' ? (
                      <AlertTriangle size={20} color="#F59E0B" />
                    ) : (
                      <AlertTriangle size={20} color="#9CA3AF" />
                    )}
                  </View>
                  <View className="mt-3 pt-3 border-t border-gray-100 flex-row justify-between items-center">
                    <Text className="text-xs text-gray-500">
                      {field.activities?.[0] ? `Last: ${formatDate(field.activities[0].date)}` : 'No activities yet'}
                    </Text>
                    <View className="flex-row items-center">
                      <Text className="text-green-600 text-xs font-medium mr-1">View Details</Text>
                      <ChevronRight size={14} color="#16A34A" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 items-center mt-10">
            <Map size={48} color="#D1D5DB" />
            <Text className="text-gray-500 text-center mt-4 font-medium">No fields added yet</Text>
            <Text className="text-gray-400 text-sm text-center mt-1">Add your first field to start tracking</Text>
            <TouchableOpacity
              onPress={() => { resetFieldForm(); setShowFieldModal(true) }}
              className="mt-4 bg-green-600 px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-semibold">Add Field</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Field Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFieldModal}
        onRequestClose={() => { setShowFieldModal(false); resetFieldForm() }}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 h-[90%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-900">
                {editingField ? 'Edit Field' : 'Add New Field'}
              </Text>
              <TouchableOpacity onPress={() => { setShowFieldModal(false); resetFieldForm() }} className="bg-gray-100 p-2 rounded-full">
                <X size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <View className="gap-4">
                <View>
                  <Text className="text-gray-700 font-medium mb-2">Field Name *</Text>
                  <TextInput
                    value={fieldName}
                    onChangeText={setFieldName}
                    placeholder="e.g., North Field"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                  />
                </View>

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-gray-700 font-medium mb-2">Crop *</Text>
                    <TextInput
                      value={fieldCrop}
                      onChangeText={setFieldCrop}
                      placeholder="e.g., Coffee"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-700 font-medium mb-2">Variety</Text>
                    <TextInput
                      value={fieldVariety}
                      onChangeText={setFieldVariety}
                      placeholder="e.g., SL-28"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-gray-700 font-medium mb-2">Size (hectares) *</Text>
                  <TextInput
                    value={fieldSize}
                    onChangeText={setFieldSize}
                    placeholder="2.5"
                    keyboardType="decimal-pad"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                  />
                </View>

                <View>
                  <Text className="text-gray-700 font-medium mb-2">Status</Text>
                  <View className="flex-row gap-2">
                    {FIELD_STATUSES.map((status) => (
                      <TouchableOpacity
                        key={status.value}
                        onPress={() => setFieldStatus(status.value)}
                        className={`flex-1 py-3 rounded-xl border ${
                          fieldStatus === status.value ? 'bg-green-50 border-green-500' : 'border-gray-200'
                        }`}
                      >
                        <Text className={`text-center text-sm font-medium ${
                          fieldStatus === status.value ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          {status.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View>
                  <Text className="text-gray-700 font-medium mb-2">Soil Type</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row gap-2">
                      {SOIL_TYPES.map((soil) => (
                        <TouchableOpacity
                          key={soil}
                          onPress={() => setFieldSoilType(soil)}
                          className={`px-4 py-2 rounded-lg border ${
                            fieldSoilType === soil ? 'bg-green-50 border-green-500' : 'border-gray-200'
                          }`}
                        >
                          <Text className={`text-sm ${fieldSoilType === soil ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                            {soil}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <View>
                  <Text className="text-gray-700 font-medium mb-2">Irrigation Type</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row gap-2">
                      {IRRIGATION_TYPES.map((type) => (
                        <TouchableOpacity
                          key={type}
                          onPress={() => setFieldIrrigation(type)}
                          className={`px-4 py-2 rounded-lg border ${
                            fieldIrrigation === type ? 'bg-green-50 border-green-500' : 'border-gray-200'
                          }`}
                        >
                          <Text className={`text-sm ${fieldIrrigation === type ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                            {type}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <View>
                  <Text className="text-gray-700 font-medium mb-2">Planting Date</Text>
                  <TouchableOpacity
                    onPress={() => setShowPlantingDatePicker(true)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                  >
                    <Text className={plantingDate ? 'text-gray-900' : 'text-gray-400'}>
                      {plantingDate ? plantingDate.toLocaleDateString() : 'Select date'}
                    </Text>
                  </TouchableOpacity>
                  {showPlantingDatePicker && (
                    <DateTimePicker
                      value={plantingDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowPlantingDatePicker(false)
                        if (selectedDate) setPlantingDate(selectedDate)
                      }}
                    />
                  )}
                </View>

                <View>
                  <Text className="text-gray-700 font-medium mb-2">Notes</Text>
                  <TextInput
                    value={fieldNotes}
                    onChangeText={setFieldNotes}
                    placeholder="Any additional notes..."
                    multiline
                    numberOfLines={3}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                    style={{ textAlignVertical: 'top' }}
                  />
                </View>

                <TouchableOpacity
                  onPress={handleSaveField}
                  disabled={createFieldMutation.isPending || updateFieldMutation.isPending}
                  className={`w-full bg-green-600 rounded-xl py-4 mt-4 ${
                    (createFieldMutation.isPending || updateFieldMutation.isPending) ? 'opacity-50' : ''
                  }`}
                >
                  {(createFieldMutation.isPending || updateFieldMutation.isPending) ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-center font-semibold text-lg">
                      {editingField ? 'Update Field' : 'Create Field'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
