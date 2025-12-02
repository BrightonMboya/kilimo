import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Camera } from 'lucide-react-native'

export default function AIScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['top']}>
      <ScrollView className="flex-1 px-4 pt-4 pb-20" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">AI Farm Assistant</Text>
          <Text className="text-gray-500">Get instant advice, identify diseases, and plan optimally.</Text>
        </View>

        {/* Diagnostic Tool */}
        <View className="bg-blue-100 p-4 rounded-xl mb-6">
          <Text className="font-semibold text-blue-800 mb-2">Diagnostic Tool</Text>
          <Text className="text-sm text-blue-800 mb-3">Upload a photo of a sick plant for AI analysis.</Text>
          <TouchableOpacity className="bg-blue-600 p-3 rounded-lg flex-row justify-center items-center">
            <Camera size={16} color="white" className="mr-2" />
            <Text className="text-white font-medium text-sm ml-2">Take Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Chat Interface */}
        <View className="bg-white p-4 rounded-xl shadow-sm space-y-4">
          <Text className="font-semibold text-gray-800">Ask JANI a question:</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white h-24"
            placeholder="E.g., What is the ideal soil pH for potatoes?"
            placeholderTextColor="#9ca3af"
            multiline
            textAlignVertical="top"
          />
          <TouchableOpacity className="bg-emerald-600 p-3 rounded-lg items-center">
            <Text className="text-white font-medium text-sm">Send Query</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
