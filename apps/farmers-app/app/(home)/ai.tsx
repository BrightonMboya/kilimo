import { useState, useRef, useEffect, useCallback } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Sprout, ArrowUp, Trash2, Plus } from 'lucide-react-native'
import { useAuth } from '@clerk/clerk-expo'
import { trpc } from '../../utils/api'
import Constants from 'expo-constants'

// Local message type for UI
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

// Get base URL for API calls
const getBaseUrl = () => {
  const debuggerHost =
    Constants.expoConfig?.hostUri ??
    Constants.manifest?.debuggerHost ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const localhost = debuggerHost?.split(':')[0];
  if (localhost) return `http://${localhost}:3000`;
  if (Platform.OS === 'android') return 'http://10.0.2.2:3000';
  return 'http://localhost:3000';
};

export default function AssistantScreen() {
  const { getToken } = useAuth()
  const [inputText, setInputText] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const scrollViewRef = useRef<ScrollView>(null)
  const xhrRef = useRef<XMLHttpRequest | null>(null)

  // Delete conversation mutation
  const deleteConversationMutation = trpc.chat.deleteConversation.useMutation({
    onSuccess: () => {
      setConversationId(null)
      setMessages([])
    },
  })

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length || streamingContent) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }, [messages.length, streamingContent])

  const handleSend = useCallback(async () => {
    const message = inputText.trim()
    if (!message || isLoading) return

    // Clear input immediately
    setInputText('')

    // Add user message to UI
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
    }
    setMessages(prev => [...prev, userMessage])

    // Start loading
    setIsLoading(true)
    setStreamingContent('')

    try {
      const token = await getToken()
      if (!token) {
        throw new Error('Not authenticated')
      }

      // Use XMLHttpRequest for streaming support in React Native
      const xhr = new XMLHttpRequest()
      xhrRef.current = xhr

      let fullContent = ''
      let receivedLength = 0

      xhr.open('POST', `${getBaseUrl()}/api/chat`)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.setRequestHeader('Authorization', token)

      // Handle streaming via onprogress
      xhr.onprogress = () => {
        const newData = xhr.responseText.substring(receivedLength)
        receivedLength = xhr.responseText.length

        if (newData) {
          fullContent += newData
          setStreamingContent(fullContent)
        }
      }

      xhr.onload = () => {
        if (xhr.status === 200) {
          // Get conversation ID from header
          const newConvId = xhr.getResponseHeader('X-Conversation-Id')
          if (newConvId && !conversationId) {
            setConversationId(newConvId)
          }

          // Add complete message
          if (fullContent) {
            const assistantMessage: ChatMessage = {
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              content: fullContent,
            }
            setMessages(prev => [...prev, assistantMessage])
          }
        } else {
          throw new Error(`HTTP error: ${xhr.status}`)
        }

        setIsLoading(false)
        setStreamingContent('')
        xhrRef.current = null
      }

      xhr.onerror = () => {
        console.error('XHR error')
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        }
        setMessages(prev => [...prev, errorMessage])
        setIsLoading(false)
        setStreamingContent('')
        xhrRef.current = null
      }

      xhr.send(JSON.stringify({
        message,
        conversationId: conversationId || undefined,
      }))

    } catch (error: any) {
      console.error('Error:', error)
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }
      setMessages(prev => [...prev, errorMessage])
      setIsLoading(false)
      setStreamingContent('')
    }
  }, [inputText, isLoading, conversationId, getToken])

  const handleNewConversation = () => {
    // Cancel any ongoing request
    if (xhrRef.current) {
      xhrRef.current.abort()
      xhrRef.current = null
    }
    setConversationId(null)
    setMessages([])
    setStreamingContent('')
    setIsLoading(false)
  }

  const handleDeleteConversation = () => {
    if (conversationId) {
      deleteConversationMutation.mutate({ id: conversationId })
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View className="bg-white p-4 border-b border-gray-200 flex-row items-center shadow-sm">
          <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
            <Sprout size={24} color="#16A34A" />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-gray-800 text-lg">Jani Assistant</Text>
            <Text className="text-xs text-green-600">Powered by AI</Text>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={handleNewConversation}
              className="p-2 bg-gray-100 rounded-full"
            >
              <Plus size={20} color="#374151" />
            </TouchableOpacity>
            {conversationId && (
              <TouchableOpacity
                onPress={handleDeleteConversation}
                className="p-2 bg-red-50 rounded-full"
              >
                <Trash2 size={20} color="#DC2626" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Chat Area */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 p-4"
          contentContainerStyle={{ gap: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 && !isLoading ? (
            // Welcome message
            <View className="items-start">
              <View className="flex-row items-start">
                <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-2 mt-1">
                  <Sprout size={16} color="#16A34A" />
                </View>
                <View className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[85%]">
                  <Text className="text-sm text-gray-700">
                    Hello! I'm Jani, your farming assistant. I can help you with:
                  </Text>
                  <View className="mt-2 pl-2">
                    <Text className="text-xs text-gray-600 mb-1">• Pest and disease identification</Text>
                    <Text className="text-xs text-gray-600 mb-1">• Crop management advice</Text>
                    <Text className="text-xs text-gray-600 mb-1">• Weather-based recommendations</Text>
                    <Text className="text-xs text-gray-600 mb-1">• Fertilizer and soil tips</Text>
                  </View>
                  <Text className="text-sm text-gray-700 mt-2">
                    How can I help you today?
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            // Messages
            messages.map((message) => (
              <View
                key={message.id}
                className={message.role === 'user' ? 'items-end' : 'items-start'}
              >
                {message.role === 'user' ? (
                  <View className="bg-green-600 p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[80%]">
                    <Text className="text-sm text-white">{message.content}</Text>
                  </View>
                ) : (
                  <View className="flex-row items-start max-w-[85%]">
                    <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-2 mt-1">
                      <Sprout size={16} color="#16A34A" />
                    </View>
                    <View className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex-1">
                      <Text className="text-sm text-gray-700">{message.content}</Text>
                    </View>
                  </View>
                )}
              </View>
            ))
          )}

          {/* Streaming/Loading response */}
          {isLoading && (
            <View className="items-start">
              <View className="flex-row items-start max-w-[85%]">
                <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-2 mt-1">
                  <Sprout size={16} color="#16A34A" />
                </View>
                <View className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex-1">
                  {streamingContent ? (
                    <Text className="text-sm text-gray-700">{streamingContent}</Text>
                  ) : (
                    <View className="flex-row items-center gap-2">
                      <ActivityIndicator size="small" color="#16A34A" />
                      <Text className="text-sm text-gray-500">Thinking...</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View className="p-4 bg-white border-t border-gray-200">
          <View className="flex-row gap-2 items-end">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask about pests, crops, weather..."
              className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-800 max-h-24"
              placeholderTextColor="#9CA3AF"
              multiline
              onSubmitEditing={handleSend}
              returnKeyType="send"
              blurOnSubmit={false}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!inputText.trim() || isLoading}
              className={`p-3 rounded-full shadow-md ${
                inputText.trim() && !isLoading ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <ArrowUp size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
