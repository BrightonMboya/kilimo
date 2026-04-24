import React from 'react'
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Plus, BookOpen, CheckCircle2, Clock } from 'lucide-react-native'
import { trpc } from '../../../utils/api'

type Status = 'all' | 'pending_payment' | 'confirmed' | 'paid'

const STATUS_LABEL: Record<Exclude<Status, 'all'>, string> = {
  pending_payment: 'Pending',
  confirmed: 'Confirmed',
  paid: 'Paid',
}

const STATUS_COLOR: Record<Exclude<Status, 'all'>, string> = {
  pending_payment: 'bg-orange-100 text-orange-700',
  confirmed: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
}

function formatDate(d: Date | string) {
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString()}`
}

export default function BooksList() {
  const router = useRouter()
  const utils = trpc.useUtils()
  const [statusFilter, setStatusFilter] = React.useState<Status>('all')

  const { data, isLoading, error, refetch, isRefetching } = trpc.payments.list.useQuery({
    status: statusFilter === 'all' ? undefined : statusFilter,
    limit: 50,
  })

  const { data: summary } = trpc.payments.summary.useQuery()

  const confirmMutation = trpc.payments.confirm.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.payments.list.invalidate(),
        utils.payments.summary.invalidate(),
      ])
    },
    onError: (err) => Alert.alert('Could not update', err.message),
  })

  const onMarkPaid = (id: string, farmerName: string) => {
    Alert.alert(
      'Mark as paid?',
      `Confirm payment to ${farmerName}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Mark paid', onPress: () => confirmMutation.mutate({ id, status: 'paid' }) },
      ],
    )
  }

  const payments = data?.payments ?? []

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="px-6 pt-4 pb-3">
        <Text className="text-3xl font-bold text-gray-900">Books</Text>
        <Text className="text-gray-500 mt-1">Payments & ledger</Text>
      </View>

      <View className="px-6 pb-3">
        <View className="bg-green-50 border border-green-100 rounded-2xl p-4">
          <Text className="text-xs text-gray-500 mb-1">Total paid out</Text>
          <Text className="text-3xl font-bold text-gray-900">
            {formatMoney(summary?.totalPaid ?? 0, 'KES')}
          </Text>
          <View className="flex-row mt-3 gap-4">
            <View className="flex-row items-center">
              <CheckCircle2 size={14} color="#16A34A" />
              <Text className="ml-1 text-gray-600 text-sm">
                {summary?.totalPayments ?? 0} total
              </Text>
            </View>
            <View className="flex-row items-center">
              <Clock size={14} color="#F59E0B" />
              <Text className="ml-1 text-gray-600 text-sm">
                {summary?.pendingCount ?? 0} pending
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="px-6 pb-3">
        <View className="flex-row gap-2">
          {(['all', 'pending_payment', 'paid'] as Status[]).map((s) => {
            const selected = s === statusFilter
            const label = s === 'all' ? 'All' : STATUS_LABEL[s as Exclude<Status, 'all'>]
            return (
              <TouchableOpacity
                key={s}
                onPress={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-full border ${selected ? 'bg-green-700 border-green-700' : 'bg-white border-gray-200'}`}
              >
                <Text className={`font-medium text-sm ${selected ? 'text-white' : 'text-gray-700'}`}>{label}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#16A34A" />
        </View>
      ) : error ? (
        <View className="mx-6 bg-red-50 border border-red-200 rounded-2xl p-4">
          <Text className="text-red-700 font-semibold mb-1">Couldn't load payments</Text>
          <Text className="text-red-600 text-sm">{error.message}</Text>
        </View>
      ) : payments.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-16 h-16 bg-green-50 rounded-full items-center justify-center mb-4">
            <BookOpen size={28} color="#16A34A" />
          </View>
          <Text className="text-gray-900 font-semibold text-lg mb-1">No payments yet</Text>
          <Text className="text-gray-500 text-center">
            Tap the + button to record your first payment.
          </Text>
        </View>
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#16A34A" />
          }
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => {
            const statusKey = item.status as Exclude<Status, 'all'>
            const colorClass = STATUS_COLOR[statusKey] ?? 'bg-gray-100 text-gray-600'
            return (
              <View className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <View className="flex-row items-start justify-between mb-1">
                  <Text className="font-semibold text-gray-900 flex-1">{item.coopFarmer.fullName}</Text>
                  <View className={`px-2 py-0.5 rounded-full ${colorClass}`}>
                    <Text className={`text-xs font-semibold ${colorClass.split(' ')[1]}`}>
                      {STATUS_LABEL[statusKey] ?? item.status}
                    </Text>
                  </View>
                </View>
                <Text className="text-2xl font-bold text-gray-900">
                  {formatMoney(item.totalAmount, item.currency)}
                </Text>
                <Text className="text-gray-500 text-sm mt-0.5">
                  {item.collection ? `${item.collection.lotCode} · ${item.collection.weightKg} kg` : 'No lot linked'}
                  {' · '}
                  {formatDate(item.date)}
                </Text>
                {item.status !== 'paid' ? (
                  <TouchableOpacity
                    onPress={() => onMarkPaid(item.id, item.coopFarmer.fullName)}
                    className="mt-3 bg-green-50 border border-green-100 rounded-xl py-2 items-center"
                  >
                    <Text className="text-green-700 font-semibold">Mark as paid</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            )
          }}
        />
      )}

      <TouchableOpacity
        onPress={() => router.push('/books/new')}
        className="absolute bottom-6 right-6 w-14 h-14 bg-green-700 rounded-full items-center justify-center shadow-lg active:bg-green-800"
      >
        <Plus size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}
