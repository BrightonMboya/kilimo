import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function AIScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-2xl font-bold text-gray-900 mb-2">JANI AI</Text>
        <Text className="text-gray-500 text-center">Assistant coming in Phase 2.</Text>
      </View>
    </SafeAreaView>
  )
}
