import { useUser, useAuth } from '@clerk/clerk-expo'
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Leaf, Menu, CloudRain, Droplets, Search, Plus, LogOut, X } from 'lucide-react-native'
import { Link } from 'expo-router'
import { MOCK_WEATHER } from './mockData'
import { trpc } from '../../utils/api'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { TasksList } from '../../components/TasksList'

export default function Page() {
  const { user } = useUser()
  const { signOut } = useAuth()
  
  // Fetch tasks for the current user
  const { data: tasks, refetch: refetchTasks, isLoading: isLoadingTasks } = trpc.tasks.myTasks.useQuery(
    undefined,
    { enabled: !!user?.id }
  )

  const createTaskMutation = trpc.tasks.create.useMutation({
    onSuccess: () => {
      refetchTasks()
      setModalVisible(false)
      setNewTaskName('')
      setNewTaskDescription('')
      setNewTaskPriority('medium')
      setNewTaskDate(new Date())
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Failed to create task")
    }
  })

  const [modalVisible, setModalVisible] = useState(false)
  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [newTaskDate, setNewTaskDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleAddTask = () => {
    if (!newTaskName.trim()) {
      Alert.alert("Error", "Please enter a task name")
      return
    }
    
    createTaskMutation.mutate({
      name: newTaskName,
      description: newTaskDescription,
      priority: newTaskPriority,
      dueAt: newTaskDate,
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView className="flex-1 pb-20" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-green-700 p-6 rounded-b-3xl shadow-lg relative overflow-hidden pb-8">
          <View className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
            <Leaf size={120} color="white" />
          </View>
          <View className="flex-row justify-between items-start relative z-10">
            <View>
              <Text className="text-green-100 text-sm">Hujambo, (Hello)</Text>
              <Text className="text-2xl font-bold text-white mt-1">{user?.fullName}</Text>
              <View className="flex-row items-center mt-2 bg-green-800/50 self-start px-3 py-1 rounded-full">
                <View className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                <Text className="text-xs text-white">Online & Synced</Text>
              </View>
            </View>
            <View className="flex-row gap-3">
              <TouchableOpacity 
                onPress={() => signOut()}
                className="bg-white/20 p-2 rounded-full backdrop-blur-sm"
              >
                <LogOut size={24} color="white" />
              </TouchableOpacity>
              <View className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <Menu size={24} color="white" />
              </View>
            </View>
          </View>

          {/* Weather Widget */}
          <View className="mt-6 flex-row items-center bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10">
            <View className="mr-4">
              <CloudRain size={32} className="text-blue-200" color="#BFDBFE" />
            </View>
            <View className="flex-1">
              <View className="flex-row items-end">
                <Text className="text-3xl font-bold text-white">{MOCK_WEATHER.temp}°</Text>
                <Text className="text-sm mb-1 ml-1 text-white">Nairobi</Text>
              </View>
              <Text className="text-xs text-green-100 mt-1">{MOCK_WEATHER.advice}</Text>
            </View>
            <View className="items-end">
              <Text className="text-xs font-bold text-white">{MOCK_WEATHER.precip} Rain</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-4 mt-6">
          <Text className="font-bold text-gray-800 mb-3 text-lg">Quick Actions</Text>
          <View className="flex-row justify-between gap-2">
            {[
              { icon: Leaf, label: "Log Harvest", bg: "bg-orange-100", text: "text-orange-600", color: "#EA580C" },
              { icon: Droplets, label: "Spray/Input", bg: "bg-blue-100", text: "text-blue-600", color: "#2563EB" },
              { icon: Search, label: "Scouting", bg: "bg-purple-100", text: "text-purple-600", color: "#9333EA" },
              { icon: Plus, label: "Add Task", bg: "bg-gray-200", text: "text-gray-600", color: "#4B5563", onPress: () => setModalVisible(true) },
            ].map((action, idx) => (
              <TouchableOpacity key={idx} onPress={action.onPress} className="flex-1 items-center space-y-2">
                <View className={`${action.bg} p-4 rounded-2xl shadow-sm w-full items-center aspect-square justify-center`}>
                  <action.icon size={24} color={action.color} />
                </View>
                <Text className="text-xs text-center font-medium text-gray-600">{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tasks */}
        <TasksList 
          tasks={tasks} 
          isLoading={isLoadingTasks} 
          onAddTask={() => setModalVisible(true)} 
        />

        {/* Field Overview */}
        <View className="px-4 mt-6 mb-8">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="font-bold text-gray-800 text-lg">My Fields</Text>
            <Link href="/(home)/fields" asChild>
              <TouchableOpacity>
                <Text className="text-green-600 text-sm font-medium">Manage</Text>
              </TouchableOpacity>
            </Link>
          </View>
          {/* Fields section temporarily disabled until schema is updated */}
          <View className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 items-center justify-center">
            <Text className="text-gray-500 text-sm">No fields added yet</Text>
            <Link href="/(home)/fields" asChild>
              <TouchableOpacity className="mt-2">
                 <Text className="text-green-600 font-medium">Add a field</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>

      {/* Add Task Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 h-[70%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-900">Add New Task</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-gray-100 p-2 rounded-full">
                <X size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <View className="space-y-4">
                <View>
                  <Text className="text-gray-700 font-medium mb-2">Task Name</Text>
                  <TextInput
                    value={newTaskName}
                    onChangeText={setNewTaskName}
                    placeholder="e.g., Water the maize field"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900"
                  />
                </View>

                <View>
                  <Text className="text-gray-700 font-medium mb-2">Description</Text>
                  <TextInput
                    value={newTaskDescription}
                    onChangeText={setNewTaskDescription}
                    placeholder="Add details..."
                    multiline
                    numberOfLines={3}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900"
                    style={{ textAlignVertical: 'top' }}
                  />
                </View>

                <View>
                  <Text className="text-gray-700 font-medium mb-2">Priority</Text>
                  <View className="flex-row gap-3">
                    {(['low', 'medium', 'high'] as const).map((p) => (
                      <TouchableOpacity
                        key={p}
                        onPress={() => setNewTaskPriority(p)}
                        className={`flex-1 py-3 rounded-xl border ${
                          newTaskPriority === p 
                            ? 'bg-green-50 border-green-500' 
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <Text className={`text-center capitalize font-medium ${
                          newTaskPriority === p ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          {p}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View>
                  <Text className="text-gray-700 font-medium mb-2">Due Date</Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5"
                  >
                    <Text className="text-gray-900">{newTaskDate.toLocaleDateString()}</Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={newTaskDate}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false)
                        if (selectedDate) setNewTaskDate(selectedDate)
                      }}
                    />
                  )}
                </View>

                <TouchableOpacity
                  onPress={handleAddTask}
                  disabled={createTaskMutation.isPending || !newTaskName.trim()}
                  className={`w-full bg-green-600 rounded-xl py-4 mt-6 shadow-sm ${
                    (createTaskMutation.isPending || !newTaskName.trim()) ? 'opacity-50' : ''
                  }`}
                >
                  {createTaskMutation.isPending ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-center font-semibold text-lg">Create Task</Text>
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