import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function FarmersScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-2xl font-bold text-gray-900 mb-2">Farmers</Text>
        <Text className="text-gray-500 text-center">Registry coming in Stage 3a.</Text>
      </View>
    </SafeAreaView>
  )
}
