import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";

// import { api } from "~/utils/api";

const PendingEmailVerification = ({
  userName,
  emailAddress,
  phoneNumber,
}: any) => {
  const [verifyEmailError, setVerifyEmailError] = React.useState("");
  const [code, setCode] = React.useState("");
  const { isLoaded, signUp, setActive } = useSignUp();

  // recording the userEmail to our database
  // const { mutate } = api.farmer.addNew.useMutation();

  // This verifies the user using email code that is delivered.
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      // mutate({
      //   email: completeSignUp.emailAddress as string,
      //   phoneNumber: phoneNumber,
      //   userName: userName,
      // });

      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err: any) {
      // console.error(JSON.stringify(err, null, 2));
      setVerifyEmailError(err.errors[0].longMessage);
    }
  };
  return (
    <View className="flex h-screen flex-col items-center justify-center ">
      <View>
        <Text className="text-lg font-bold text-white">
          Enter the code sent to your email address
        </Text>
        <Text className="pt-1 text-center text-sm font-ligh text-white">
          Check your spam folder if you don't see the email.
        </Text>

        {verifyEmailError && (
          <View>
            <Text className="mt-5 font-medium text-red-500">
              {verifyEmailError}
            </Text>
          </View>
        )}

        <View className="flex flex-row items-center justify-center gap-5 pt-[40px]">
          <TextInput
            value={code}
            placeholder="Code..."
            onChangeText={(code) => setCode(code)}
            placeholderTextColor="#f1f1f1"
            className="w-[150px] border-b-[1px] border-[#f1f1f1] py-2 text-white"
          />
          <TouchableOpacity onPress={onPressVerify}>
            <View className="rounded-md bg-indigo-500 ">
              <Text className="px-4 py-2 text-center font-medium text-white">
                Verify Email
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PendingEmailVerification;