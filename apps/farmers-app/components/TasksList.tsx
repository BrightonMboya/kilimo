import React from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'

interface Task {
  id: string
  name: string
  priority: 'low' | 'medium' | 'high'
  dueAt: Date | string
}

interface TasksListProps {
  tasks: Task[] | undefined | null
  isLoading: boolean
  onAddTask: () => void
  onSeeAll?: () => void
}

export function TasksList({ tasks, isLoading, onAddTask, onSeeAll }: TasksListProps) {
  return (
    <View className="px-4 mt-6">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="font-bold text-gray-800 text-lg">Today's Tasks</Text>
        {onSeeAll && (
          <TouchableOpacity onPress={onSeeAll}>
            <Text className="text-green-600 text-sm font-medium">See All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {isLoading ? (
         <ActivityIndicator size="small" color="#16A34A" />
      ) : tasks && tasks.length > 0 ? (
        <View className="gap-3">
          {tasks.map((task) => (
            <View key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-row items-center">
              <View className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${task.priority === 'high' ? 'border-red-400' : 'border-gray-300'}`} />
              <View className="flex-1">
                <Text className="font-semibold text-gray-800 text-sm">{task.name}</Text>
                <Text className="text-xs text-gray-500 mt-1">Due: {new Date(task.dueAt).toLocaleDateString()}</Text>
              </View>
              {task.priority === 'high' && (
                <View className="bg-red-100 px-2 py-1 rounded-full">
                  <Text className="text-red-600 text-[10px] font-bold">URGENT</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      ) : (
        <View className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 items-center justify-center">
          <Text className="text-gray-500 text-sm">No tasks for today</Text>
          <TouchableOpacity onPress={onAddTask} className="mt-2">
             <Text className="text-green-600 font-medium">Add a task</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
