import { useUser } from '@clerk/clerk-expo'
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TrendingUp, TrendingDown, DollarSign, Plus, X, Calendar } from 'lucide-react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { trpc } from '../../utils/api'

const INCOME_CATEGORIES = [
  { value: 'crop_sales', label: 'Crop Sales' },
  { value: 'livestock_sales', label: 'Livestock Sales' },
  { value: 'government_subsidy', label: 'Government Subsidy' },
  { value: 'other_income', label: 'Other Income' },
]

const EXPENSE_CATEGORIES = [
  { value: 'seeds', label: 'Seeds' },
  { value: 'fertilizer', label: 'Fertilizer' },
  { value: 'pesticides', label: 'Pesticides' },
  { value: 'labor', label: 'Labor' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'fuel', label: 'Fuel' },
  { value: 'water', label: 'Water' },
  { value: 'rent', label: 'Rent' },
  { value: 'other_expense', label: 'Other Expense' },
]

export default function BooksScreen() {
  const { user } = useUser()
  const [modalVisible, setModalVisible] = useState(false)
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')
  
  // Form state
  const [type, setType] = useState<'income' | 'expense'>('income')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)

  const { data: records, refetch: refetchRecords, isLoading: isLoadingRecords } = trpc.financialRecords.myRecords.useQuery(
    filter === 'all' ? undefined : { type: filter },
    { enabled: !!user?.id }
  )

  const { data: summary, refetch: refetchSummary } = trpc.financialRecords.summary.useQuery(
    undefined,
    { enabled: !!user?.id }
  )

  const createRecordMutation = trpc.financialRecords.create.useMutation({
    onSuccess: () => {
      refetchRecords()
      refetchSummary()
      setModalVisible(false)
      setType('income')
      setCategory('')
      setAmount('')
      setDescription('')
      setDate(new Date())
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Failed to create record")
    }
  })

  const deleteRecordMutation = trpc.financialRecords.delete.useMutation({
    onSuccess: () => {
      refetchRecords()
      refetchSummary()
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Failed to delete record")
    }
  })

  const handleAddRecord = () => {
    if (!category || !amount) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount")
      return
    }

    createRecordMutation.mutate({
      type,
      category: category as any,
      amount: numAmount,
      description: description || undefined,
      date,
    })
  }

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this record?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteRecordMutation.mutate({ id }) }
      ]
    )
  }

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const formatCurrency = (value: number) => {
    return `KSh ${value.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('en-KE', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getCategoryLabel = (cat: string) => {
    const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]
    return allCategories.find(c => c.value === cat)?.label || cat
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isLoadingRecords} onRefresh={() => { refetchRecords(); refetchSummary(); }} />
        }
      >
        {/* Header */}
        <View className="bg-green-700 p-6 rounded-b-3xl shadow-lg pb-8">
          <Text className="text-3xl font-bold text-white">Books</Text>
          <Text className="text-green-100 mt-1">Track your farm finances</Text>
        </View>

        {/* Summary Cards */}
        <View className="px-4 mt-6">
          <View className="flex-row gap-3 mb-4">
            <View className="flex-1 bg-green-50 p-4 rounded-xl border border-green-200">
              <View className="flex-row items-center mb-2">
                <TrendingUp size={20} color="#16A34A" />
                <Text className="text-green-700 font-medium ml-2 text-xs">Income</Text>
              </View>
              <Text className="text-2xl font-bold text-green-800">
                {formatCurrency(summary?.totalIncome || 0)}
              </Text>
            </View>

            <View className="flex-1 bg-red-50 p-4 rounded-xl border border-red-200">
              <View className="flex-row items-center mb-2">
                <TrendingDown size={20} color="#DC2626" />
                <Text className="text-red-700 font-medium ml-2 text-xs">Expenses</Text>
              </View>
              <Text className="text-2xl font-bold text-red-800">
                {formatCurrency(summary?.totalExpenses || 0)}
              </Text>
            </View>
          </View>

          <View className={`p-4 rounded-xl border ${(summary?.netBalance || 0) >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
            <View className="flex-row items-center mb-2">
              <DollarSign size={20} color={(summary?.netBalance || 0) >= 0 ? '#2563EB' : '#EA580C'} />
              <Text className={`font-medium ml-2 text-xs ${(summary?.netBalance || 0) >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                Net Balance
              </Text>
            </View>
            <Text className={`text-2xl font-bold ${(summary?.netBalance || 0) >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
              {formatCurrency(summary?.netBalance || 0)}
            </Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View className="px-4 mt-6">
          <View className="flex-row bg-white rounded-xl p-1 shadow-sm">
            {(['all', 'income', 'expense'] as const).map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                className={`flex-1 py-2 rounded-lg ${filter === f ? 'bg-green-600' : ''}`}
              >
                <Text className={`text-center capitalize font-medium ${filter === f ? 'text-white' : 'text-gray-600'}`}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Transactions List */}
        <View className="px-4 mt-6 mb-24">
          <Text className="font-bold text-gray-800 mb-3 text-lg">Recent Transactions</Text>
          
          {isLoadingRecords ? (
            <ActivityIndicator size="small" color="#16A34A" />
          ) : records && records.length > 0 ? (
            <View className="space-y-3">
              {records.map((record) => (
                <View key={record.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-1">
                        {record.type === 'income' ? (
                          <TrendingUp size={16} color="#16A34A" />
                        ) : (
                          <TrendingDown size={16} color="#DC2626" />
                        )}
                        <Text className="font-semibold text-gray-800 ml-2">
                          {getCategoryLabel(record.category)}
                        </Text>
                      </View>
                      {record.description && (
                        <Text className="text-sm text-gray-500 mb-1">{record.description}</Text>
                      )}
                      <Text className="text-xs text-gray-400">{formatDate(record.date)}</Text>
                    </View>
                    <View className="items-end">
                      <Text className={`text-lg font-bold ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {record.type === 'income' ? '+' : '-'}{formatCurrency(record.amount)}
                      </Text>
                      <TouchableOpacity 
                        onPress={() => handleDelete(record.id)}
                        className="mt-2 bg-red-50 px-3 py-1 rounded"
                      >
                        <Text className="text-red-600 text-xs font-medium">Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 items-center">
              <Text className="text-gray-500 text-center">No transactions yet</Text>
              <Text className="text-gray-400 text-sm text-center mt-1">Tap the + button to add your first record</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="absolute bottom-6 right-6 bg-green-600 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        style={{ elevation: 5 }}
      >
        <Plus size={28} color="white" />
      </TouchableOpacity>

      {/* Add Record Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 h-[85%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-900">Add Record</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-gray-100 p-2 rounded-full">
                <X size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <View className="space-y-4">
                {/* Type Selector */}
                <View>
                  <Text className="text-gray-700 font-medium mb-2">Type</Text>
                  <View className="flex-row gap-3">
                    {(['income', 'expense'] as const).map((t) => (
                      <TouchableOpacity
                        key={t}
                        onPress={() => { setType(t); setCategory(''); }}
                        className={`flex-1 py-3 rounded-xl border ${
                          type === t ? 'bg-green-50 border-green-500' : 'bg-white border-gray-200'
                        }`}
                      >
                        <Text className={`text-center capitalize font-medium ${
                          type === t ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          {t}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Category Picker */}
                <View>
                  <Text className="text-gray-700 font-medium mb-2">Category *</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat.value}
                        onPress={() => setCategory(cat.value)}
                        className={`px-4 py-2 rounded-lg border ${
                          category === cat.value ? 'bg-green-50 border-green-500' : 'bg-white border-gray-200'
                        }`}
                      >
                        <Text className={`text-sm font-medium ${
                          category === cat.value ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Amount */}
                <View>
                  <Text className="text-gray-700 font-medium mb-2">Amount (KSh) *</Text>
                  <TextInput
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900"
                  />
                </View>

                {/* Description */}
                <View>
                  <Text className="text-gray-700 font-medium mb-2">Description (Optional)</Text>
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Add details..."
                    multiline
                    numberOfLines={3}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900"
                    style={{ textAlignVertical: 'top' }}
                  />
                </View>

                {/* Date */}
                <View>
                  <Text className="text-gray-700 font-medium mb-2">Date</Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 flex-row items-center"
                  >
                    <Calendar size={20} color="#6B7280" />
                    <Text className="text-gray-900 ml-2">{date.toLocaleDateString()}</Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="default"
                      maximumDate={new Date()}
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false)
                        if (selectedDate) setDate(selectedDate)
                      }}
                    />
                  )}
                </View>

                <TouchableOpacity
                  onPress={handleAddRecord}
                  disabled={createRecordMutation.isPending || !category || !amount}
                  className={`w-full bg-green-600 rounded-xl py-4 mt-6 shadow-sm ${
                    (createRecordMutation.isPending || !category || !amount) ? 'opacity-50' : ''
                  }`}
                >
                  {createRecordMutation.isPending ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-center font-semibold text-lg">Add Record</Text>
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
