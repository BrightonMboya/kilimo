import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useSignUp, useOAuth, useAuth } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as WebBrowser from 'expo-web-browser'

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession()

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

export default function SignUpScreen() {
  useWarmUpBrowser()
  const { isLoaded, signUp, setActive } = useSignUp()
  const { signOut, isSignedIn } = useAuth()
  const router = useRouter()
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

  const [fullName, setFullName] = React.useState('')
  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [error, setError] = React.useState('')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    setError('') // Clear previous errors

    // Sign out any existing session first to prevent "Session already exists" error
    if (isSignedIn) {
      await signOut()
    }

    // Split full name into first and last name
    const nameParts = fullName.trim().split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
      })
      

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err: any) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
      setError(err.errors?.[0]?.message || 'An error occurred during sign up')
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    setError('') // Clear previous errors
    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
        setError('Verification incomplete. Please try again.')
      }
    } catch (err: any) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
      setError(err.errors?.[0]?.message || 'Invalid verification code')
    }
  }

  const onGoogleSignUpPress = React.useCallback(async () => {
    setError('') // Clear previous errors

    // Sign out any existing session first to prevent "Session already exists" error
    if (isSignedIn) {
      await signOut()
    }

    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow()

      if (createdSessionId) {
        setActive && setActive({ session: createdSessionId })
        router.replace('/')
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err: any) {
      console.error('OAuth error', err)
      setError(err.errors?.[0]?.message || 'Google sign up failed. Please try again.')
    }
  }, [isSignedIn, signOut, startOAuthFlow, router])

  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-center px-8"
        >
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">Verify Email</Text>
            <Text className="text-gray-500 text-base">
              Enter the verification code sent to your email.
            </Text>
          </View>

          <View className="gap-4">
            <View>
              <Text className="text-gray-700 font-medium mb-2">Verification Code</Text>
              <TextInput
                value={code}
                placeholder="Ex: 123456"
                placeholderTextColor="#9CA3AF"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                onChangeText={(code) => setCode(code)}
                keyboardType="number-pad"
              />
            </View>

            {/* Error Message */}
            {error ? (
              <View className="bg-red-50 border border-red-200 rounded-xl p-3 mt-4">
                <Text className="text-red-600 text-sm">{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={onVerifyPress}
              className="w-full bg-blue-600 rounded-xl py-4 active:bg-blue-700 mt-4 shadow-sm"
            >
              <Text className="text-white text-center font-semibold text-lg">Verify & Continue</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="px-8">
          <View className="mb-10">
            <Text className="text-4xl font-bold text-gray-900 mb-3">Create Account</Text>
            <Text className="text-gray-500 text-lg">
              Sign up to get started with Farmers App
            </Text>
          </View>

          <View className="gap-5">
            <View>
              <Text className="text-gray-700 font-medium mb-2">Full Name</Text>
              <TextInput
                value={fullName}
                placeholder="John Doe"
                placeholderTextColor="#9CA3AF"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                onChangeText={(text) => setFullName(text)}
              />
            </View>

            <View>
              <Text className="text-gray-700 font-medium mb-2">Email Address</Text>
              <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="hello@example.com"
                placeholderTextColor="#9CA3AF"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                onChangeText={(email) => setEmailAddress(email)}
                keyboardType="email-address"
              />
            </View>

            <View>
              <Text className="text-gray-700 font-medium mb-2">Password</Text>
              <TextInput
                value={password}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={true}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                onChangeText={(password) => setPassword(password)}
              />
            </View>

            {/* Error Message */}
            {error ? (
              <View className="bg-red-50 border border-red-200 rounded-xl p-3 mt-4">
                <Text className="text-red-600 text-sm">{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={onSignUpPress}
              className="w-full bg-blue-600 rounded-xl py-4 active:bg-blue-700 mt-6 shadow-sm"
            >
              <Text className="text-white text-center font-semibold text-lg">Create Account</Text>
            </TouchableOpacity>

            <View className="flex-row items-center my-4">
              <View className="flex-1 h-[1px] bg-gray-200" />
              <Text className="mx-4 text-gray-400">OR</Text>
              <View className="flex-1 h-[1px] bg-gray-200" />
            </View>

            <TouchableOpacity
              onPress={onGoogleSignUpPress}
              className="w-full bg-white border border-gray-200 rounded-xl py-4 active:bg-gray-50 shadow-sm flex-row justify-center items-center gap-3"
            >
              {/* Google Icon SVG */}
              <View className="w-6 h-6 justify-center items-center">
                 <Text className="font-bold text-lg">G</Text>
              </View>
              <Text className="text-gray-700 text-center font-semibold text-lg">Sign up with Google</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center items-center mt-6 gap-2">
              <Text className="text-gray-500 text-base">Already have an account?</Text>
              <Link href="/sign-in" asChild>
                <TouchableOpacity>
                  <Text className="text-blue-600 font-semibold text-base">Sign in</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}