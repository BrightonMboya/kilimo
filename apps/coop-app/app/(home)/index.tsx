import React from 'react'
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useUser, useAuth } from '@clerk/clerk-expo'
import { UserPlus, PackagePlus, BookPlus, LogOut, AlertCircle, ChevronRight } from 'lucide-react-native'
import { trpc } from '../../utils/api'

function formatDate(d: Date | string) {
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function formatNumber(n: number) {
  return n.toLocaleString()
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode
  label: string
  onPress: () => void
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 items-center active:bg-gray-50"
    >
      <View className="w-10 h-10 bg-green-50 rounded-full items-center justify-center mb-2">
        {icon}
      </View>
      <Text className="text-gray-900 font-medium text-sm text-center">{label}</Text>
    </TouchableOpacity>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <View className="flex-1 bg-green-50 border border-green-100 rounded-2xl p-4">
      <Text className="text-xs text-gray-500 mb-1">{label}</Text>
      <Text className="text-2xl font-bold text-gray-900">{value}</Text>
    </View>
  )
}

export default function HomeScreen() {
  const router = useRouter()
  const { user } = useUser()
  const { signOut } = useAuth()

  const dashboard = trpc.coop.dashboard.useQuery()
  const recentLots = trpc.collection.list.useQuery({ limit: 5 })
  const paymentsSummary = trpc.payments.summary.useQuery()

  const refreshing = dashboard.isRefetching || recentLots.isRefetching || paymentsSummary.isRefetching

  const onRefresh = () => {
    dashboard.refetch()
    recentLots.refetch()
    paymentsSummary.refetch()
  }

  const onSignOut = () => {
    Alert.alert('Sign out?', 'You will need to sign back in to continue.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => signOut() },
    ])
  }

  const firstName = user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ?? 'there'
  const coopName = dashboard.data?.cooperative?.name
  const isDefaultCoopName = coopName === 'My Cooperative'

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#16A34A" />}
      >
        <View className="flex-row items-start justify-between mb-6">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-gray-900">Hi, {firstName}</Text>
            {dashboard.isLoading ? (
              <Text className="text-gray-400 mt-1">Loading your cooperative…</Text>
            ) : coopName ? (
              <Text className="text-gray-500 mt-1">
                {coopName}
                {dashboard.data?.farmersCount ? ` · ${dashboard.data.farmersCount} farmers` : ''}
              </Text>
            ) : null}
          </View>
          <TouchableOpacity onPress={onSignOut} className="w-10 h-10 items-center justify-center">
            <LogOut size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {dashboard.error ? (
          <View className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <Text className="text-red-700 font-semibold mb-1">Couldn't load dashboard</Text>
            <Text className="text-red-600 text-sm">{dashboard.error.message}</Text>
          </View>
        ) : null}

        {isDefaultCoopName ? (
          <TouchableOpacity
            onPress={() => Alert.alert('Coming soon', 'Cooperative settings screen is on the way.')}
            className="flex-row items-center bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6"
          >
            <AlertCircle size={18} color="#D97706" />
            <Text className="ml-2 text-amber-800 flex-1 text-sm">
              Finish setting up your cooperative — add your real name and contact info.
            </Text>
            <ChevronRight size={18} color="#D97706" />
          </TouchableOpacity>
        ) : null}

        {(paymentsSummary.data?.pendingCount ?? 0) > 0 ? (
          <TouchableOpacity
            onPress={() => router.push('/books')}
            className="flex-row items-center bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-6"
          >
            <AlertCircle size={18} color="#EA580C" />
            <Text className="ml-2 text-orange-800 flex-1 text-sm">
              {paymentsSummary.data?.pendingCount} pending payment
              {(paymentsSummary.data?.pendingCount ?? 0) === 1 ? '' : 's'} to reconcile
            </Text>
            <ChevronRight size={18} color="#EA580C" />
          </TouchableOpacity>
        ) : null}

        <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Today</Text>
        <View className="flex-row gap-3 mb-6">
          <Stat label="Lots today" value={formatNumber(dashboard.data?.lotsToday ?? 0)} />
          <Stat label="Kg today" value={formatNumber(dashboard.data?.kgToday ?? 0)} />
        </View>

        <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick actions</Text>
        <View className="flex-row gap-3 mb-6">
          <QuickAction
            icon={<UserPlus size={20} color="#16A34A" />}
            label="Add Farmer"
            onPress={() => router.push('/farmers/new')}
          />
          <QuickAction
            icon={<PackagePlus size={20} color="#16A34A" />}
            label="New Lot"
            onPress={() => router.push('/collection/new')}
          />
          <QuickAction
            icon={<BookPlus size={20} color="#16A34A" />}
            label="New Payment"
            onPress={() => router.push('/books/new')}
          />
        </View>

        <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Overview</Text>
        <View className="flex-row gap-3 mb-3">
          <Stat label="Farmers" value={formatNumber(dashboard.data?.farmersCount ?? 0)} />
          <Stat label="Fields" value={formatNumber(dashboard.data?.fieldsCount ?? 0)} />
        </View>
        <View className="flex-row gap-3 mb-6">
          <Stat label="Total lots" value={formatNumber(dashboard.data?.totalLots ?? 0)} />
          <Stat label="Total kg" value={formatNumber(dashboard.data?.totalKg ?? 0)} />
        </View>

        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recent lots</Text>
          {(recentLots.data?.collections.length ?? 0) > 0 ? (
            <TouchableOpacity onPress={() => router.push('/collection')}>
              <Text className="text-green-700 text-sm font-medium">See all</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {recentLots.isLoading ? (
          <View className="items-center py-8">
            <ActivityIndicator size="small" color="#16A34A" />
          </View>
        ) : (recentLots.data?.collections.length ?? 0) === 0 ? (
          <View className="bg-gray-50 border border-gray-100 rounded-2xl p-6 items-center">
            <Text className="text-gray-500 text-center">
              No lots yet. Tap "New Lot" above to record your first collection.
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {recentLots.data!.collections.map((lot) => (
              <View key={lot.id} className="bg-white border border-gray-100 rounded-2xl p-4">
                <View className="flex-row items-start justify-between mb-1">
                  <Text className="font-mono text-xs text-gray-400">{lot.lotCode}</Text>
                  <Text className="text-gray-400 text-xs">{formatDate(lot.date)}</Text>
                </View>
                <Text className="font-semibold text-gray-900">
                  {lot.weightKg} kg · {lot.crop}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {lot.coopFarmer.fullName} · Grade {lot.qualityGrade}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
