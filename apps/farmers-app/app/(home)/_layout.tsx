import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Slot } from 'expo-router'

export default function HomeLayout() {
  const { isSignedIn } = useAuth()

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-up" />
  }

  return <Slot />
}