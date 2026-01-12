import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { ArrowLeft, Map, BookOpen, Plus, Camera, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react-native'
import { MOCK_FIELDS } from './mockData'

export default function FieldsScreen() {
  const [activeField, setActiveField] = useState<typeof MOCK_FIELDS[0] | null>(null)
  const [showLogModal, setShowLogModal] = useState(false)

  // Field Detail View
  if (activeField) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
        <View className="bg-white p-4 shadow-sm flex-row items-center border-b border-gray-100">
          <TouchableOpacity onPress={() => setActiveField(null)} className="mr-3 bg-gray-100 p-2 rounded-full">
            <ArrowLeft size={20} color="#374151" />
          </TouchableOpacity>
          <View>
            <Text className="font-bold text-lg text-gray-800">{activeField.name}</Text>
            <Text className="text-xs text-gray-500">FID: {activeField.id}-8821-XM</Text>
          </View>
          <View className="ml-auto">
             <View className="bg-green-100 px-2 py-1 rounded-md border border-green-200">
                <Text className="text-green-700 text-xs font-medium">EUDR OK</Text>
             </View>
          </View>
        </View>

        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          {/* Map Placeholder */}
          <View className="bg-gray-200 rounded-xl h-48 w-full items-center justify-center relative overflow-hidden border border-gray-300 mb-6">
             <Map size={40} color="#6B7280" className="mb-2" />
             <Text className="text-sm font-medium text-gray-500">Geo-Polygon Verified</Text>
             <Text className="text-xs text-gray-500">Accuracy: ±1.5m</Text>
          </View>

          {/* KDE (Key Data Elements) */}
          <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
            <View className="flex-row items-center mb-3">
              <BookOpen size={16} color="#16A34A" className="mr-2"/> 
              <Text className="font-bold text-gray-800 ml-2">Key Data Elements</Text>
            </View>
            <View className="flex-row flex-wrap">
              <View className="w-1/2 mb-4">
                <Text className="text-gray-500 text-xs">Seed Variety</Text>
                <Text className="font-medium text-gray-800">SL-28 (Certified)</Text>
              </View>
              <View className="w-1/2 mb-4">
                <Text className="text-gray-500 text-xs">Planting Date</Text>
                <Text className="font-medium text-gray-800">12 Oct 2023</Text>
              </View>
              <View className="w-1/2">
                <Text className="text-gray-500 text-xs">Soil Type</Text>
                <Text className="font-medium text-gray-800">Red Volcanic</Text>
              </View>
              <View className="w-1/2">
                <Text className="text-gray-500 text-xs">Irrigation</Text>
                <Text className="font-medium text-gray-800">Rain-fed</Text>
              </View>
            </View>
          </View>

          {/* Activity Log / Traceability Chain */}
          <View className="pb-24">
             <Text className="font-bold text-gray-800 mb-3">Activity Log</Text>
             <View className="border-l-2 border-gray-200 ml-2 pl-4 py-2 gap-6">
                <View>
                   <View className="absolute -left-[23px] bg-green-500 h-3 w-3 rounded-full border-2 border-white shadow-sm" />
                   <Text className="text-xs text-gray-500">Yesterday, 10:00 AM</Text>
                   <Text className="font-bold text-gray-800 mt-1">Fertilizer Application</Text>
                   <Text className="text-sm text-gray-600 mt-1">Applied 50kg NPK 17:17:17 to Row 1-4.</Text>
                   <View className="mt-2 flex-row">
                      <View className="bg-gray-100 px-2 py-1 rounded">
                        <Text className="text-[10px] text-gray-600">Input Batch #9921</Text>
                      </View>
                   </View>
                </View>
                <View className="mt-6">
                   <View className="absolute -left-[23px] bg-blue-500 h-3 w-3 rounded-full border-2 border-white shadow-sm" />
                   <Text className="text-xs text-gray-500">15 Nov 2025</Text>
                   <Text className="font-bold text-gray-800 mt-1">Field Inspection</Text>
                   <Text className="text-sm text-gray-600 mt-1">Routine scouting. No pests found.</Text>
                </View>
             </View>
          </View>
        </ScrollView>

        {/* FAB to Add Log */}
        <TouchableOpacity 
          onPress={() => setShowLogModal(true)}
          className="absolute bottom-8 right-4 bg-green-600 p-4 rounded-full shadow-lg flex-row items-center"
        >
          <Plus size={24} color="white" className="mr-2" /> 
          <Text className="text-white font-bold ml-2">Log Activity</Text>
        </TouchableOpacity>

        {/* Log Activity Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showLogModal}
          onRequestClose={() => setShowLogModal(false)}
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl p-6">
              <Text className="text-lg font-bold mb-4 text-gray-800">Log Activity</Text>
              <View className="gap-4">
                <View>
                  <Text className="text-xs font-medium text-gray-700 mb-1">Activity Type</Text>
                  <View className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <Text className="text-gray-800">Fertilization</Text>
                  </View>
                </View>
                <View className="mt-4">
                   <Text className="text-xs font-medium text-gray-700 mb-1">Notes / Quantity</Text>
                   <TextInput 
                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800" 
                    placeholder="e.g., 2 Bags NPK" 
                    placeholderTextColor="#9CA3AF"
                   />
                </View>
                <TouchableOpacity className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg flex-row items-center justify-center mt-4 bg-gray-50">
                  <Camera size={20} color="#6B7280" /> 
                  <Text className="text-gray-500 ml-2 font-medium">Take Photo Evidence</Text>
                </TouchableOpacity>
                <View className="flex-row gap-3 pt-4 mb-6">
                  <TouchableOpacity onPress={() => setShowLogModal(false)} className="flex-1 py-3 rounded-lg bg-gray-100 items-center">
                    <Text className="font-medium text-gray-600">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowLogModal(false)} className="flex-1 py-3 rounded-lg bg-green-600 items-center">
                    <Text className="font-medium text-white">Save Log</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    )
  }

  // List View
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="px-4 py-4 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-gray-800">My Fields</Text>
        <TouchableOpacity className="bg-green-600 p-2 rounded-lg shadow-sm">
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 pb-20" showsVerticalScrollIndicator={false}>
        <View className="gap-4 pb-20">
          {MOCK_FIELDS.map((field) => (
            <TouchableOpacity 
              key={field.id} 
              onPress={() => setActiveField(field)} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98]"
            >
              <View className="h-32 bg-gray-200 relative items-center justify-center">
                 <View className="absolute inset-0 items-center justify-center bg-green-50">
                    <Map size={64} color="#DCFCE7" />
                 </View>
                 <View className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded">
                   <Text className="text-white text-xs">{field.size}</Text>
                 </View>
              </View>
              <View className="p-4">
                <View className="flex-row justify-between items-start">
                  <View>
                    <Text className="font-bold text-lg text-gray-800">{field.name}</Text>
                    <Text className="text-sm text-gray-500 mb-2">{field.crop}</Text>
                  </View>
                  {field.compliance === "EUDR Compliant" ? (
                    <CheckCircle size={20} color="#22C55E" />
                  ) : (
                    <AlertTriangle size={20} color="#EAB308" />
                  )}
                </View>
                <View className="mt-2 pt-3 border-t border-gray-100 flex-row justify-between items-center">
                  <Text className="text-xs text-gray-500">Last: {field.lastActivity}</Text>
                  <View className="flex-row items-center">
                    <Text className="text-green-600 text-xs font-medium mr-1">View Details</Text>
                    <ChevronRight size={14} color="#16A34A" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
