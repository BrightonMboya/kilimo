import React from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Send, Sparkles } from 'lucide-react-native'
import { trpc } from '../../utils/api'

type UiMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  pending?: boolean
}

const SUGGESTED_PROMPTS = [
  'How do I treat coffee leaf rust?',
  'Best time to plant maize in Kenya?',
  'How do I know if my soil needs lime?',
  'What is EUDR and how do I comply?',
]

export default function AIChat() {
  const [conversationId, setConversationId] = React.useState<string | undefined>()
  const [input, setInput] = React.useState('')
  const [messages, setMessages] = React.useState<UiMessage[]>([])
  const listRef = React.useRef<FlatList<UiMessage>>(null)

  const sendMessage = trpc.chat.sendMessage.useMutation({
    onSuccess: (res) => {
      setConversationId(res.conversationId)
      setMessages((prev) => {
        // Replace the pending assistant placeholder with the real response
        const withoutPending = prev.filter((m) => !m.pending)
        return [
          ...withoutPending,
          { id: res.assistantMessage.id, role: 'assistant', content: res.assistantMessage.content },
        ]
      })
    },
    onError: (err) => {
      setMessages((prev) => {
        const withoutPending = prev.filter((m) => !m.pending)
        return [
          ...withoutPending,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: `Sorry, I couldn't respond: ${err.message}`,
          },
        ]
      })
    },
  })

  const onSend = (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || sendMessage.isPending) return

    const userMsg: UiMessage = {
      id: `local-${Date.now()}`,
      role: 'user',
      content,
    }
    const pendingMsg: UiMessage = {
      id: `pending-${Date.now()}`,
      role: 'assistant',
      content: '',
      pending: true,
    }
    setMessages((prev) => [...prev, userMsg, pendingMsg])
    setInput('')

    sendMessage.mutate({ conversationId, message: content })
  }

  React.useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100)
    }
  }, [messages.length])

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <View className="px-6 pt-4 pb-3 border-b border-gray-100 flex-row items-center">
          <View className="w-10 h-10 bg-green-50 rounded-full items-center justify-center mr-3">
            <Sparkles size={20} color="#16A34A" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900">Jani Assistant</Text>
            <Text className="text-gray-500 text-xs">Your farming AI — ask anything</Text>
          </View>
        </View>

        {messages.length === 0 ? (
          <View className="flex-1 px-6 pt-8">
            <Text className="text-gray-500 text-center mb-6">
              Ask about crops, pests, soil, weather, or compliance.
            </Text>
            <View className="gap-3">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <TouchableOpacity
                  key={prompt}
                  onPress={() => onSend(prompt)}
                  className="bg-gray-50 border border-gray-100 rounded-2xl p-4 active:bg-gray-100"
                >
                  <Text className="text-gray-700">{prompt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16 }}
            ItemSeparatorComponent={() => <View className="h-3" />}
            renderItem={({ item }) => (
              <View className={`flex-row ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <View
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    item.role === 'user'
                      ? 'bg-green-700 rounded-br-md'
                      : 'bg-gray-100 rounded-bl-md'
                  }`}
                >
                  {item.pending ? (
                    <View className="flex-row items-center">
                      <ActivityIndicator size="small" color="#6B7280" />
                      <Text className="ml-2 text-gray-500">Thinking…</Text>
                    </View>
                  ) : (
                    <Text className={item.role === 'user' ? 'text-white' : 'text-gray-900'}>
                      {item.content}
                    </Text>
                  )}
                </View>
              </View>
            )}
          />
        )}

        <View className="px-4 py-3 border-t border-gray-100 flex-row items-end gap-2">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask Jani about your farm…"
            placeholderTextColor="#9CA3AF"
            multiline
            className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 text-base"
            style={{ maxHeight: 120 }}
          />
          <TouchableOpacity
            onPress={() => onSend()}
            disabled={!input.trim() || sendMessage.isPending}
            className={`w-11 h-11 rounded-full items-center justify-center ${
              !input.trim() || sendMessage.isPending ? 'bg-gray-300' : 'bg-green-700 active:bg-green-800'
            }`}
          >
            <Send size={18} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
