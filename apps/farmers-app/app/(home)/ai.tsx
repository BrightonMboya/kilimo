import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Sprout, Camera, MessageSquare, ArrowUpRight } from 'lucide-react-native'

export default function AssistantScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="bg-white p-4 border-b border-gray-200 flex-row items-center shadow-sm">
        <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
          <Sprout size={24} color="#16A34A" />
        </View>
        <View>
          <Text className="font-bold text-gray-800 text-lg">Jani Assistant</Text>
          <Text className="text-xs text-green-600">Powered by JANI AI</Text>
        </View>
      </View>

      {/* Chat Area */}
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ gap: 16 }}>
        <View className="items-start">
          <View className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[80%]">
            <Text className="text-sm text-gray-700">Hello Kipchoge! I noticed rain is forecast for tomorrow. It might be a good time to check the drainage in the North Hill Coffee plot. How can I help today?</Text>
          </View>
        </View>
        
        {/* User Message */}
        <View className="items-end">
          <View className="bg-green-600 p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[80%]">
            <Text className="text-sm text-white">I see some yellow spots on my coffee leaves.</Text>
          </View>
        </View>

        {/* AI Response */}
        <View className="flex-row items-start">
           <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-2 mt-1">
              <Sprout size={16} color="#16A34A" />
           </View>
          <View className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[85%]">
            <Text className="text-sm text-gray-700 mb-2">That could be <Text className="font-bold">Coffee Leaf Rust</Text> or nutrient deficiency.</Text>
            <Text className="text-sm text-gray-700 mb-3">Can you take a photo? Or check these symptoms:</Text>
            <View className="pl-2 mb-3">
               <Text className="text-xs text-gray-600 mb-1">• Orange powdery spots on underside?</Text>
               <Text className="text-xs text-gray-600 mb-1">• Leaves falling off prematurely?</Text>
            </View>
            <TouchableOpacity className="bg-gray-100 py-2 px-3 rounded-lg flex-row items-center self-start">
              <Camera size={14} color="#374151" className="mr-2" /> 
              <Text className="text-xs text-gray-700 ml-2">Upload Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Input Area */}
      <View className="p-4 bg-white border-t border-gray-200">
        <View className="flex-row gap-2 items-center">
          <TouchableOpacity className="p-3 bg-gray-100 rounded-full">
             <MessageSquare size={20} color="#6B7280" />
          </TouchableOpacity>
          <TextInput 
            placeholder="Ask about pests, weather..." 
            className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm text-gray-800"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity className="p-3 bg-green-600 rounded-full shadow-md">
            <ArrowUpRight size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
