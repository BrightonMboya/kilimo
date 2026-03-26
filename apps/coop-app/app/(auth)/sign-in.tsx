import { useSignIn, useOAuth, useAuth } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as WebBrowser from 'expo-web-browser'
import { Leaf } from 'lucide-react-native'

WebBrowser.maybeCompleteAuthSession()

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

export default function Page() {
  useWarmUpBrowser()
  const { signIn, setActive, isLoaded } = useSignIn()
  const { signOut, isSignedIn } = useAuth()
  const router = useRouter()
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')

  const onSignInPress = async () => {
    if (!isLoaded) return
    setError('')

    if (isSignedIn) {
      await signOut()
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
        setError('Sign in incomplete. Please try again.')
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      setError(err.errors?.[0]?.message || 'Invalid email or password')
    }
  }

  const onGoogleSignInPress = React.useCallback(async () => {
    setError('')

    if (isSignedIn) {
      await signOut()
    }

    try {
      const { createdSessionId, setActive } = await startOAuthFlow()

      if (createdSessionId) {
        setActive && setActive({ session: createdSessionId })
        router.replace('/')
      }
    } catch (err: any) {
      console.error('OAuth error', err)
      setError(err.errors?.[0]?.message || 'Google sign in failed. Please try again.')
    }
  }, [isSignedIn, signOut, startOAuthFlow, router])

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="px-8">
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-emerald-700 rounded-2xl items-center justify-center mb-4">
              <Leaf size={32} color="white" />
            </View>
            <Text className="text-sm font-medium text-emerald-700 tracking-wider">JANI COOP</Text>
          </View>

          <View className="mb-10">
            <Text className="text-4xl font-bold text-gray-900 mb-3">Welcome Back</Text>
            <Text className="text-gray-500 text-lg">
              Sign in to manage your cooperative
            </Text>
          </View>

          <View className="gap-5">
            <View>
              <Text className="text-gray-700 font-medium mb-2">Email Address</Text>
              <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="hello@example.com"
                placeholderTextColor="#9CA3AF"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-base"
                onChangeText={setEmailAddress}
                keyboardType="email-address"
              />
            </View>

            <View>
              <Text className="text-gray-700 font-medium mb-2">Password</Text>
              <TextInput
                value={password}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={true}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-base"
                onChangeText={setPassword}
              />
            </View>

            {error ? (
              <View className="bg-red-50 border border-red-200 rounded-xl p-3">
                <Text className="text-red-600 text-sm">{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={onSignInPress}
              className="w-full bg-emerald-700 rounded-xl py-4 active:bg-emerald-800 mt-6 shadow-sm"
            >
              <Text className="text-white text-center font-semibold text-lg">Sign In</Text>
            </TouchableOpacity>

            <View className="flex-row items-center my-4">
              <View className="flex-1 h-[1px] bg-gray-200" />
              <Text className="mx-4 text-gray-400">OR</Text>
              <View className="flex-1 h-[1px] bg-gray-200" />
            </View>

            <TouchableOpacity
              onPress={onGoogleSignInPress}
              className="w-full bg-white border border-gray-200 rounded-xl py-4 active:bg-gray-50 shadow-sm flex-row justify-center items-center gap-3"
            >
              <View className="w-6 h-6 justify-center items-center">
                <Text className="font-bold text-lg">G</Text>
              </View>
              <Text className="text-gray-700 text-center font-semibold text-lg">Sign in with Google</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center items-center mt-6 gap-2">
              <Text className="text-gray-500 text-base">Don't have an account?</Text>
              <Link href="/sign-up" asChild>
                <TouchableOpacity>
                  <Text className="text-emerald-700 font-semibold text-base">Sign up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
