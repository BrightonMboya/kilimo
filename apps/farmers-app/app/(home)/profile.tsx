import { useUser } from '@clerk/clerk-expo'
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { User, QrCode, CheckCircle, Leaf, Building2, Mail, X, Check } from 'lucide-react-native'
import { trpc } from '../../utils/api'

export default function ProfileScreen() {
  const { user } = useUser()

  const farmerId = user?.id ? `JANI-${user.id.slice(-8).toUpperCase()}` : 'JANI-XXXXXXXX'

  // Invites
  const pendingInvitesQuery = trpc.coopInvites.myPendingInvites.useQuery()
  const myCoopsQuery = trpc.coopInvites.myCooperatives.useQuery()
  const utils = trpc.useUtils()

  const acceptMutation = trpc.coopInvites.accept.useMutation({
    onSuccess: () => {
      utils.coopInvites.myPendingInvites.invalidate()
      utils.coopInvites.myCooperatives.invalidate()
      Alert.alert('Accepted', 'You are now connected to this cooperative. Your farm data will be visible to the cooperative manager.')
    },
    onError: (err) => {
      Alert.alert('Error', err.message)
    },
  })

  const declineMutation = trpc.coopInvites.decline.useMutation({
    onSuccess: () => {
      utils.coopInvites.myPendingInvites.invalidate()
    },
  })

  const pendingInvites = pendingInvitesQuery.data ?? []
  const myCoops = myCoopsQuery.data ?? []

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView className="flex-1 pb-24" showsVerticalScrollIndicator={false}>
        {/* Top Section */}
        <View className="bg-green-700 p-6 pb-12 items-center rounded-b-[3rem] shadow-lg">
          <View className="w-24 h-24 bg-white rounded-full mb-3 p-1">
            <View className="w-full h-full bg-gray-200 rounded-full overflow-hidden items-center justify-center">
              {user?.imageUrl ? (
                <Image source={{ uri: user.imageUrl }} className="w-full h-full" />
              ) : (
                <User size={60} color="#9CA3AF" className="mt-2" />
              )}
            </View>
          </View>
          <Text className="text-xl font-bold text-white">{user?.fullName || 'Farmer'}</Text>
          <Text className="text-green-200 text-sm mt-1">{user?.primaryEmailAddress?.emailAddress}</Text>
        </View>

        {/* ID Card Section */}
        <View className="px-6 -mt-8">
          <View className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 items-center">
            <Text className="text-gray-400 text-xs uppercase tracking-widest mb-4">Farmer Digital ID</Text>
            <View className="bg-white p-2 border-2 border-gray-900 rounded-lg mb-4">
              <QrCode size={120} color="#111827" />
            </View>
            <Text className="font-mono text-lg font-bold text-gray-800 tracking-wider">{farmerId}</Text>
            <View className="w-full h-px bg-gray-100 my-4" />
            <View className="flex-row justify-between w-full">
              <Text className="text-sm text-gray-500">Member since</Text>
              <Text className="font-medium text-right max-w-[60%] text-gray-800">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Cooperative Invites */}
        {pendingInvites.length > 0 && (
          <View className="px-6 mt-6">
            <Text className="font-bold text-gray-800 mb-3">Cooperative Invites</Text>
            {pendingInvites.map((invite) => (
              <View key={invite.id} className="bg-white p-4 rounded-xl shadow-sm border border-amber-200 mb-3">
                <View className="flex-row items-center gap-3 mb-3">
                  <View className="bg-amber-100 p-2 rounded-full">
                    <Mail size={20} color="#D97706" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-gray-800">
                      {invite.cooperative.name}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {invite.cooperative.location ? `${invite.cooperative.location} - ` : ''}
                      Invited you to join
                    </Text>
                  </View>
                </View>

                <Text className="text-xs text-gray-500 mb-3">
                  By accepting, the cooperative manager will be able to see your fields, activities, and harvest data.
                </Text>

                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => declineMutation.mutate({ inviteId: invite.id })}
                    disabled={declineMutation.isPending}
                    className="flex-1 bg-gray-100 rounded-xl py-3 flex-row items-center justify-center gap-2"
                  >
                    <X size={16} color="#374151" />
                    <Text className="text-gray-700 font-medium text-sm">Decline</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => acceptMutation.mutate({ inviteId: invite.id })}
                    disabled={acceptMutation.isPending}
                    className="flex-1 bg-green-600 rounded-xl py-3 flex-row items-center justify-center gap-2"
                  >
                    {acceptMutation.isPending ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <>
                        <Check size={16} color="white" />
                        <Text className="text-white font-medium text-sm">Accept</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* My Cooperatives */}
        {myCoops.length > 0 && (
          <View className="px-6 mt-6">
            <Text className="font-bold text-gray-800 mb-3">My Cooperatives</Text>
            {myCoops.map((membership) => (
              <View key={membership.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3 flex-row items-center gap-3">
                <View className="bg-green-100 p-2 rounded-full">
                  <Building2 size={20} color="#15803D" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-gray-800">{membership.cooperative.name}</Text>
                  <Text className="text-xs text-gray-500">
                    {membership.cooperative.location ?? ''}{membership.cooperative.contactName ? ` - ${membership.cooperative.contactName}` : ''}
                  </Text>
                </View>
                <View className="bg-green-50 rounded-lg px-2 py-1">
                  <Text className="text-xs text-green-700 font-medium">Connected</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Certificates */}
        <View className="px-6 mt-6 gap-3 mb-8">
          <Text className="font-bold text-gray-800">Certificates & Compliance</Text>
          <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-row items-center gap-3">
            <View className="bg-green-100 p-2 rounded-full">
              <CheckCircle size={20} color="#15803D" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-gray-800">EU Deforestation Reg (EUDR)</Text>
              <Text className="text-xs text-gray-500">Verified</Text>
            </View>
          </View>
          <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-row items-center gap-3">
            <View className="bg-blue-100 p-2 rounded-full">
              <Leaf size={20} color="#1D4ED8" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-gray-800">Rainforest Alliance</Text>
              <Text className="text-xs text-gray-500">Pending Audit</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
